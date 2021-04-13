'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI), {useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,}

require('./src/server').start(process.env.PORT)
