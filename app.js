const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');

console.log('[SERVER] Server up and running on port', process.env.PORT === undefined ? '3000.' : process.env.PORT);

// database init
const env = process.env.NODE_ENV || 'development';
let dbURI = 'mongodb+srv://admin:HUxTfvEVaM6y6uLd@diertest.oan7d.mongodb.net/DierTest?retryWrites=true&w=majority';
if (env === 'development')
    dbURI = 'mongodb://localhost:27017/test';
try {
    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.log(err);
    });
    db.once('open', () => {
        console.log('[DB] Connection to database intiliazed!');
    });
} catch (err) {
    console.log('[DB] Problem with connecting with database!');
    console.log(err);
}

// routes
const indexRouter = require('./routes/index');
const korisnikRouter = require('./routes/korisnikRouter');
const firmaRouter = require('./routes/firmaRouter');
const prevoznoSredstvoRouter = require('./routes/prevoznoSredstvoRouter');
const mestoRouter = require('./routes/mestoRouter');
const dkoRouter = require('./routes/dkoRouter');
const dozvolaRouter = require('./routes/dozvolaRouter');
const otpadRouter = require('./routes/otpadRouter');
const opasniOtpadRouter = require('./routes/opasniOtpadRouter');
const katalogRouter = require('./routes/katalogRouter');
const delatnostRouter = require('./routes/delatnostRouter');
const skladisteRouter = require('./routes/skladisteRouter');
const skladisteTretmanRouter = require('./routes/skladisteTretmanRouter');
const skladisteDeponijaRouter = require('./routes/skladisteDeponijaRouter');
const skladisteSkladistenjeRouter = require('./routes/skladisteSkladistenje');
const izvestajRouter = require('./routes/izvestajRouter');
const godisnjiIzvestajRouter = require('./routes/godisnjiIzvestajRouter');
const authRouter = require('./routes/authRouter');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/mesecniizvestaj', izvestajRouter);
app.use('/api/godisnjiizvestaj', godisnjiIzvestajRouter);
app.use('/api/korisnik', korisnikRouter);
app.use('/api/prevoznosredstvo', prevoznoSredstvoRouter);
app.use('/api/firma', firmaRouter);
app.use('/api/mesto', mestoRouter);
app.use('/api/otpad', otpadRouter);
app.use('/api/opasniotpad', opasniOtpadRouter);
app.use('/api/dozvola', dozvolaRouter);
app.use('/api/skladiste', skladisteRouter);
app.use('/api/skladistetretman', skladisteTretmanRouter);
app.use('/api/skladistedeponija', skladisteDeponijaRouter);
app.use('/api/skladisteskladistenje', skladisteSkladistenjeRouter);
app.use('/api/delatnost', delatnostRouter);
app.use('/api/katalog', katalogRouter);
app.use('/api/dko', dkoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
