import { DeckType } from "./utils/deck";

export interface Participant {
  nickname: string;
  color: string;
  lastSeen: string;
  joinedAt: string;
  isHost: boolean;
}

export interface RoomState {
  id: string;
  deck: DeckType;
  phase: "voting" | "revealed";
  round: number;
  participants: Record<string, Participant>;
  votes: Record<string, string | null>;
  createdAt: string;
  updatedAt: string;
  settings: {
    quotesEnabled: boolean;
  };
  storyLabel?: string;
}

export interface CreateRoomPayload {
  deck: DeckType;
}

export interface JoinRoomPayload {
  roomId: string;
  participantId: string;
  nickname: string;
  color: string;
}

export interface VotePayload {
  roomId: string;
  participantId: string;
  vote: string | null;
}

export interface RevealPayload {
  roomId: string;
  participantId: string;
}

export interface NewRoundPayload {
  roomId: string;
  participantId: string;
}

export interface UpdateSettingsPayload {
  roomId: string;
  participantId: string;
  settings: Partial<RoomState["settings"]>;
  storyLabel?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface QuoteRequest {
  roomId: string;
  context: {
    voteCount: number;
    spread: number | null;
    hasInfinity: boolean;
    hasCoffee: boolean;
    votes: string[];
  };
}
