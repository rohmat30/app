var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Autentikasi = require('../obj/autentikasi');

/* GET home page. */
router.get('/',async function(req, res) {
  if (req.session.id_user) {
    res.redirect('/home');
  } else {
    res.render('index', { title: 'Login'});
  }
}).post('/',async function(req, res){
  let username = req.body.username,
      password = req.body.password;
  let auth = await Autentikasi.login(username,password);

  if (auth.err) {
    res.render('index', { title:'Login', err: auth.msg });
  } else {
    req.session.id_user = auth.id_user;
    req.session.id_rt = auth.id_rt;
    res.redirect('/home');
  }
})

router.get('/logout',function(req, res){
  Autentikasi.logout(req,res);
});

router.get('/ubah-password',async function(req, res, next){
  let data = {};
  data.title = 'Ubah Password';
  res.view('autentikasi/ubah-password', data);
}).post('/ubah-password',async function(req, res, next){
  let data = {};
  data.validate = await Autentikasi.ubahPassword(req);
  data.title = 'Ubah Password';
  res.view('autentikasi/ubah-password',data);
});


router.get('/ubah-username',async function(req, res, next){
  let data = {};
  data.title = 'Ubah Username';
  res.view('autentikasi/ubah-username', data);
}).post('/ubah-username',async function(req, res, next){
  let data = {};
  data.validate = await Autentikasi.ubahUsername(req);
  data.title = 'Ubah Username';
  try {
    data.password = data.validate.find(x => x.param == 'password') == undefined?req.body.password:'';  // try {
  } catch (error) {
    data.password = null;
  }
  res.view('autentikasi/ubah-username',data);
});


router.all('*',function(req, res, next){
  if (!req.session.id_user) {
    res.redirect('/');
  }
  next();
});
module.exports = router;
