'use strict';

const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
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

module.exports = { userJoin, getUsers, userLeave, currentUser };
