const {mongo} = require('../config');
const mongoose = require('mongoose');
const events = require('../utils/events');

let url = '';
if (mongo.user && mongo.password) {
    url = `mongodb://${mongo.username}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.db}`;
} else {
    url = `mongodb://${mongo.host}:${mongo.port}/${mongo.db}`;
}

let connection = mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }, function (error) {
  // Check error in initial connection. There is no 2nd param to the callback.
  if (error) {
    // console.log('Error connecting mongo', error);
    events.emit('MONGO_ERROR', error);
  } else {
    // console.log('Mongo Connected');
    events.emit('MONGO_CONNECTED', mongo);
  }
  // process.exit(1);
});

module.exports = connection;
