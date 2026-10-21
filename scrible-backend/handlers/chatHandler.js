module.exports = function(io, socket, getRoom){

  socket.on("chat_message", ({roomId, name, message}) => {
    io.to(roomId).emit("chat_message", {
      name,
      message,
    });
  });
}