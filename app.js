var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var expressValidator = require('express-validator');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('promise-mysql');

global.bcrypt = require('bcrypt');

global.sql = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ewarga'
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var validatorOptions = {};

app.use(expressValidator(validatorOptions));
app.use(session({secret: 'ewarga',resave: true, saveUninitialized: true}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.view =  function(page, data) {
    if (data == undefined) {
      data = {};
    }
    sql.query('SELECT level_user FROM user WHERE id_user = ? LIMIT 1',[req.session.id_user?req.session.id_user:1]).then(function(rows){
      try {
        data.getLevelUser = rows[0].level_user;
        res.render(page,data);
      } catch (error) {
        res.redirect('/');
      }
    });
  }
  next();
});

app.use('/', indexRouter);
app.use('/home', usersRouter);


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
