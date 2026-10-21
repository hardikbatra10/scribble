// // const express = require("express");
// // const http = require("http");
// // const { Server } = require("socket.io");

// // const roomHandlers = require("./handlers/roomHandlers");
// // const drawingHandlers = require("./handlers/drawingHandlers");
// // const gameHandlers = require("./handlers/gameHandlers");

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, { cors: { origin: "*" } });

// // app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

// // io.on("connection", (socket) => {
// //   console.log("a user connected");
// //   roomHandlers(io, socket);
// //   //drawingHandlers(io, socket);
// //   //gameHandlers(io, socket);
// //   socket.on("disconnect", () => console.log("user disconnected"));
// // });

// // server.listen(3000, () => console.log("Server running on port 3000"));


// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);

// // io -> entire socket server, socket -> one specific user

// const {Server} = require('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// // roomId -> {strokes: [], sessionId: roomId}
// // we can use redis or any other in-memory database to store this data
// const rooms = new Map();
// function getRoom(roomId){
//   if(!rooms.has(roomId)) rooms.set(roomId, {
//     strokes: [],
//     sessionId: roomId,
//     players: [],
//     ownerId: null,
//     maxRounds: 3,
//     phase: "lobby",
//     currentDrawerId: null,
//     word: null,
//     round: 0,
//     timer: null,
//   });
//   return rooms.get(roomId);
// }

// // here socket means client that connected to server
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   // from one client i got it
//   socket.on('draw', (data) => {
//     console.log('draw event received:', data);
//     // Emit to all clients (including sender) so single-client testing also shows output.
//     io.emit('draw', data);
//   });

//   socket.on('start_draw', ({roomId, ...data}) => {
//     socket.to(roomId).emit('start_draw', data);
//   });

//   socket.on('draw_stroke', ({roomId, ...data}) => {
//     socket.to(roomId).emit('draw_stroke', data);
//   });

// // data.stoke is this
// // {
// //   color: "black",
// //   size: 5,
// //   points: [
// //     {x:10,y:20},
// //     {x:11,y:21},
// //     {x:12,y:22},
// //     {x:13,y:23}
// //   ]
// // }
//   socket.on('stop_draw', (data) => {
//     const room = getRoom(data.roomId);
//     // this has a sessionId and acts like
//     // if a user sends some strokes and then suddenly send clear canvas
//     // imagine clear canvas arrived early and then stroke arrived, so in that case we should not store that stroke
//     // so we are checking that sessionId of stroke and sessionId of room should be same, if not then we are not storing that stroke
//     if(data.sessionId === room.sessionId && data.stroke) {
//       room.strokes.push(data.stroke);
//     }
//     // if a,b,c are users in a single room
//     // if a send its strokes, it gets stored
//     // and through this below line these strokes are being sent to
//     // b and c, so that they can update their canvas
//     socket.to(data.roomId).emit('stop_draw', data);
//   });
//   socket.on('clear_canvas', ({roomId, ...data}) => {
//     const room = getRoom(roomId);
//     // since we are clearing canvas, therefore all strokes removed
//     room.strokes = [];
//     // make sessionId absolutely same
//     room.sessionId = data.sessionId;
//     socket.to(roomId).emit('clear_canvas', data);
//   });

//   socket.on('disconnect', () => {
//     // now disconnect logic
//     for(const [roomId, room] of rooms){
//       const before = room.players.length;
//       // if player is leaving, then remove that player from players array
//       // room.players get all players except the one which is leaving
//       room.players = room.players.filter((p) => p.id !== socket.id);
//       if(room.players.length === before) continue; // this means that player was not in this room, so continue

//       if(room.players.length === 0){
//         rooms.delete(roomId);
//       }else{
//         if(room.ownerId === socket.id) room.ownerId = room.players[0].id;
//         io.to(roomId).emit("players_update", {
//           players: room.players,
//           ownerId: room.ownerId,
//           maxRounds: room.maxRounds,
//         });
//       }
//     }
//   });


//   socket.on("join_room", ({roomId, name}) => {
//     socket.join(roomId);
//     const room = getRoom(roomId);
//     // Note socket.emit, not io.to(...) — only the new
//     // person needs the replay; everyone else already has it.
//     const already = room.players.some((p) => p.id === socket.id);
//     if(!already){
//       if(room.players.length === 0) room.ownerId = socket.id;
//       room.players.push({id: socket.id, name, score: 0, hasGuessed: false});
//     }

//     socket.emit("room_state", {strokes: room.strokes, sessionId: room.sessionId, phase: room.phase});
//     // we did io before, so that everyone in the room gets update about new player
//     io.to(roomId).emit("players_update", {
//       players: room.players,
//       ownerId: room.ownerId,
//       maxRounds: room.maxRounds,
//       phase: room.phase,
//     });
//   });

//   socket.on("start_game", ({roomId}) => {
//     const room = rooms.get(roomId);
//     if(!room) return;
//     if(socket.id !== room.ownerId) return;
//     if(room.phase !== "lobby") return;
//     if(room.players.length < 2) return;
//     room.phase = "drawing";
//     io.to(roomId).emit("players_update", {players: room.players, ownerId: room.ownerId, maxRounds: room.maxRounds, phase: room.phase})
//   })

//   socket.on("set_rounds", ({roomId, rounds}) => {
//     const room = rooms.get(roomId);
//     if(!room) return;
//     if(socket.id !== room.ownerId) return;
//     if(room.phase !== "lobby") return;
//     room.maxRounds = Math.max(1, Math.min(10, rounds));
//     io.to(roomId).emit("players_update", {
//       players: room.players,
//       ownerId: room.ownerId,
//       maxRounds: room.maxRounds,
//     });
//   });

//   // now implementing logic for leave room
//   socket.on("leave_room", (roomId) => {
//     socket.leave(roomId);
//     const room = rooms.get(roomId);
//     if(!room) return;
//     room.players = room.players.filter((p) => p.id !== socket.id);
//     if(room.players.length === 0){
//       rooms.delete(roomId);
//     }else{
//       if(room.ownerId === socket.id) room.ownerId = room.players[0].id;
//       io.to(roomId).emit("players_update", {
//         players: room.players,
//         ownerId: room.ownerId,
//         maxRounds: room.maxRounds,
//       });
//     }
//   });
//   socket.on("undo", ({roomId, ...data}) => {
//     getRoom(roomId).strokes.pop();
//     socket.to(roomId).emit("undo", data);
//   })

// });

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { rooms, getRoom } = require("./rooms");

const drawingHandlers = require("./handlers/drawingHandlers");
const roomHandlers = require("./handlers/roomHandlers");
const gameHandlers = require("./handlers/gameHandlers");
const chatHandler = require("./handlers/chatHandler");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

io.on("connection",(socket)=>{

  console.log("user connected");

  roomHandlers(io, socket, rooms, getRoom);

  drawingHandlers(io, socket, getRoom);

  gameHandlers(io, socket, rooms);
  chatHandler(io, socket, getRoom);

});

server.listen(3000,()=>{
  console.log("Server running on 3000");
});