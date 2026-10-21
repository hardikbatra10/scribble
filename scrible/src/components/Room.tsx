import { useEffect, useState } from "react";
import {socket} from '../socket';
import Canvas from "./Canvas";
import Chat from "./Chat";
import Players from "./Players";

export default function Room(){
  const[roomId, setRoomId] = useState("");
  const[joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [copy, setCopy] = useState(false);
  const [currentDrawerId, setCurrentDrawerId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);

  const generateRoomId = () => { 
    return Math.random().toString(36).substring(2, 8);
  }
  const handleJoin = () => {
    if(!roomId.trim() || !name.trim()) return;
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("name", name);
    setJoined(true);
  };

  const handleLeave = () => {
    socket.emit("leave_room", roomId);
    localStorage.removeItem("roomId");
    setJoined(false);
  }

  const handleCreate = () => {
    if(!name.trim()) return;
    const id = generateRoomId();
    setRoomId(id);
    localStorage.setItem("roomId", id);
    localStorage.setItem("name", name);
    setJoined(true);
  };

  const handleCopy = (copied: boolean) => {
    setCopy(copied);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }

  useEffect(() => {
    const saved = localStorage.getItem("roomId");
    const savedName  = localStorage.getItem("name");
    if(saved && savedName){
      setRoomId(saved);
      setName(savedName);
      setJoined(true);
    }
  }, []);

  if(!joined){
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
        <h1 className="text-2xl font-bold">Join Room</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">
          <button
            onClick={handleJoin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Join
          </button>

          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      {/* 🔥 Show current room */}
      {/* <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow flex items-center gap-2">
        <span>Room: <span className="font-bold">{roomId}</span></span>
        <button onClick={() => { navigator.clipboard.writeText(roomId); alert("Copied!"); }}
          className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Copy</button>
        <button onClick={handleLeave}
          className="px-2 py-1 text-sm bg-red-200 rounded hover:bg-red-300">Leave</button>
      </div> */}


      {/* <div className="fixed top-4 right-4 w-48 rounded-xl bg-amber-50 p-6 flex items-center gap-2 flex-wrap">
        <span>Room: <span className="font-bold">{roomId}</span></span>
        <button onClick={()=> {navigator.clipboard.writeText(roomId); handleCopy(true);}} className="bg-amber-100 px-3 py-1 rounded mt-2 w-full hover:bg-amber-200 transition">
          {copy ? "Copied!" : "Copy"}
        </button>
        <button onClick={()=>{handleLeave()}} className="bg-red-200 px-3 py-1 rounded mt-2 w-full hover:bg-red-300 transition">
          Leave
        </button>
      </div> */}

      {/* <Canvas roomId={roomId} name={name}/>
      <Chat roomId={roomId} name={name}/> */}
      {/* <div className="flex h-screen">
        <div className="mr-80">
          <Canvas roomId={roomId} name={name}/>
        </div>
        <div className="w-80">
          <Chat roomId={roomId} name={name}/>
        </div>
      </div> */}

      <div className="flex h-screen">
        <div className="w-64 border-r">
          {/* Players Panel */}
          <Players roomId={roomId} name={name} handleLeave={handleLeave} handleCopy={handleCopy} copy={copy} 
          currentDrawerId={currentDrawerId} setCurrentDrawerId={setCurrentDrawerId} 
          currentRound={currentRound} setCurrentRound={setCurrentRound}
          />
        </div>

        <div className="flex-1">
          <Canvas roomId={roomId} name={name} currentRound={currentRound} setCurrentRound={setCurrentRound}/>
        </div>

        <div className="w-80 border-l">
          <Chat roomId={roomId} name={name} />
        </div>
      </div>
    </div>
  );
}