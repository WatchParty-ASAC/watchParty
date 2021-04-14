'use strict';
const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: "http://localhost:4000",
		methods: ["GET", "POST"],
		allowedHeaders: ["Access-Control-Allow-Origin"],
	}
})
;
io.listen(server);


const errorHandler = require('./errors-handlers/500');
const notFound = require('./errors-handlers/404');
const authRoutes = require('./auth/router');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("../client"));

app.get('/',(req,res)=>{
  res.sendFile('admin.html',{root: '../client' })
})
// app.get('/user',(req,res)=>{
//   res.sendFile('user.html',{root: '../client' })
// })



io.on('connection',(socket)=>{
  console.log('user connected')
})








app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  io,
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
