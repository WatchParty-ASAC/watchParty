'use strict';

const users = [];

function userJoin(id, username, room, likes) {
	const user = { id, username, room, likes };
	users.push(user);
	return user;
}

function getUsers(room) {
	return users.filter((user) => user.room === room);
}

function userLeave(id) {
	const userIndex = users.findIndex((user) => user.id === id);
	if (userIndex !== -1) return users.splice(userIndex, 1)[0];
}

function currentUser(id) {
	return users.find((user) => user.id === id);
}

function roomLikes(room) {
	let usersRoom = users.filter((user) => user.room === room);
	return usersRoom.reduce((acc, user) => (acc += user.likes), 0);
}

module.exports = { userJoin, getUsers, userLeave, currentUser, roomLikes };
