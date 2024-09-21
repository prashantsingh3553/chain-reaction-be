const hold = require('../../container');

const io = () => hold.get('io');
const roomSocket = (roomCode) => {
  const allSockets = io().of('/').sockets;
  return allSockets;
}

exports.gameStarted = (roomCode) => {
  console.log(roomSocket(roomCode));
}

exports.playerJoined = async () => { }