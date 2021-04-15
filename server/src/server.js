'use strict';

// require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const socket = require('socket.io');

const io = socket(server, {
  cors: { origin: '*' },
  // transports: ['websocket', 'polling'],
});

const { userJoin, getUsers, userLeave, currentUser } = require('./utilis/user');
const messageTemplate = require('./utilis/messages');

const errorHandler = require('./errors-handlers/500');
const notFound = require('./errors-handlers/404');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')));
// app.use(express.static('../client/public'));

// ----------- //
// io.listen(server);

io.on('connection', (socket) => {
  console.log(socket.id);
  //join room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //welcome for user
    socket.emit(
      'message',
      messageTemplate(user.username, `welcome to ${user.room}`)
    );

    //broadcast to all member
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        messageTemplate(user.username, `${user.username} has joined`)
      );

    //room info /// users
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getUsers(user.room),
    });
  });

  socket.on('chatMessage', (msg) => {
    const user = currentUser(socket.id);

    io.to(user.room).emit('message', messageTemplate(user.username, msg));
  });

  socket.on('videoUrl', (videoUrl) => {
    const user = currentUser(socket.id);
    io.to(user.room).emit('video', videoUrl);
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        messageTemplate(user.username, `${user.username} has left`)
      );
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getUsers(user.room),
      });
    }

  });
});

// ----------- //

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  // io,
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
