'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./errors-handlers/500');
const notFound = require('./errors-handlers/404');
const authRoutes = require('./auth/router');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
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
