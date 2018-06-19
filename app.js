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
var pendataanWargaRouter = require('./routes/pendataan-warga');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressValidator());

app.use(session({secret: 'ewarga',resave: false, saveUninitialized: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const menu = [[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: [{url:'/kas-rw',text: 'Kas RW',icon:'mif-paypal'},{url: '/donatur',text: 'Donatur',icon:'mif-folder-shared'}],text: 'Kelola Keuangan',icon: 'mif-dollar'},
  {url: '/kelola-rt',text: 'Kelola RT',icon: 'mif-user-secret'},
  {url: '/kelola-pengumuman',text: 'Kelola Pengumuman',icon: 'mif-books'},
  {url: '/pelayanan',text: 'Pelayanan',icon: 'mif-layers'},
  {url: '/laporan',text: 'Laporan',icon: 'mif-news'},
],[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: [{url:'/pendataan-warga',text: 'Pendataan Warga',icon:'mif-user-plus'},{url: '/mutasi-warga',text: 'Mutasi Warga',icon:'mif-user-minus'}],text: 'Kelola Warga',icon: 'mif-users'},
  {url: [{url:'/tanggapan-layanan',text: 'Tanggapan',icon:'mif-open-book'},{url: '/jenis-layanan',text: 'Jenis Layanan',icon:'mif-menu'}],text: 'Layanan',icon: 'mif-cabinet'},
  {url: '/kelola-pengumuman',text: 'Kelola Pengumuman',icon: 'mif-bell'},
  {url: '/aspirasi-warga',text: 'Aspirasi Warga',icon: 'mif-books'},
  {url: '/iuran-warga',text: 'Iuran Warga',icon: 'mif-credit-card'},
  {url: '/kas-rt',text: 'Kas RT',icon: 'mif-paypal'},
  {url: '/buku-tamu',text: 'Buku Tamu',icon: 'mif-book-reference'},
  {url: '/inventaris',text: 'Inventaris',icon: 'mif-shopping-basket2'},
  {url: '/laporan',text: 'Laporan',icon: 'mif-news'},
],[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: '/pengajuan-layanan',text: 'Pengajuan Layanan',icon: 'mif-upload'},
  {url: '/pengumuman',text: 'Pengumuman',icon: 'mif-bell'},
  {url: '/pengajuan-aspirasi',text: 'Pengajuan Aspirasi',icon: 'mif-evernote'},
  {url: '/anggota-keluarga',text: 'Anggota Keluarga',icon: 'mif-users'},
]];


var active_page = function(data, page) {
  var active = null;
  for (const key in data) {
    if (Array.isArray(data[key].url)) {
        for (const keys in data[key].url) {
          if (data[key].url[keys].url == page) {
            data[key].open = true;
            data[key].url[keys].active = true;
            active = 1;
            break;
        }
      }
    } else if (data[key].url == page) {
      data[key].open = true;
      active = 1;
    }
    if (active) {
      break;
    }
  }
  return active;
}

app.use(function(req, res, next){
  res.view =  function(page, data) {
    if (data == undefined) {
      data = {};
    }
    sql.query('SELECT level_user FROM user WHERE id_user = ? LIMIT 1',[req.session.id_user?req.session.id_user:2]).then(function(rows){
      try {
        levelUser = rows[0].level_user;
        data.getLevelUser = levelUser;
        if (data.activePage && active_page(menu[levelUser-1],data.activePage) == null){
            next();
        }
        data.menu = menu[levelUser-1];
        var errors = data.errors_custom?data.errors_custom:req.validationErrors();
        
        data.field_error = {};

        console.log(data.field_error);
        if (errors) {
          var el = [];
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              let index_array = errors.map((e) => {return e.param}).indexOf(errors[key].param);
              if (!el.includes(index_array)) {
                data.field_error[errors[key].param] = {value: errors[key].value,msg: errors[key].msg};
                el.push(index_array);
              }
            }
          }
          delete el;
        }
        if (data.autovalue != false) {
          if (data.setvalue) {
            data.input = data.setvalue[0];
            console.log(data.input);
          } else {
            data.input = req.body;            
          }
        } else {
          data.input = {};
        }
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
app.use('/pendataan-warga', pendataanWargaRouter);


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
