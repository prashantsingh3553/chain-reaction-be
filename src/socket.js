const hold = require('./container');
const socketio = require('socket.io');
const { Subscribe } = require('./config/socket');

module.exports = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    const socketId = socket.id;

    // socket.on(socketConfig.GAME_STARTED, (roomCode) => {
    //   io.to(roomCode).emit(socketConfig.GAME_STARTED);
    // });

    // -> attempt
    // Matrix Cell: {
    //   playerId,
    //   count,
    // }

    socket.on(Subscribe.GAME_UPDATE, (roomCode, data) => {
      socket.broadcast.to(roomCode).emit(socketConfig.GAME_UPDATE, data);
    });

    socket.on(Subscribe.GAME_OVER, (roomCode) => {
      socket.to(roomCode).emit(socketConfig.GAME_OVER);
    });

    socket.on(Subscribe.PLAYER_JOINED, (data) => {
      const { roomCode, playerId } = data;
      socket.join(roomCode);
      // logic
    });

    socket.on(Subscribe.PLAYER_LEFT, (roomCode) => {
      socket.leave(roomCode);
      // logic
    });
  });

  hold.add('io', io);
}