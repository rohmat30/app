var express = require('express');
var router = express.Router();
var User = require('../obj/user');

/* GET users listing. */
router.get('/', async function(req, res) {
  var data = {};
  data.title = 'Pendataan Warga';
  data.activePage = '/pendataan-warga';
  data.data = await User.semuaKeluarga();
  res.view('pendataan-warga/index',data);
});

router.get('/tambah-kk', async function(req, res) {
  var data = {};
  data.title = 'Tambah Keluarga';
  data.activePage = '/pendataan-warga';
  res.view('pendataan-warga/form-keluarga',data);
}).post('/tambah-kk', async function(req, res) {
  var data = {};
  data.title = 'Tambah Keluarga';
  data.activePage = '/pendataan-warga';
  var success = await User.tambahKeluarga(req);
  if (success.redirect) {
    res.redirect('/pendataan-warga'+success.redirect);
  } else {
    res.view('pendataan-warga/form-keluarga',data);
  }
});

router.get('/ubah-kk/:id(\\d+)', async function(req, res) {
  var data = {};
  data.title = 'Ubah Keluarga';
  data.activePage = '/pendataan-warga';
  data.setvalue = await User.cekKK(req.params.id);
  data.param = req.params;
  data.setvalue[0].tanggal_menempati = data.setvalue[0].tanggal_menempati!=null?data.setvalue[0].tanggal_menempati.split('/'):null;
  res.view('pendataan-warga/form-keluarga',data);
}).post('/ubah-kk/:id(\\d+)', async function(req, res) {
  var data = {};
  data.title = 'Ubah Keluarga';
  data.activePage = '/pendataan-warga';
  data.param = req.params;
  var success = await User.ubahKeluarga(req);
  if (Array.isArray(success)) {
    if(success[0].use) {
      data.errors_custom = success;
    }
  }
  if (success.redirect) {
    res.redirect('/pendataan-warga'+success.redirect);
  } else {
    res.view('pendataan-warga/form-keluarga',data);
  }
});


router.get('/tambah-anggota/:id(\\d+)',async function(req, res, next){
  var data = {};
  data.title = 'Form Anggota Keluarga';
  data.param = req.params;
  data.activePage = '/pendataan-warga';
  let verifikasi_kk = await User.cekKK(req.params.id);
  if (verifikasi_kk.length) {
    res.view('pendataan-warga/form-anggota-keluarga',data);
  } else {
    next();
  }
}).post('/tambah-anggota/:id(\\d+)',async function(req, res){
  var data = {};
  data.title = 'Form Anggota Keluarga';
  var success = await User.tambahAnggotaKeluarga(req);
  data.activePage = '/pendataan-warga';
  data.param = req.params;
  if (success.status) {
    data.autovalue = false;
    data.success = success;
  }
  res.view('pendataan-warga/form-anggota-keluarga',data);
});



router.get('/ubah-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res, next){
  var data = {};
  data.title = 'Ubah Anggota Keluarga';
  data.param = req.params;
  data.activePage = '/pendataan-warga';
  let verifikasi_kk = await User.cekKK(req.params.id);
  let verifikasi_user = await User.cekUser(req.params.id_user);
  
  if (verifikasi_kk.length && verifikasi_user.length) {
    data.setvalue = verifikasi_user;
    data.setvalue[0].nomor_nik = verifikasi_user[0].nik;
    data.setvalue[0].tanggal_lahir = verifikasi_user[0].tanggal_lahir.split('/');
    res.view('pendataan-warga/form-anggota-keluarga',data);
  } else {
    next();
  }
}).post('/ubah-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res){
  var data = {};
  data.title = 'Ubah Anggota Keluarga';
  var success = await User.ubahAnggotaKeluarga(req);
  data.activePage = '/pendataan-warga';
  data.param = req.params;
  if (success.status) {
    data.success = success;
  }
  res.view('pendataan-warga/form-anggota-keluarga',data);
});


router.get('/anggota-keluarga/:id(\\d+)', async function(req, res, next) {
  var data = {};
  data.title = 'Pendataan Warga';
  data.activePage = '/pendataan-warga';
  data.data = await User.detailKeluarga(req.params.id);
  let verifikasi_kk = await User.cekKK(req.params.id);
  if (verifikasi_kk.length) {
    res.view('pendataan-warga/anggota-keluarga',data);
  } else {
    next();
  }
});

module.exports = router;
