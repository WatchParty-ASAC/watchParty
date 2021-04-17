'use strict';

const joinRoom = document.querySelector('#joinRoom');
const chatBoard = document.querySelector('#chatBoard');
const chat = document.querySelector('#chat');
const chatForm = document.querySelector('#chatForm');
const video = document.querySelector('#video');
const videoContainer = document.querySelector('.video-container');

const firstUser = document.querySelector('.firstUser');

const roomName = document.querySelector('.room');
const usersList = document.querySelector('.users');

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const options = {
	transports: ['websocket'],
};

const socket = io();

socket.on('connect', () => {
	console.log('connected!');
});

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
	roomName.textContent = `Room Number ${room}`;

	usersList.innerHTML = users
		.map((user) => `<li>${user.username}</li>`)
		.join('');
	if (users[0].username === username) {
		firstUser.classList.remove('hide');
		videoContainer.classList.remove('userAdmin');
	} else {
		firstUser.classList.add('hide');
		videoContainer.classList.add('userAdmin');
	}
});

if (firstUser) {
	firstUser.addEventListener('submit', (e) => {
		e.preventDefault();

		let videoUrl = e.target.videoUrl.value;

		if (videoUrl) {
			let index = videoUrl.indexOf('=');
			let videoId = videoUrl.slice(index + 1, index + 12);
			let link = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`;
			socket.emit('videoUrl', link);
		}
	});
}

if (chatForm) {
	chatForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let msg = e.target.chat.value;

		if (!msg) {
			return false;
		}

		socket.emit('chatMessage', msg);

		e.target.chat.value = '';
		e.target.chat.focus();
	});
}

socket.on('message', (message) => {
	chatBoard.innerHTML += `<li> <h3>${message.username} ${message.time}</h3> <p>${message.text}</p></li>`;
	chatBoard.scrollTop = chatBoard.scrollHeight;
});

socket.on('video', (link) => {
	videoContainer.innerHTML = `<iframe id='video' src=${link} allowfullscreen allow="autoplay">
                </iframe>`;
});

/*________________________ Home Page Styling _____________________ */

const wrap = document.querySelector('.wrap');

if (wrap) {
	wrap.addEventListener('click', () => {
		joinRoom.style.display = 'flex';
	});
}

const menu = document.querySelector('.menu');
const xMenu = document.querySelector('.Xmenu');

if(menu){
	menu.addEventListener('click',()=>{
		usersList.style.right = '0px';
		usersList.style.top = '0px';
		menu.style.display = 'none';
		xMenu.style.display = 'block';
	})
	xMenu.addEventListener('click',()=>{
		usersList.style.right = '-1000px';
		menu.style.display = 'block';
		xMenu.style.display = 'none';
	})
}
