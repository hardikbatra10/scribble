// src/components/Players.tsx
import { useEffect, useState } from "react";
import { socket } from "../socket";

type Player = {
  id: string;
  name: string;
  score?: number;
};

type Props = {
  roomId: string;
  name: string;
  handleLeave?: () => void;
  handleCopy?: (copied: boolean) => void;
  copy?: boolean;
  currentDrawerId?: string | null;
  setCurrentDrawerId?: (id: string | null) => void;
  setCurrentRound?: (round: number) => void;
  currentRound?: number;
};

export default function Players({ roomId, name, handleLeave, handleCopy, copy, currentDrawerId, setCurrentDrawerId, currentRound, setCurrentRound }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [ownerId, setOwnerId] = useState<string>("");
  const [maxRounds, setMaxRounds] = useState<number>(3);
  // const [currentRound, setCurrentRound] = useState<number>(1);

  useEffect(() => {
    if (!roomId || !name) return;

    // ask server for room state when component mounts or room changes
    socket.emit("join_room", { roomId, name });

    const handlePlayersUpdate = (payload: any) => {
      if (!payload) return;
      if (Array.isArray(payload.players)) setPlayers(payload.players);
      if (payload.ownerId) setOwnerId(payload.ownerId);
      if (typeof payload.rounds === "number") setMaxRounds(payload.rounds);
      if(payload.currentDrawerId && setCurrentDrawerId){
        setCurrentDrawerId(payload.currentDrawerId);
      }
      if(payload.currentRound && setCurrentRound){
        setCurrentRound(payload.currentRound);
      }
    };

    const handleRoomState = (state: any) => {
      if (!state) return;
      if (Array.isArray(state.strokes) && state.players) {
        // backend may send `players` inside room_state
        setPlayers(state.players || []);
      } else {
        if (state.players) setPlayers(state.players);
      }
      if (state.ownerId) setOwnerId(state.ownerId);
      if (typeof state.rounds === "number") setMaxRounds(state.rounds);
    };

    socket.on("players_update", handlePlayersUpdate);
    socket.on("room_state", handleRoomState);

    return () => {
      socket.off("players_update", handlePlayersUpdate);
      socket.off("room_state", handleRoomState);
    };
  }, [roomId, name]);

  return (
    <div className="p-4 h-screen">
      <div className="h-10.5 border-b flex items-center justify-center gap-6 px-4">
        <strong>Players</strong>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Room {roomId}</h2>

        <div className="mb-4 space-y-2">
          {players.length === 0 && <div className="text-sm text-gray-500">No players yet</div>}
          {players.map((p) => (
            <div key={p.id} className={`flex items-center justify-between p-2 rounded shadow-sm border ${
  p.id === currentDrawerId
    ? "bg-green-100 border-green-400"
    : "bg-white border-gray-200"
}`}>
              <div>
                <div className="font-medium">
                  {p.id === currentDrawerId && <span className="text-blue-500 mr-1">✏️ </span>}
                  {p.name}
                  {p.id === ownerId && <span className="text-blue-500 ml-1">(Leader)</span>}
                  </div>
                {typeof p.score !== "undefined" && <div className="text-xs text-gray-500">Score: {p.score}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          {socket.id === ownerId && (
            <>
              <label className="block text-sm mb-1">Rounds</label>
              <select
                value={maxRounds}
                onChange={(e) => {
                  const rounds = Number(e.target.value) || 1;
                  setMaxRounds(rounds);
                  socket.emit("set_rounds", { roomId, rounds });
                }}
                className="px-2 py-1 border rounded"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} rounds
                  </option>
                ))}
              </select>

              <div className="mt-3">
                <button
                  disabled={players.length < 2}
                  onClick={() => socket.emit("start_game", { roomId })}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
                >
                  {players.length < 2 ? "Need 2+ players" : "Start Game"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {handleCopy && (
            <button
              onClick={() => {
                handleCopy(true);
                window.navigator.clipboard.writeText(roomId);
              }}
              className="px-3 py-1 bg-amber-100 rounded hover:bg-amber-200"
            >
              {copy ? "Copied!" : "Copy Room ID"}
            </button>
          )}
          {handleLeave && (
            <button onClick={handleLeave} className="px-3 py-1 bg-red-200 rounded hover:bg-red-300">
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
}