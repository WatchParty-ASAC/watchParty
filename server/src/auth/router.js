'use strict';

const fs = require('fs');
const express = require('express');
const authRouter = express.Router();
const {io} = require('../server');

const User = require('./user');
const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');
const permissions = require('./middleware/acl');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).redirect('/');
    // res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error found ${error}`);
  }
});

module.exports = authRouter;
