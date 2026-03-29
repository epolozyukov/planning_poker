"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoomState } from "@/shared/types";
import { useRoom } from "@/features/room/useRoom";
import { usePresence } from "@/features/presence/usePresence";
import { VotingPanel } from "@/features/voting/VotingPanel";
import { RevealPanel } from "@/features/reveal/RevealPanel";
import { ResultsPanel } from "@/features/results/ResultsPanel";
import { ParticipantList } from "@/features/presence/ParticipantList";
import { QuoteBanner } from "@/features/reveal/QuoteBanner";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { useToast } from "@/shared/components/Toast";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { generateParticipantId } from "@/shared/utils/idGen";
import { getRandomColor } from "@/shared/utils/colors";
import { sanitizeNickname, validateNickname } from "@/shared/utils/sanitize";
import { joinRoom, updateSettings } from "@/features/room/roomApi";
import { fetchQuote } from "@/api/quoteClient";
import { calculateStats } from "@/shared/utils/stats";
import { MAX_NICKNAME_LENGTH } from "@/shared/config";
import { useStarWars } from "@/features/starwars/StarWarsContext";
import { getLabels } from "@/features/starwars/swText";
import { SwBackground } from "@/features/starwars/SwBackground";

interface StoredIdentity {
  participantId: string;
  nickname: string;
  color: string;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { isSwMode, toggleSwMode } = useStarWars();
  const labels = getLabels(isSwMode);
  const roomId = (params.roomId as string).toUpperCase();

  // Stored identity (persisted across refreshes, loaded after mount to avoid hydration mismatch)
  const [identity, setIdentity] = useLocalStorage<StoredIdentity | null>(
    `pp-identity-${roomId}`,
    null
  );

  // Nickname prompt state
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(true);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Quote state
  const [quote, setQuote] = useState<string | null>(null);
  const lastRevealRound = useRef<number | null>(null);
  const dismissQuote = useCallback(() => setQuote(null), []);

  // Story label (host-controlled, always visible)
  const [storyLabel, setStoryLabel] = useState("");

  // Room polling — enabled once joined
  const { room, loading, error, setRoom } = useRoom({
    roomId,
    participantId: identity?.participantId ?? null,
    enabled: hasJoined,
  });

  // Presence heartbeat
  usePresence({
    roomId,
    participantId: identity?.participantId ?? null,
    enabled: hasJoined,
  });

  // Auto-join when identity loads from localStorage (runs whenever identity changes)
  useEffect(() => {
    if (identity && !hasJoined) {
      handleAutoJoin(identity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  // Detect reveal → fetch quote; detect new voting round → clear quote
  useEffect(() => {
    if (!room) return;

    if (room.phase === "voting") {
      setQuote(null);
      return;
    }

    if (
      room.phase === "revealed" &&
      room.settings.quotesEnabled &&
      lastRevealRound.current !== room.round
    ) {
      lastRevealRound.current = room.round;
      const stats = calculateStats(room.votes);
      const voteValues = Object.values(room.votes).filter(
        (v): v is string => v !== null
      );
      fetchQuote({
        roomId: room.id,
        context: {
          voteCount: stats.totalCount,
          spread: stats.spread,
          hasInfinity: stats.hasInfinity,
          hasCoffee: stats.hasCoffee,
          votes: voteValues,
        },
      }).then((q) => {
        if (q) setQuote(q);
      });
    }
  }, [room?.phase, room?.round, room?.settings.quotesEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync story label from room (including clearing it when a new round starts)
  useEffect(() => {
    setStoryLabel(room?.storyLabel ?? "");
  }, [room?.storyLabel]);

  const handleAutoJoin = async (id: StoredIdentity) => {
    try {
      const updatedRoom = await joinRoom({
        roomId,
        participantId: id.participantId,
        nickname: id.nickname,
        color: id.color,
      });
      setRoom(updatedRoom);
      setStoryLabel(updatedRoom.storyLabel ?? "");
      setHasJoined(true);
      setShowNicknamePrompt(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("not found")) {
        showToast("This room has expired. Please create a new one.", "error");
        router.push("/");
      } else {
        showToast("Could not rejoin — please enter your name again.", "error");
        setIdentity(null);
        setShowNicknamePrompt(true);
      }
    }
  };

  const handleJoinRoom = async () => {
    const cleaned = sanitizeNickname(nicknameInput);
    const err = validateNickname(cleaned);
    if (err) {
      setNicknameError(err);
      return;
    }

    setJoining(true);
    setNicknameError(null);

    const participantId = identity?.participantId ?? generateParticipantId();
    const color = identity?.color ?? getRandomColor();

    try {
      const updatedRoom = await joinRoom({
        roomId,
        participantId,
        nickname: cleaned,
        color,
      });

      const newIdentity: StoredIdentity = { participantId, nickname: cleaned, color };
      setIdentity(newIdentity);
      setRoom(updatedRoom);
      setStoryLabel(updatedRoom.storyLabel ?? "");
      setHasJoined(true);
      setShowNicknamePrompt(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to join room";
      if (msg.includes("not found")) {
        showToast("This room doesn't exist or has expired.", "error");
        router.push("/");
      } else {
        setNicknameError(msg);
      }
    } finally {
      setJoining(false);
    }
  };

  const handleToggleQuotes = async () => {
    if (!room || !identity) return;
    try {
      const updated = await updateSettings({
        roomId: room.id,
        participantId: identity.participantId,
        settings: { quotesEnabled: !room.settings.quotesEnabled },
      });
      setRoom(updated);
    } catch {
      showToast("Failed to update settings", "error");
    }
  };

  const handleSaveStoryLabel = async () => {
    if (!room || !identity) return;
    try {
      const updated = await updateSettings({
        roomId: room.id,
        participantId: identity.participantId,
        settings: { quotesEnabled: room.settings.quotesEnabled },
        storyLabel,
      });
      setRoom(updated);
    } catch {
      showToast("Failed to save story label", "error");
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Room link copied!", "success");
    }).catch(() => {
      showToast("Copy failed — please copy the URL manually", "error");
    });
  };

  // Loading state
  if (loading && !room) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-700 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-green-400 text-sm">Loading room...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !room && hasJoined) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
        <div className="card-felt p-8 text-center max-w-sm space-y-4">
          <div className="text-4xl">🃏</div>
          <h2 className="text-xl font-bold text-white">Room Not Found</h2>
          <p className="text-green-400 text-sm">
            This room may have expired or never existed.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Create New Room
          </Button>
        </div>
      </div>
    );
  }

  // Nickname prompt — shown to new users and returning users while identity loads
  if (showNicknamePrompt || !hasJoined) {
    return (
      <div className="min-h-screen bg-green-950 felt-texture flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-800 rounded-2xl shadow-xl mb-3 border border-green-700/60">
              <span className="text-2xl">{isSwMode ? "⚡" : "♠"}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{labels.joinRoom}</h1>
            <p className="text-green-400 text-sm mt-1">
              {isSwMode ? labels.roomId : "Room"} <span className="font-mono font-bold text-amber-400">{roomId}</span>
            </p>
          </div>

          <div className="card-felt p-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="nickname"
                className="block text-sm font-semibold text-green-300 uppercase tracking-wider"
              >
                {labels.yourNickname}
              </label>
              <input
                id="nickname"
                type="text"
                value={nicknameInput}
                onChange={(e) => {
                  setNicknameInput(e.target.value);
                  setNicknameError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoinRoom();
                }}
                placeholder="Enter your name..."
                maxLength={MAX_NICKNAME_LENGTH}
                className="input-base"
                autoFocus
                aria-describedby={nicknameError ? "nickname-error" : undefined}
              />
              {nicknameError && (
                <p id="nickname-error" className="text-red-400 text-xs mt-1" role="alert">
                  {nicknameError}
                </p>
              )}
            </div>

            <Button
              onClick={handleJoinRoom}
              loading={joining}
              size="lg"
              className="w-full"
            >
              {labels.joinTable}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!room || !identity) return null;

  const isHost = room.participants[identity.participantId]?.isHost ?? false;
  const participantCount = Object.keys(room.participants).length;
  const voteCount = Object.values(room.votes).filter((v) => v !== null).length;

  return (
    <div className="min-h-screen bg-green-950 felt-texture">
      {/* Chewbacca + Millennium Falcon background in SW mode */}
      {isSwMode && <SwBackground />}

      {/* AI Quote banner — fixed top, above header */}
      {quote && <QuoteBanner quote={quote} onDismiss={dismissQuote} />}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-green-950/90 backdrop-blur-sm border-b border-green-800/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xl" aria-hidden="true">{isSwMode ? "⚡" : "♠"}</span>
            <span className="text-sm font-bold text-white hidden sm:block">{labels.appName}</span>
          </div>

          {/* Room code + copy */}
          <div className="flex items-center gap-2">
            <Badge variant="default">
              <span className="font-mono tracking-widest text-xs">{roomId}</span>
            </Badge>
            <button
              onClick={copyRoomLink}
              className="text-green-500 hover:text-green-300 transition-colors"
              title="Copy room link"
              aria-label="Copy room link"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Round & Phase */}
          <div className="flex items-center gap-2 ml-1">
            <Badge variant={room.phase === "revealed" ? "warning" : "success"}>
              {labels.round(room.round)}
            </Badge>
            <Badge variant={room.phase === "revealed" ? "warning" : "info"}>
              {labels.phase(room.phase as "voting" | "revealed")}
            </Badge>
          </div>

          <div className="flex-1" />

          {/* SW Mode toggle */}
          <button
            onClick={toggleSwMode}
            className={[
              "text-xs border rounded-lg px-2 py-1 transition-colors flex items-center gap-1",
              isSwMode
                ? "text-yellow-400 border-yellow-600/70 bg-yellow-950/30 hover:border-yellow-400"
                : "text-green-400 border-green-700 hover:text-amber-300 hover:border-amber-600",
            ].join(" ")}
            title={labels.swToggleLabel}
            aria-label={labels.swToggleLabel}
          >
            <span>{isSwMode ? "🌌" : "⚡"}</span>
            <span className="hidden sm:inline">{labels.swToggleLabel}</span>
          </button>

          {/* New Room button */}
          <a
            href="/"
            className="text-xs text-green-500 hover:text-green-300 border border-green-800 hover:border-green-600 rounded-lg px-2.5 py-1 transition-colors hidden sm:block"
          >
            {labels.newRoom}
          </a>

          {/* Participants count */}
          <div className="text-green-400 text-sm hidden sm:flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{participantCount}</span>
          </div>

          {/* AI Quotes toggle — always visible for host */}
          {isHost && (
            <div className="flex items-center gap-2 border-l border-green-800/60 pl-3 ml-1">
              <span className="text-xs text-green-400 hidden sm:block">{labels.aiQuotes}</span>
              <button
                onClick={handleToggleQuotes}
                role="switch"
                aria-checked={room.settings.quotesEnabled}
                aria-label="Toggle AI Quotes"
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
              >
                <div className={[
                  "relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
                  room.settings.quotesEnabled ? "bg-amber-500" : "bg-green-800 border border-green-700",
                ].join(" ")}>
                  <div className={[
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                    room.settings.quotesEnabled ? "translate-x-5" : "translate-x-0.5",
                  ].join(" ")} />
                </div>
                <span className={[
                  "text-xs font-medium transition-colors hidden sm:block",
                  room.settings.quotesEnabled ? "text-amber-300" : "text-green-500",
                ].join(" ")}>
                  {room.settings.quotesEnabled ? "On" : "Off"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Host controls bar — always visible for host */}
        {isHost && (
          <div className="border-t border-green-800/40 bg-green-950/80 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <span className="text-xs text-green-500 flex-shrink-0">{labels.estimatingPrefix}</span>
              <input
                type="text"
                value={storyLabel}
                onChange={(e) => setStoryLabel(e.target.value.slice(0, 200))}
                onBlur={handleSaveStoryLabel}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveStoryLabel(); }}
                placeholder={labels.storyPlaceholder}
                className="flex-1 bg-transparent text-sm text-green-200 placeholder-green-700 border-none outline-none focus:text-white"
              />
            </div>
          </div>
        )}

        {/* Non-host story label display */}
        {!isHost && room.storyLabel && (
          <div className="border-t border-green-800/40 bg-green-900/40 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <span className="text-green-500 text-xs">{labels.estimatingPrefix}</span>
              <span className="text-green-200 text-sm font-medium">{room.storyLabel}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
          {/* Left column: voting + reveal */}
          <div className="lg:col-span-2 space-y-6">
            <section className="card-felt p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                  {room.phase === "revealed" ? labels.individualVotes : labels.chooseCard}
                </h2>
                <div className="flex items-center gap-2 text-xs text-green-500">
                  <span className="capitalize">{room.deck}</span>
                  <span>deck</span>
                </div>
              </div>

              {room.phase === "revealed" ? (
                <ResultsPanel room={room} />
              ) : (
                <VotingPanel
                  room={room}
                  participantId={identity.participantId}
                  onRoomUpdate={setRoom}
                />
              )}
            </section>

            <section className="card-felt p-4 lg:p-6">
              <RevealPanel
                room={room}
                participantId={identity.participantId}
                isHost={isHost}
                onRoomUpdate={setRoom}
              />
            </section>

            {/* Mobile: participants */}
            <div className="lg:hidden card-felt p-6">
              <ParticipantList
                room={room}
                currentParticipantId={identity.participantId}
              />
            </div>
          </div>

          {/* Right column: participants + info */}
          <aside className="hidden lg:block space-y-6">
            <section className="card-felt p-6">
              <ParticipantList
                room={room}
                currentParticipantId={identity.participantId}
              />
            </section>

            {room.phase === "voting" && (
              <section className="card-felt p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-green-400">
                    <span>{labels.participants}</span>
                    <span>{labels.votesSubmitted(voteCount, participantCount)}</span>
                  </div>
                  <div className="w-full bg-green-900 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: participantCount > 0
                          ? `${(voteCount / participantCount) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="card-felt p-4 space-y-3">
              <h3 className="text-green-300 text-xs font-semibold uppercase tracking-wider">{labels.roomInfo}</h3>
              <div className="space-y-2 text-sm">
                <InfoRow label={labels.roomId} value={<span className="font-mono text-amber-400">{roomId}</span>} />
                <InfoRow label={labels.deck} value={<span className="capitalize">{room.deck}</span>} />
                <InfoRow label={labels.roundLabel} value={String(room.round)} />
              </div>
              <Button variant="ghost" size="sm" onClick={copyRoomLink} className="w-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {labels.copyInviteLink}
              </Button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-green-500">{label}</span>
      <span className="text-green-200">{value}</span>
    </div>
  );
}
