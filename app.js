var createError      = require('http-errors');
var express          = require('express');
var session          = require('express-session');
var expressValidator = require('express-validator');
var path             = require('path');
var cookieParser     = require('cookie-parser');
var logger           = require('morgan');
var mysql            = require('promise-mysql');

global.bcrypt = require('bcrypt-nodejs');

// connect db
global.sql = mysql.createPool({
  host: 'localhost',
  user: 'ewargasi_root',
  password: 'e-warga_site',
  database: 'ewargasi_db'
});

// get source
var indexRouter               = require('./routes/index');
var homeRouter                = require('./routes/home');
var pendataanKeluargaRouter   = require('./routes/pendataan-keluarga');
var jenisLayananRouter        = require('./routes/jenis-layanan');
var bukuTamuRouter            = require('./routes/buku-tamu');
var inventarisRouter          = require('./routes/inventaris');
var aspirasiWargaRouter       = require('./routes/aspirasi-warga');
var kasRouter                 = require('./routes/kas');
var tanggapanLayananRouter    = require('./routes/tanggapan-layanan');
var kelolaPengumumanRouter    = require('./routes/kelola-pengumuman');
var iuranWargaRouter          = require('./routes/iuran-warga');
var laporanRouter             = require('./routes/laporan');
var penyampaianAspirasiRouter = require('./routes/panyampaian-aspirasi');
var anggotaKeluargaRouter     = require('./routes/anggota-keluarga');
var pengajuanLayananRouter    = require('./routes/pengajuan-layanan');
var pengumumanRouter          = require('./routes/pengumuman');
var kelolaRTRouter            = require('./routes/kelola-rt');
var pelayananRouter           = require('./routes/pelayanan');
var keuanganRouter            = require('./routes/keuangan');

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

// menu access
const menu = [[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: [{url:'/pelayanan',text: 'Pelayanan',icon:'mif-book-reference'},{url: '/jenis-layanan',text: 'Jenis Layanan',icon:'mif-menu'}],text: 'Kelola Layanan',icon: 'mif-layers'},
  {url: '/kas',text: 'Kas RW',icon:'mif-paypal'},
  {url: '/kelola-rt',text: 'Kelola RT',icon: 'mif-user-secret'},
  {url: '/kelola-pengumuman',text: 'Kelola Pengumuman',icon: 'mif-books'},
  {url: '/inventaris',text: 'Inventaris',icon: 'mif-shopping-basket2'},
  {url: '/laporan',text: 'Laporan',icon: 'mif-news'},
],[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: '/pendataan-keluarga', text: 'Pendataan Keluarga',icon: 'mif-users'},
  {url: '/tanggapan-layanan',text: 'Tanggapan Layanan',icon: 'mif-cabinet'},
  {url: '/kelola-pengumuman',text: 'Kelola Pengumuman',icon: 'mif-volume-low'},
  {url: '/aspirasi-warga',text: 'Aspirasi Warga',icon: 'mif-books'},
  {url: '/iuran-warga',text: 'Iuran Warga',icon: 'mif-credit-card'},
  {url: '/kas',text: 'Kas RT',icon: 'mif-paypal'},
  {url: '/buku-tamu',text: 'Buku Tamu',icon: 'mif-book-reference'},
  {url: '/inventaris',text: 'Inventaris',icon: 'mif-shopping-basket2'},
  {url: '/laporan',text: 'Laporan',icon: 'mif-news'},
],[
  {url: '/home',text: 'Beranda',icon: 'mif-home'},
  {url: '/pengajuan-layanan',text: 'Pengajuan Layanan',icon: 'mif-upload'},
  {url: '/pengumuman',text: 'Pengumuman',icon: 'mif-bell'},
  {url: '/penyampaian-aspirasi',text: 'Penyampaian Aspirasi',icon: 'mif-evernote'},
  {url: '/keuangan',text: 'Keuangan',icon: 'mif-coins'},
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
  res.view = function(page, data) {
    if (data == undefined) {
      data = {};
    }
    sql.query('SELECT level_user FROM user WHERE id_user = ? LIMIT 1',[req.session.id_user ? req.session.id_user : 2]).then(function(rows){
      try {
        levelUser = rows[0].level_user;
        data.getLevelUser = levelUser;
        if (data.activePage && active_page(menu[levelUser-1],data.activePage) == null){
            next();
        }
        data.menu = menu[levelUser-1];
        var errors = data.errors_custom ? data.errors_custom : req.validationErrors();
        
        data.field_error = {};

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

// set route
app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/pendataan-keluarga', pendataanKeluargaRouter);
app.use('/jenis-layanan', jenisLayananRouter);
app.use('/buku-tamu', bukuTamuRouter);
app.use('/inventaris', inventarisRouter);
app.use('/aspirasi-warga', aspirasiWargaRouter);
app.use('/kas', kasRouter);
app.use('/tanggapan-layanan', tanggapanLayananRouter);
app.use('/kelola-pengumuman', kelolaPengumumanRouter);
app.use('/iuran-warga', iuranWargaRouter);
app.use('/laporan', laporanRouter);
app.use('/kelola-rt', kelolaRTRouter);
app.use('/pelayanan', pelayananRouter);
app.use('/penyampaian-aspirasi', penyampaianAspirasiRouter);
app.use('/anggota-keluarga', anggotaKeluargaRouter);
app.use('/pengajuan-layanan', pengajuanLayananRouter);
app.use('/pengumuman', pengumumanRouter);
app.use('/keuangan', keuanganRouter);


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
