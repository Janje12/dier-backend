var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-autopopulate'));

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;

db.on('error', (err) => { console.log(err)});
db.once('open', () => { console.log('Connection to database intiliazed!'); });

var indexRouter = require('./routes/index');
var korisnikRouter = require('./routes/korisnikRouter');
var mestoRouter = require('./routes/mestoRouter');
var dozvolaRouter = require('./routes/dozvolaRouter');
var otpadRouter = require('./routes/otpadRouter');
var opasniOtpadRouter = require('./routes/opasniOtpadRouter');
var katalogRouter = require('./routes/katalogRouter');
var delatnostRouter = require('./routes/delatnostRouter');
var skladisteRouter = require('./routes/skladisteRouter');
var skladisteTretmanRouter = require('./routes/skladisteTretmanRouter');
var authRouter = require('./routes/authRouter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/korisnik', korisnikRouter);
app.use('/api/mesto', mestoRouter);
app.use('/api/otpad', otpadRouter);
app.use('/api/opasniotpad', opasniOtpadRouter);
app.use('/api/dozvola', dozvolaRouter);
app.use('/api/skladiste', skladisteRouter);
app.use('/api/skladistetretman', skladisteTretmanRouter);
app.use('/api/delatnost', delatnostRouter);
app.use('/api/katalog', katalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
