// Canvas.tsx
import { useRef, useEffect, useState  } from 'react';
import {socket} from '../socket';
import Button from "./Button";
import {
  Undo2,
  Trash2,
  Pencil,
  Eraser
} from "lucide-react";

type Point = { x: number; y: number };

type Stroke = {
  points: Point[];
  color: string;
  size: number;
  tool: "pencil" | "eraser";
}

type Player = {
  id: string;
  name: string;
  score: number;
  hasGuessed: boolean;
};

type SessionId = string | number;



export default function Canvas({roomId, name, currentRound, setCurrentRound}: {roomId: string, name: string, currentRound: number, setCurrentRound?: (round: number) => void}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [maxRounds, setMaxRounds] = useState<number>(3);
  const [phase, setPhase] = useState<string>("lobby");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPainting = useRef<boolean>(false);
  const lineWidth = useRef<number>(5);
  const [brushSize, setBrushSize] = useState(5);
  const [currentDrawerId, setCurrentDrawerId] = useState<string | null>(null);
  // basically there were somg bugs where when i press reset
  // some previous drawings are appearing, so i 
  // added this to make sure that when reset is pressed, 
  // the canvas is cleared for everyone
  const sessionId = useRef<SessionId>(roomId);

  // now need to store strokes and also current stroke
  const strokes = useRef<Stroke[]>([]);
  // currentStroke is ONLY the local user's in-progress stroke (mouse events).
  // remote drawers each get their own slot in remoteStrokes, keyed by their
  // socket id — a single shared slot breaks when two people draw at once,
  // because an incoming start_draw would overwrite the local stroke mid-flight
  const currentStroke = useRef<Stroke|null>(null);
  const remoteStrokes = useRef<Map<string, Stroke>>(new Map());
  const brushColor = useRef<string>("black");
  const [selectedColor, setSelectedColor] = useState("black");
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const toolRef = useRef<"pencil" | "eraser">("pencil");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const cursorSize = brushSize + 1;



  const handleUndo = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    strokes.current.pop();
    redraw(ctx);
    socket.emit("undo", {
      roomId,
      sessionId: sessionId.current
    });
  }

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    // acts as starting point of the stroke
    // or where previous stroke ended and new one is starting
    ctx.beginPath();
    const isEraserStroke = stroke.tool === "eraser";
    ctx.globalCompositeOperation = isEraserStroke ? "destination-out" : "source-over";

    ctx.strokeStyle = isEraserStroke ? "rgba(0,0,0,1)" : stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    console.log(stroke.tool);

    stroke.points.forEach((p, i) => {
      // at start we are just reaching the starting point
      if(i === 0) ctx.moveTo(p.x, p.y);
      // joining lines btw adj points
      else ctx.lineTo(p.x, p.y);
    });
    // finally we are stroking the path
    // so basically we are drawing the stroke on canvas
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }

  // here we are redrawing all points we saved from the process
  const redraw = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if(!canvas) return;

    ctx.clearRect(0,0, canvas.width, canvas.height);
    strokes.current.forEach((stroke) => drawStroke(ctx, stroke));
    // 🔥 draw in-progress strokes LIVE — every remote drawer's, then our own
    remoteStrokes.current.forEach((stroke) => drawStroke(ctx, stroke));
    if (currentStroke.current) drawStroke(ctx, currentStroke.current);
  }


  const handleReset = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    sessionId.current = Date.now();
    strokes.current = [];
    redraw(ctx);
    socket.emit("clear_canvas", {
      roomId,
      sessionId: sessionId.current
    });
  };
  useEffect(() => {
    console.log("TOOL CHANGED:", tool);
  }, [tool]);
  useEffect(() => {
     sessionId.current = roomId;
     
  const handleRoomState = ({ strokes: incomingStrokes, sessionId: incoming, phase: incomingPhase }: any) => {
    strokes.current = incomingStrokes;
    sessionId.current = incoming;
    if (incomingPhase) setPhase(incomingPhase);
  };
  const handlePlayersUpdate = ({ players, ownerId, maxRounds, phase: incomingPhase, currentDrawerId: incomingCurrentDrawerId, currentRound: incomingCurrentRound }: any) => {
    setPlayers(players);
    setOwnerId(ownerId);
    setMaxRounds(maxRounds);
    setCurrentDrawerId(incomingCurrentDrawerId);
    // if(setCurrentRound){
    //   setCurrentRound(incomingCurrentRound);
    // }
    //setCurrentDrawerId(ownerId);
    if (incomingPhase) setPhase(incomingPhase);   // ← the second fix
  };

  socket.on("room_state", handleRoomState);
  socket.on("players_update", handlePlayersUpdate);
  socket.emit("join_room", { roomId, name });

  return () => {
    socket.off("room_state", handleRoomState);
    socket.off("players_update", handlePlayersUpdate);
  };
}, [roomId]);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;                              // TS needs this null check
    const updateCursor = (e: MouseEvent) => {
      console.log("MOVING");
      const rect = canvas.getBoundingClientRect();

      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const enterCanvas = () => {
      setShowCursor(true);
    };

    const leaveCanvas = () => {
      setShowCursor(false);
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;                                 // getContext can return null in TS

    const offsetX = canvas.offsetLeft;
    const offsetY = canvas.offsetTop;
    

    const parent = canvas.parentElement;
    if(parent){
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // replay whatever we already know about (room_state strokes) —
    // setting canvas.width/height above wipes the bitmap
    redraw(ctx);

    socket.on("clear_canvas", ({sessionId: incoming}) => {
      sessionId.current = incoming;
      strokes.current = [];
      currentStroke.current = null;
      remoteStrokes.current.clear();
      redraw(ctx);
    });

    socket.on("start_draw", ({x,y, lineWidth, color, tool: incomingTool,sessionId: incoming, from}) => {
      if(incoming !== sessionId.current) return;
      
      setCurrentDrawerId(from);
      remoteStrokes.current.set(from, {
        points: [{x,y}],
        color,
        size: lineWidth,
        tool: incomingTool
      });
    });

    socket.on("draw_stroke", ({x,y, sessionId: incoming, tool: incomingTool,from}) => {
      if (incoming !== sessionId.current) return;
      remoteStrokes.current.get(from)?.points.push({x,y});
      redraw(ctx);
    });

    socket.on("stop_draw", ({ stroke, sessionId: incoming, from }) => {
      if (incoming !== sessionId.current) return;

      // the payload carries the sender's complete stroke, so even if we
      // missed some draw_stroke packets the committed result is correct
      if (stroke) {
        strokes.current.push(stroke);
      }
      remoteStrokes.current.delete(from);
      // setCurrentDrawerId(null);
      redraw(ctx);
    });

    socket.on("undo", ({sessionId: incoming}) => {
      if(incoming !== sessionId.current) return;
      strokes.current.pop();
      redraw(ctx);
    });
    

    const startDraw = (e: MouseEvent) => {            // e is MouseEvent not any
      isPainting.current = true;
      const rect = canvas.getBoundingClientRect();
      // e.clientX/Y gives coordinates relative to viewport, we need to adjust it to get coordinates relative to canvas
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentStroke.current = {
        points: [{x,y}],
        color: brushColor.current,
        size: lineWidth.current,
        tool: toolRef.current,
      }
      // typescript error for undefined
      if(socket.id){
        setCurrentDrawerId(socket.id);
        
      }
      socket.emit("start_draw", {x,y, roomId,lineWidth: lineWidth.current, color: brushColor.current, tool: toolRef.current,sessionId: sessionId.current, from: socket.id});
    };

    const draw = (e: MouseEvent) => {
      if (!isPainting.current) return;
      ctx.lineWidth = lineWidth.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentStroke.current?.points.push({ x, y });

      redraw(ctx);
      socket.emit("draw_stroke", {x, y, roomId, lineWidth: lineWidth.current, color: brushColor.current, tool: toolRef.current,sessionId: sessionId.current});
    };


    const stopDraw = () => {
      if (!isPainting.current || !currentStroke.current) return;
      const finishedStroke = currentStroke.current;
      isPainting.current = false;
      strokes.current.push(finishedStroke);
      currentStroke.current = null;
      // setCurrentDrawerId(null);
      redraw(ctx);
      socket.emit("stop_draw", {
        roomId,
        sessionId: sessionId.current,
        stroke: finishedStroke
      });
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      redraw(ctx);
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    canvas.addEventListener("mousemove", updateCursor);
    canvas.addEventListener("mouseenter", enterCanvas);
    canvas.addEventListener("mouseleave", leaveCanvas);

    return () => {
      // cleanup listeners on unmount
      // what they do is that when we leave the room, 
      // we dont want to listen to events of that room anymore, 
      // so we remove those listeners
      socket.off("clear_canvas");
      socket.off("start_draw");
      socket.off("draw_stroke");
      socket.off("stop_draw");
      socket.off("undo");
      
    
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener("mousemove", updateCursor);
      canvas.removeEventListener("mouseenter", enterCanvas);
      canvas.removeEventListener("mouseleave", leaveCanvas);
      
    };
  }, [phase]);

  if(phase === "lobby"){
    return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h2 className="text-xl font-bold">Room {roomId}</h2>
      {/* player list */}
      {players.map((p) => <div key={p.id}>{p.name}{p.id === ownerId && " (leader)"}</div>)}
      {/* rounds selector (owner only) — move it here from the canvas overlay */}
      {socket.id === ownerId && (
        <select value={maxRounds} onChange={(e) => socket.emit("set_rounds", { roomId, rounds: Number(e.target.value) })}>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} rounds</option>)}
        </select>
      )}
      {/* Start — owner only, needs 2+ players */}
      {socket.id === ownerId && (
        <button
          disabled={players.length < 2}
          onClick={() => socket.emit("start_game", { roomId })}
          className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {players.length < 2 ? "Need 2+ players" : "Start Game"}
        </button>
      )}
    </div>
  );
  }else{
    return (
      <>
      <div className=''>

      </div>
      <div className="h-screen flex flex-col">

        {/* Toolbar */}
        <div className="h-16 border-b flex items-center justify-center gap-1 px-4">
          <button 
          className={`cursor-pointer ${tool === 'pencil' ? ' border-black bg-gray-100' : ''} px-1 py-1  cursor-pointer text-white rounded-2xl hover:bg-gray-100 transition`}
          onClick={()=>{
            setTool("pencil");
            toolRef.current = "pencil";
          }}>✏️</button>
          <button 
          className={`cursor-pointer ${tool === 'eraser' ? ' border-black bg-gray-100' : ''} px-1 py-1  cursor-pointer text-white rounded-2xl hover:bg-gray-100 transition`}
          onClick={()=>{
            console.log("clicked eraser");
            setTool("eraser");
            toolRef.current = "eraser";
          }}>🩹</button>
          <Button onClick={handleReset}>🗑</Button>
          {/* <Button onClick={handleReset}><Undo2 size={18} />Undo</Button> */}

          <Button onClick={handleUndo}>↩</Button>
          
          {/* // will add pencil and erasor option later */}

          <div className="flex items-center gap-2">
            <label htmlFor="brush" className="text-sm whitespace-nowrap">
              Brush Size
            </label>

            <input
              type="range"
              id="brush"
              min="1"
              max="14"
              value={brushSize}
              onChange={(e) => {
                const v = Number(e.target.value);
                setBrushSize(v);
                lineWidth.current = v;
              }}
            />
          </div>

          <ul className="flex items-center gap-1">
            <li
              className={`cursor-pointer ${selectedColor === 'red' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "red";
                setSelectedColor("red");
              }}
            >
              🔴
            </li>

            <li
              className={`cursor-pointer ${selectedColor === 'black' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "black";
                setSelectedColor("black");
              }}
            >
              ⚫
            </li>

            <li
              className={`cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "blue";
                setSelectedColor("blue");
              }}
            >
              🔵
            </li>

            <li
              className={`cursor-pointer ${selectedColor === 'green' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "green";
                setSelectedColor("green");
              }}
            >
              🟢
            </li>   

            <li
              className={`cursor-pointer ${selectedColor === 'yellow' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "yellow";
                setSelectedColor("yellow");
              }}
            >
              🟡
            </li>

            <li
              className={`cursor-pointer ${selectedColor === 'purple' ? 'border-2 border-black' : ''}`}
              onClick={() => {
                brushColor.current = "purple";
                setSelectedColor("purple");
              }}
            >
              🟣
            </li>
          </ul>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">

          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-none"
          />

          {showCursor && (
            <div
              className="absolute rounded-full pointer-events-none border-1 border-black"
              style={{
                position: "absolute",
                left: cursorPos.x,
                top: cursorPos.y,
                width: cursorSize,
                height: cursorSize,
                border: `2px solid ${tool === "eraser" ? "red" : brushColor.current}`,
                borderRadius: "50%",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
  }}
            />
          )}

          {/* {showCursor && (
  <div
    style={{
      position: "absolute",
      left: cursorPos.x,
      top: cursorPos.y,
      width: 20,
      height: 20,
      background: "red",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 9999,
    }}
  />
)} */}

        </div>
      </div> 
      </>
    );
  }
}