
const socket = io('localhost:4000/');

socket.on('connect',()=>{
    console.log('connected')
})