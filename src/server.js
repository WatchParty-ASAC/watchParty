'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const socket = require('socket.io');
const io = socket(server, {
	cors: { origin: '*' },
});

const {
	userJoin,
	getUsers,
	userLeave,
	currentUser,
	roomLikes,
} = require('./utilis/user');
const messageTemplate = require('./utilis/messages');

const errorHandler = require('./errors-handlers/500');
const notFound = require('./errors-handlers/404');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
	//join room
	// let likes = 0;

	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room, 0);

		socket.join(user.room);

		//welcome for user
		socket.emit(
			'message',
			messageTemplate(user.username, `welcome to room ${user.room}`),
		);

		//broadcast to all member
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				messageTemplate(user.username, `${user.username} has joined`),
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

	socket.on('play', () => {
		const user = currentUser(socket.id);
		io.to(user.room).emit('playVideo');
	});

	socket.on('pause', () => {
		const user = currentUser(socket.id);

		io.to(user.room).emit('pauseVideo');
	});

	//Like Btn/////////////////////////////

	socket.on('click_count', () => {
		const user = currentUser(socket.id);
		user.likes++;
		let likes = roomLikes(user.room);
		io.to(user.room).emit('clicked', likes);
	});

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				messageTemplate(user.username, `${user.username} has left`),
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
	start: (port) => {
		if (!port) {
			throw new Error('Missing Port');
		}
		server.listen(port, () => {
			console.log(`Server Up on ${port}`);
		});
	},
};
