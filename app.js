const express = require('express');
const helmet = require('helmet');
const app = express();
const createError = require('http-errors');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const db = require('./db');
const routes = require('./routes.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
    origin: process.env.NODE_ENV ? 'https://janje12.github.io/dier-frontend/' : 'http://localhost:4200',
};

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

db.databaseInit();
routes.routesInit(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

console.log('[SERVER] Server up and running on port', process.env.PORT === undefined ? '3000.' : process.env.PORT);

module.exports = app;
