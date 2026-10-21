const { rooms } = require("./rooms");
const { pickWord } = require("./words");

function startRound(io, roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const drawer = room.players[room.turnsPlayed % room.players.length];
  room.currentDrawerId = drawer.id;
  room.word = pickWord();
  room.phase = "drawing";
  room.strokes = [];
  room.players.forEach((p) => (p.hasGuessed = false));

  io.to(roomId).emit("round_start", {
    drawerId: drawer.id, drawerName: drawer.name,
    wordLength: room.word.length,
    round: room.turnsPlayed + 1,
    maxTurns: room.maxRounds * room.players.length,
  });
  io.to(drawer.id).emit("your_word", { word: room.word });   // secret, drawer only
}

module.exports = { startRound };