import { NextRequest, NextResponse } from "next/server";
import { RoomState } from "@/shared/types";
import { getDeck } from "@/shared/utils/deck";
import {
  getRoom,
  setRoom,
  getRateLimitCount,
  incrementRateLimit,
} from "@/api/storage";
import { generateRoomCode } from "@/shared/utils/idGen";
import { sanitizeNickname, sanitizeRoomId, sanitizeStoryLabel } from "@/shared/utils/sanitize";
import {
  ROOM_CREATION_RATE_LIMIT,
  VOTE_RATE_LIMIT,
  MAX_PARTICIPANTS,
  MAX_NICKNAME_LENGTH,
  MIN_NICKNAME_LENGTH,
} from "@/shared/config";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function jsonOk<T>(data: T) {
  return NextResponse.json({ data });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawId = searchParams.get("id");
  if (!rawId) return jsonError("Missing id parameter", 400);

  const roomId = sanitizeRoomId(rawId);
  if (!roomId || roomId.length !== 6) return jsonError("Invalid room ID", 400);

  const room = await getRoom(roomId);
  if (!room) return jsonError("Room not found", 404);

  return jsonOk(room);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `create:${ip}`;
  const count = await incrementRateLimit(rateLimitKey);

  if (count > ROOM_CREATION_RATE_LIMIT) {
    return jsonError("Rate limit exceeded. Please wait before creating another room.", 429);
  }

  let body: { deck?: string };
  try {
    body = await req.json() as { deck?: string };
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const deck = body.deck === "sequence" ? "sequence" : "fibonacci";

  const roomId = generateRoomCode();
  const now = new Date().toISOString();

  const room: RoomState = {
    id: roomId,
    deck,
    phase: "voting",
    round: 1,
    participants: {},
    votes: {},
    createdAt: now,
    updatedAt: now,
    settings: { quotesEnabled: true },
  };

  await setRoom(room);
  return jsonOk(room);
}

export async function PUT(req: NextRequest) {
  try {
    return await handlePUT(req);
  } catch (err) {
    console.error("[PUT /api/room] Unhandled error:", err);
    return jsonError("Internal server error", 500);
  }
}

async function handlePUT(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const action = body.action as string;

  // Heartbeats are high-frequency internal pings — exclude from vote rate limit
  if (action !== "heartbeat") {
    const ip = getClientIp(req);
    const rateLimitKey = `vote:${ip}`;
    const count = await incrementRateLimit(rateLimitKey);

    if (count > VOTE_RATE_LIMIT) {
      return jsonError("Rate limit exceeded. Please slow down.", 429);
    }
  }
  const roomId = sanitizeRoomId(String(body.roomId ?? ""));

  if (!roomId || roomId.length !== 6) {
    return jsonError("Invalid room ID", 400);
  }

  const room = await getRoom(roomId);
  if (!room) return jsonError("Room not found", 404);

  const participantId = String(body.participantId ?? "").replace(/[^a-f0-9]/g, "").slice(0, 32);
  if (!participantId) return jsonError("Missing participantId", 400);

  const now = new Date().toISOString();

  switch (action) {
    case "join": {
      const rawNickname = String(body.nickname ?? "");
      const nickname = sanitizeNickname(rawNickname);
      if (nickname.length < MIN_NICKNAME_LENGTH || nickname.length > MAX_NICKNAME_LENGTH) {
        return jsonError("Invalid nickname length", 400);
      }

      const color = String(body.color ?? "#22c55e").replace(/[^#a-fA-F0-9]/g, "").slice(0, 7);
      const existingParticipant = room.participants[participantId];

      // Allow rejoins even when room is full; only block genuinely new participants
      if (!existingParticipant && Object.keys(room.participants).length >= MAX_PARTICIPANTS) {
        return jsonError("Room is full", 400);
      }
      const isFirstParticipant = Object.keys(room.participants).length === 0;

      // Preserve host status if rejoining; otherwise assign if no host exists
      let isHost: boolean;
      if (existingParticipant) {
        isHost = existingParticipant.isHost;
      } else if (isFirstParticipant) {
        isHost = true;
      } else {
        const existingHost = Object.values(room.participants).find((p) => p.isHost);
        isHost = !existingHost;
      }

      room.participants[participantId] = {
        nickname,
        color,
        lastSeen: now,
        joinedAt: room.participants[participantId]?.joinedAt ?? now,
        isHost,
      };
      room.votes[participantId] = room.votes[participantId] ?? null;

      await setRoom(room);
      return jsonOk(room);
    }

    case "vote": {
      if (!room.participants[participantId]) {
        return jsonError("Participant not found", 404);
      }
      if (room.phase === "revealed") {
        return jsonError("Voting is closed", 400);
      }

      let vote: string | null;
      if (body.vote === null || body.vote === undefined) {
        vote = null;
      } else {
        const rawVote = String(body.vote);
        const validCards = getDeck(room.deck).map(String);
        if (!validCards.includes(rawVote)) {
          return jsonError("Invalid vote value", 400);
        }
        vote = rawVote;
      }
      room.votes[participantId] = vote;
      room.participants[participantId].lastSeen = now;

      await setRoom(room);
      return jsonOk(room);
    }

    case "reveal": {
      if (!room.participants[participantId]) {
        return jsonError("Participant not found", 404);
      }
      if (!room.participants[participantId].isHost) {
        return jsonError("Only the host can reveal votes", 403);
      }
      if (room.phase === "revealed") {
        return jsonError("Already revealed", 400);
      }

      const hasVotes = Object.values(room.votes).some((v) => v !== null);
      if (!hasVotes) {
        return jsonError("No votes to reveal", 400);
      }

      room.phase = "revealed";
      room.participants[participantId].lastSeen = now;

      await setRoom(room);
      return jsonOk(room);
    }

    case "newRound": {
      if (!room.participants[participantId]) {
        return jsonError("Participant not found", 404);
      }
      if (!room.participants[participantId].isHost) {
        return jsonError("Only the host can start a new round", 403);
      }
      if (room.phase === "voting") {
        return jsonError("Round already in progress", 400);
      }

      room.phase = "voting";
      room.round += 1;
      room.storyLabel = undefined;

      // Reset all votes
      Object.keys(room.votes).forEach((pid) => {
        room.votes[pid] = null;
      });

      room.participants[participantId].lastSeen = now;

      await setRoom(room);
      return jsonOk(room);
    }

    case "heartbeat": {
      if (!room.participants[participantId]) {
        return jsonError("Participant not found", 404);
      }

      room.participants[participantId].lastSeen = now;

      // Auto-promote host: if current host is inactive, assign to earliest joinedAt active participant
      const currentHost = Object.entries(room.participants).find(([, p]) => p.isHost);
      const HOST_TIMEOUT_MS = 8000;

      if (currentHost) {
        const [hostId, hostData] = currentHost;
        const hostInactive =
          Date.now() - new Date(hostData.lastSeen).getTime() > HOST_TIMEOUT_MS &&
          hostId !== participantId;

        if (hostInactive) {
          // Find earliest joinedAt participant (who is active)
          const activeParticipants = Object.entries(room.participants).filter(
            ([pid]) => {
              const p = room.participants[pid];
              return Date.now() - new Date(p.lastSeen).getTime() <= HOST_TIMEOUT_MS || pid === participantId;
            }
          );

          if (activeParticipants.length > 0) {
            const earliest = activeParticipants.sort(
              ([, a], [, b]) =>
                new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
            )[0];

            if (earliest) {
              const [newHostId] = earliest;
              // Demote old host
              room.participants[hostId].isHost = false;
              // Promote new host
              room.participants[newHostId].isHost = true;
            }
          }
        }
      }

      await setRoom(room);
      return jsonOk({ ok: true });
    }

    case "settings": {
      if (!room.participants[participantId]) {
        return jsonError("Participant not found", 404);
      }
      if (!room.participants[participantId].isHost) {
        return jsonError("Only the host can change settings", 403);
      }

      const settings = body.settings as Partial<RoomState["settings"]> | undefined;
      if (settings) {
        if (typeof settings.quotesEnabled === "boolean") {
          room.settings.quotesEnabled = settings.quotesEnabled;
        }
      }

      if (typeof body.storyLabel === "string") {
        room.storyLabel = sanitizeStoryLabel(body.storyLabel);
      }

      room.participants[participantId].lastSeen = now;
      await setRoom(room);
      return jsonOk(room);
    }

    default:
      return jsonError("Unknown action", 400);
  }
}
