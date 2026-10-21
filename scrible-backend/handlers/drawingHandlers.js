module.exports = function(io, socket, getRoom){

  // "from" tells receivers WHO is drawing, so each client can keep
  // one in-progress stroke per drawer instead of a single shared slot
  socket.on("start_draw", ({roomId, ...data}) => {
    const room = getRoom(roomId);
    room.currentDrawerId = data.from;
    socket.to(roomId).emit("start_draw", {...data, from: data.from});
  });

  socket.on("draw_stroke", ({roomId, ...data}) => {
    socket.to(roomId).emit("draw_stroke", {...data, from: socket.id});
  });

  socket.on("stop_draw", ({roomId, ...data}) => {
    const room = getRoom(roomId);
    if(data.sessionId === room.sessionId && data.stroke){
      room.strokes.push(data.stroke);
    }
    // was socket.to(data.roomId) — roomId is destructured out of data,
    // so that was undefined and stop_draw never reached the other clients
    socket.to(roomId).emit("stop_draw", {...data, from: socket.id});
  });

  socket.on("clear_canvas", ({roomId, ...data}) => {
    const room = getRoom(roomId);
    room.strokes = [];
    room.sessionId = data.sessionId;
    socket.to(roomId).emit("clear_canvas", data);
  });

  socket.on("undo", ({roomId, ...data}) => {
    const room = getRoom(roomId);
    room.strokes.pop();
    socket.to(roomId).emit("undo", data);
  });
}