// import { createContext, useContext, useEffect, useReducer } from "react";
// import { socket } from "../socket";
// import { gameReducer, initialGameState, type GameState } from "./gameReducer";

// type GameContextValue = GameState & {
//   setRounds: (rounds: number) => void;
//   startGame: () => void;
// };

// const GameContext = createContext<GameContextValue | null>(null);

// export function GameProvider({
//   roomId, name, children,
// }: { roomId: string; name: string; children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(gameReducer, initialGameState);

//   useEffect(() => {
//     // room_state: we only read PHASE here. Strokes are the canvas hook's job.
//     const onRoomState = ({ phase }: any) => { if (phase) dispatch({ type: "SET_PHASE", phase }); };
//     const onPlayers = ({ players, ownerId, maxRounds, phase }: any) =>
//       dispatch({ type: "PLAYERS_UPDATE", players, ownerId, maxRounds, phase });
//     const onRoundStart = ({ drawerId, wordLength }: any) =>
//       dispatch({ type: "ROUND_START", drawerId, wordLength });
//     const onYourWord = ({ word }: any) => dispatch({ type: "YOUR_WORD", word });

//     socket.on("room_state", onRoomState);
//     socket.on("players_update", onPlayers);
//     socket.on("round_start", onRoundStart);
//     socket.on("your_word", onYourWord);
//     socket.emit("join_room", { roomId, name });

//     return () => {
//       socket.off("room_state", onRoomState);
//       socket.off("players_update", onPlayers);
//       socket.off("round_start", onRoundStart);
//       socket.off("your_word", onYourWord);
//     };
//   }, [roomId, name]);

//   const value: GameContextValue = {
//     ...state,
//     setRounds: (rounds) => socket.emit("set_rounds", { roomId, rounds }),
//     startGame: () => socket.emit("start_game", { roomId }),
//   };

//   return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
// }

// export function useGame() {
//   const ctx = useContext(GameContext);
//   if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
//   return ctx;
// }