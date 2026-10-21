module.exports = function(io, socket, rooms){
  socket.on("start_game", ({roomId}) => {
    const room = rooms.get(roomId);

    if(!room) return;
    if(socket.id !== room.ownerId) return;
    if(room.phase !== "lobby") return;
    if(room.players.length < 2) return;
    room.phase = "drawing";
    room.currentDrawerId = room.players[0].id;
    room.currentRound = 1;

    io.to(roomId).emit("players_update", {
      players: room.players,
      ownerId: room.ownerId,
      currentRound: room.currentRound,
      maxRounds: room.maxRounds,
      phase: room.phase,
      currentDrawerId: room.currentDrawerId,
    });
  });

  socket.on("set_rounds", ({roomId, rounds}) => {
    const room = rooms.get(roomId);
    if(!room) return;
    if(socket.id !== room.ownerId) return;
    if(room.phase !== "lobby") return;
    room.maxRounds = Math.max(1, Math.min(10, rounds));
    io.to(roomId).emit("players_update", {
      players: room.players,
      ownerId: room.ownerId,
      maxRounds: room.maxRounds,
    });
  })
}