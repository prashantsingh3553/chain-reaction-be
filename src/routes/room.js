const express = require('express');
const room = require('../controllers/http/room');

const roomRouter = new express.Router();

roomRouter.post('/room', room.create);
roomRouter.post('/join', room.join);

roomRouter.get('/room/:roomCode', room.get);
roomRouter.get('/room/:roomCode/details', room.getAll);

roomRouter.get('/room-details/is-valid', room.isValid);

roomRouter.post('/room/:roomCode/start', room.start);

module.exports = roomRouter;