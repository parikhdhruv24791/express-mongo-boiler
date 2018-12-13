const config = require('./config');
const express = require('express');
// const mongoose = require('mongoose');
const helmet = require('helmet');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/router');
const events = require('./utils/events');
require('./utils/db');
// require('./logger');

events.on('MONGO_CONNECTED', (mongo) =>{
    console.log(`Mongo Connected on ${mongo.host}`);
    bootApplication();
});

events.on('MONGO_ERROR', (msg) =>{
    console.log(`Please check the connection`);
    console.log(msg);
    process.exit();
});

function bootApplication () {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(helmet());
    app.use(router);

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).json({ error: JSON.stringify(err) });
    });

    app.listen(config.PORT, (err) => {
        if (err) console.log(err);
        console.log(`Listening on port ${config.PORT}`);
    });
}
