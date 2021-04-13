'use strict';

const users = require('../user')

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('Invalid Login') }

    const token = req.headers.authorization.split(' ').pop();
    // console.log('222', token)
    const validUser = await users.authenticateWithToken(token);
    
    req.user = validUser;
    req.token = validUser.token;
    // console.log(validUser);
    next();

  } catch (e) {
    res.status(403).send('Invalid Login');
  }

  function _authError() {
    next('Invalid Login');
  }
}