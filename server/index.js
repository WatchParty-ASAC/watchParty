'use strict';

require('dotenv').config();
require('./src/server').start(process.env.PORT)
