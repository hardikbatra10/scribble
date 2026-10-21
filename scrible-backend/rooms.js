// const rooms = new Map();

// function getRoom(roomId) {
//   if (!rooms.has(roomId)) rooms.set(roomId, {
//     strokes: [], sessionId: roomId,
//     players: [], ownerId: null, maxRounds: 3,
//     phase: "lobby", currentDrawerId: null, word: null,
//     turnsPlayed: 0, timer: null,
//   });
//   return rooms.get(roomId);
// }

// // returns the updated room, or null if it was deleted (last player left)
// function removePlayer(roomId, socketId) {
//   const room = rooms.get(roomId);
//   if (!room) return null;
//   const before = room.players.length;
//   room.players = room.players.filter((p) => p.id !== socketId);
//   if (room.players.length === before) return room;   // wasn't here
//   if (room.players.length === 0) { rooms.delete(roomId); return null; }
//   if (room.ownerId === socketId) room.ownerId = room.players[0].id;  // hand off
//   return room;
// }

// module.exports = { rooms, getRoom, removePlayer };

const rooms = new Map();

function getRoom(roomId){
  if(!rooms.has(roomId)){
    rooms.set(roomId, {
      strokes:[],
      sessionId: roomId,
      players: [],
      ownerId: null,
      currentRound: 1,
      maxRounds: 3,
      phase: "lobby",
      currentDrawerId: null,
      word: null,
      round: 0,
      timer: null,
    });
  }
  return rooms.get(roomId);
}

module.exports = {rooms, getRoom};