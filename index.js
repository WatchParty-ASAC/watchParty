'use strict';

const { start } = require('./src/server');

// io.listen(server);

require('dotenv').config();
start(process.env.PORT);
