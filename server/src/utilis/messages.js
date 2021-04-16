'use strict';

const moment = require('moment');

module.exports = (username, text) => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
};
