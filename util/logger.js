// imports
const winston = require('winston');

// create a logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),        
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

// export the logger
module.exports = logger;
