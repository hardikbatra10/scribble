// import type { Player, Phase } from "../types";

// export type GameState = {
//   players: Player[];
//   ownerId: string | null;
//   maxRounds: number;
//   phase: Phase;
//   drawerId: string | null;
//   myWord: string;    // only the drawer gets this
//   wordHint: string;  // blanks for everyone
// };

// export const initialGameState: GameState = {
//   players: [], ownerId: null, maxRounds: 3, phase: "lobby",
//   drawerId: null, myWord: "", wordHint: "",
// };

// export type GameAction =
//   | { type: "PLAYERS_UPDATE"; players: Player[]; ownerId: string | null; maxRounds: number; phase?: Phase }
//   | { type: "SET_PHASE"; phase: Phase }
//   | { type: "ROUND_START"; drawerId: string; wordLength: number }
//   | { type: "YOUR_WORD"; word: string };

// export function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case "PLAYERS_UPDATE":
//       return {
//         ...state,
//         players: action.players,
//         ownerId: action.ownerId,
//         maxRounds: action.maxRounds,
//         phase: action.phase ?? state.phase,   // phase optional on this event
//       };
//     case "SET_PHASE":
//       return { ...state, phase: action.phase };
//     case "ROUND_START":
//       return {
//         ...state,
//         phase: "drawing",
//         drawerId: action.drawerId,
//         wordHint: "_ ".repeat(action.wordLength).trim(),
//         myWord: "",   // cleared; drawer fills it via YOUR_WORD
//       };
//     case "YOUR_WORD":
//       return { ...state, myWord: action.word };
//     default:
//       return state;
//   }
// }