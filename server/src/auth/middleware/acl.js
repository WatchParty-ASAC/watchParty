'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    console.log(req.user.capabilities)
    try {
      if (req.user.capabilities.includes(capability)) {
        console.log(req.user)
        next();
      }
      else {
        console.log(req.user.capabilities)
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }
  }
}