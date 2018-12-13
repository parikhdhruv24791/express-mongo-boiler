const winston = require('winston');
const fs = require('fs');
const util = require('util');
const config = require('./config');
require('winston-daily-rotate-file');
let logger;

if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir);
}

new winston.transports.DailyRotateFile({
    filename: './' + config.logDir + 'api-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
console.log('Logger Env: ', process.env.NODE_ENV);

if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() == 'production') {
    logger = winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp({
                        format: 'YYYY-MM-DDTHH:mm:ssZZ'
                    }),
                    winston.format.json()
                )
            })
        ]
    });
    logger.stream = {
        write: function (message, encoding) {
            logger.info(message);
        }
    };
    console.log = function (...arguments) {
        logger.info(...formatArgs(arguments));
    };
    console.info = function (...arguments) {
        logger.info(...formatArgs(arguments));
    };
    console.warn = function (...arguments) {
        logger.warn(...formatArgs(arguments));
    };
    console.error = function (...arguments) {
        logger.error(...formatArgs(arguments));
    };
}
function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}
module.exports = logger;
