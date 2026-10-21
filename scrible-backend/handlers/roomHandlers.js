// const { getRoom, removePlayer } = require("../rooms");

// function broadcastPlayers(io, roomId, room) {
//   io.to(roomId).emit("players_update", {
//     players: room.players, ownerId: room.ownerId,
//     maxRounds: room.maxRounds, phase: room.phase,
//   });
// }

// module.exports = function roomHandlers(io, socket) {
//   socket.on("join_room", ({ roomId, name }) => {
//     socket.join(roomId);
//     const room = getRoom(roomId);
//     if (!room.players.some((p) => p.id === socket.id)) {
//       if (room.players.length === 0) room.ownerId = socket.id;
//       room.players.push({ id: socket.id, name, score: 0, hasGuessed: false });
//     }
//     socket.emit("room_state", { strokes: room.strokes, sessionId: room.sessionId, phase: room.phase });
//     broadcastPlayers(io, roomId, room);
//   });

//   socket.on("leave_room", (roomId) => {
//     socket.leave(roomId);
//     const room = removePlayer(roomId, socket.id);
//     if (room) broadcastPlayers(io, roomId, room);
//   });

//   socket.on("disconnect", () => {
//     for (const roomId of socket.rooms) {            // socket.rooms = rooms it's in
//       const room = removePlayer(roomId, socket.id);
//       if (room) broadcastPlayers(io, roomId, room);
//     }
//   });
// };

module.exports = function(io, socket, rooms, getRoom){
  socket.on("join_room", ({roomId, name}) => {
    socket.join(roomId);
    const room = getRoom(roomId);
    const already = room.players.some((p) => p.id === socket.id);
    if(!already){
      if(room.players.length === 0) room.ownerId = socket.id;
      room.players.push({id: socket.id, name, score: 0, hasGuessed: false});
    }
    socket.emit("room_state", {
      strokes: room.strokes,
      sessionId: room.sessionId,
      phase: room.phase
    });

    io.to(roomId).emit("players_update", {
      players: room.players,
      ownerId: room.ownerId,
      maxRounds: room.maxRounds,
      phase: room.phase,
      currentDrawerId: room.currentDrawerId,
    });

  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if(!room) return;
    room.players = room.players.filter((p) => p.id !== socket.id);
    if(room.players.length === 0){
      rooms.delete(roomId);
    }else{
      if(room.ownerId === socket.id) room.ownerId = room.players[0].id;
      io.to(roomId).emit("players_update", {
        players: room.players,
        ownerId: room.ownerId,
        maxRounds: room.maxRounds,
        phase: room.phase,
        currentDrawerId: room.currentDrawerId,
      
      });
    }
  });

  socket.on("disconnect", () => {
    for(const [roomId, room] of rooms){
      const before = room.players.length;
      // if player is leaving, then remove that player from players array
      // room.players get all players except the one which is leaving
      room.players = room.players.filter((p) => p.id !== socket.id);
      if(room.players.length === before) continue; // this means that player was not in this room, so continue

      if(room.players.length === 0){
        rooms.delete(roomId);
      }else{
        if(room.ownerId === socket.id) room.ownerId = room.players[0].id;
        io.to(roomId).emit("players_update", {
          players: room.players,
          ownerId: room.ownerId,
          maxRounds: room.maxRounds,
          phase: room.phase,
          currentDrawerId: room.currentDrawerId,
        });
      }
    }
  })
}