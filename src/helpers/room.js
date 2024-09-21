const constants = require('../config/constants');
const { getCellCapacity } = require('../utils/misc');
const { generateRandomId } = require('./common');
const { redis } = require('./resource');

const createEmptyRoom = (rows, cols) => {
  const matrix = [];

  for (let x = 0; x < rows; x++) {
    const rowMatrix = [];

    for (let y = 0; y < cols; y++) {
      rowMatrix[y] = {
        playerId: '',
        count: 0,
        capacity: getCellCapacity(x, y, rows, cols),
      }
    }
    matrix[x] = rowMatrix;
  }

  return matrix;
}

const getRoomKey = (roomCode) => `Room:{${roomCode}}`;

exports.createRoom = (rows, cols) => {
  const matrix = createEmptyRoom(rows, cols);
  return {
    code: generateRandomId(),
    rows,
    cols,
    state: constants.ROOM_STATE.WAITING,
    matrix,
  };
}

exports.exists = async (roomCode) => {
  const response = await redis().exists(getRoomKey(roomCode));
  return response === 1;
}

exports.getRoom = async (roomCode) => {
  const response = await redis().get(getRoomKey(roomCode));
  return JSON.parse(response);
}

exports.setRoom = (roomCode, payload) => {
  return redis().set(
    getRoomKey(roomCode),
    payload,
    { EX: constants.REDIS_GAME_EXPIRY },
  );
}

exports.startGame = async (roomCode) => {
  const room = await exports.getRoom(roomCode);

  if (!room) {
    throw new Error('room.NOT_FOUND');
  }

  if(room.state !== constants.ROOM_STATE.WAITING) {
    throw new Error('room.INVALID_STATE');
  }

  room.state = constants.ROOM_STATE.STARTED;

  await exports.setRoom(roomCode, JSON.stringify(room));
  return room;
}

exports.endGame = async (roomCode) => {
  const room = await exports.getRoom(roomCode);

  if (!room) {
    throw new Error('room.NOT_FOUND');
  }

  if(room.state !== constants.ROOM_STATE.STARTED) {
    throw new Error('room.INVALID_STATE');
  }

  room.state = constants.ROOM_STATE.ENDED;

  await exports.setRoom(roomCode, JSON.stringify(room));
  return room;
}