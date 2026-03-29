export interface SwLabels {
  appName: string;
  participants: string;
  votesSubmitted: (voted: number, total: number) => string;
  round: (n: number) => string;
  phase: (phase: "voting" | "revealed") => string;
  revealCards: string;
  newRound: string;
  waitingReveal: (voted: number, total: number) => string;
  waitingNewRound: string;
  chooseCard: string;
  yourVote: string;
  newRoom: string;
  copyInviteLink: string;
  aiQuotes: string;
  roomInfo: string;
  roomId: string;
  deck: string;
  roundLabel: string;
  storyPlaceholder: string;
  estimatingPrefix: string;
  individualVotes: string;
  highVariance: string;
  someVariance: string;
  goodConsensus: string;
  infinityMessage: string;
  coffeeMessage: string;
  joinRoom: string;
  yourNickname: string;
  joinTable: string;
  createRoom: string;
  swToggleLabel: string;
}

export const defaultLabels: SwLabels = {
  appName: "Planning Poker",
  participants: "Participants",
  votesSubmitted: (voted, total) => `${voted}/${total} voted`,
  round: (n) => `Round ${n}`,
  phase: (phase) => (phase === "voting" ? "Voting" : "Revealed"),
  revealCards: "Reveal Cards",
  newRound: "New Round",
  waitingReveal: (voted, total) =>
    `Waiting for host to reveal votes... ${voted}/${total} voted`,
  waitingNewRound: "Waiting for host to start a new round...",
  chooseCard: "Choose Your Card",
  yourVote: "Your vote",
  newRoom: "New Room",
  copyInviteLink: "Copy Invite Link",
  aiQuotes: "AI Quotes",
  roomInfo: "Room Info",
  roomId: "Room ID",
  deck: "Deck",
  roundLabel: "Round",
  storyPlaceholder: "Story / ticket title (optional)",
  estimatingPrefix: "Estimating:",
  individualVotes: "Individual Votes",
  highVariance: "High variance — needs discussion",
  someVariance: "Some variance",
  goodConsensus: "Good consensus",
  infinityMessage:
    "Someone voted infinity — this story has transcended the known universe of estimation.",
  coffeeMessage: "A break was requested. The code will wait; it has no choice.",
  joinRoom: "Join Room",
  yourNickname: "Your Nickname",
  joinTable: "Join the Table",
  createRoom: "Create Room",
  swToggleLabel: "Star Wars Mode",
};

export const swLabels: SwLabels = {
  appName: "Jedi Council",
  participants: "Jedi Knights",
  votesSubmitted: (voted, total) => `${voted}/${total} aligned`,
  round: (n) => `Mission ${n}`,
  phase: (phase) => (phase === "voting" ? "Deliberating" : "Force Revealed"),
  revealCards: "Feel the Force",
  newRound: "New Mission",
  waitingReveal: (voted, total) =>
    `Awaiting the Council Master's decision... ${voted}/${total} ready`,
  waitingNewRound: "Awaiting the Grand Master's command...",
  chooseCard: "Choose Your Weapon",
  yourVote: "Your alignment",
  newRoom: "New Council",
  copyInviteLink: "Summon Allies",
  aiQuotes: "Yoda's Wisdom",
  roomInfo: "Mission Brief",
  roomId: "Council ID",
  deck: "Armory",
  roundLabel: "Mission",
  storyPlaceholder: "Describe the mission... (optional)",
  estimatingPrefix: "Mission:",
  individualVotes: "Jedi Alignment",
  highVariance: "A great disturbance — the Force is not balanced",
  someVariance: "Some disturbance in the Force",
  goodConsensus: "The Force is strong with this estimate",
  infinityMessage:
    "Infinity chosen — this task has transcended the boundaries of the known galaxy.",
  coffeeMessage:
    "A recess was summoned. The mission awaits; the Force is patient.",
  joinRoom: "Enter the Council",
  yourNickname: "Your Jedi Name",
  joinTable: "Join the Council",
  createRoom: "Assemble the Council",
  swToggleLabel: "Return to Normal",
};

export function getLabels(isSwMode: boolean): SwLabels {
  return isSwMode ? swLabels : defaultLabels;
}
