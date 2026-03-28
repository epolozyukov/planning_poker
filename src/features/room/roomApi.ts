import { RoomState, CreateRoomPayload, JoinRoomPayload, UpdateSettingsPayload } from "@/shared/types";

export async function createRoom(payload: CreateRoomPayload): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to create room");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function getRoom(roomId: string): Promise<RoomState | null> {
  const response = await fetch(`/api/room?id=${encodeURIComponent(roomId)}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function joinRoom(payload: JoinRoomPayload): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "join", ...payload }),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to join room");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function submitVote(
  roomId: string,
  participantId: string,
  vote: string | null
): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "vote", roomId, participantId, vote }),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to submit vote");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function revealVotes(
  roomId: string,
  participantId: string
): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reveal", roomId, participantId }),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to reveal votes");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function startNewRound(
  roomId: string,
  participantId: string
): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "newRound", roomId, participantId }),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to start new round");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}

export async function sendHeartbeat(
  roomId: string,
  participantId: string
): Promise<void> {
  await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "heartbeat", roomId, participantId }),
  }).catch(() => {});
}

export async function updateSettings(
  payload: UpdateSettingsPayload
): Promise<RoomState> {
  const response = await fetch("/api/room", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "settings", ...payload }),
  });

  if (!response.ok) {
    const data = await response.json() as { error?: string };
    throw new Error(data.error ?? "Failed to update settings");
  }

  const data = await response.json() as { data: RoomState };
  return data.data;
}
