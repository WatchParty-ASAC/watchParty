'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
io.listen(server);

// Esoteric Resources
const errorHandler = require('./errors-handlers/500');
const notFound = require('./errors-handlers/404');
const authRoutes = require('./auth/router');
const bearerAuth = require('./auth/middleware/bearerAuth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('/client'));

app.use(authRoutes);

app.get('/', bearerAuth, homePage);

function homePage(req, res) {
  res.send('Home Page');
}

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
