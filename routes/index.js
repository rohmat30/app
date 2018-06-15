var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Autentikasi = require('../obj/autentikasi');

/* GET home page. */
router.get('/',async function(req, res) {
  if (req.session.id_user) {
    res.redirect('/home');
  } else {
    res.render('index', { title: 'title'});
  }
}).post('/',async function(req, res){
  let username = req.body.username,
      password = req.body.password;
  let auth = await Autentikasi.login(username,password);

  if (auth.err) {
    res.render('index', { title:'Login', err: auth.msg });
  } else {
    req.session.id_user = auth.id_user;
    res.redirect('/home');
  }
})

router.get('/logout',function(req, res){
  Autentikasi.logout(req,res);
});

router.get('/ubah-password',async function(req, res, next){
  let data = {title: 'Ubah Password'};
  res.view('autentikasi/ubah-password', data);
}).post('/ubah-password',async function(req, res, next){
  let data = {};
  data.validate = await Autentikasi.ganti_password(req);
  data.title = 'Ubah Password';
  console.log(data);
  res.view('autentikasi/ubah-password',data);
});

router.post('/api/valid-password.json',async function(req, res, next){
  let data = await Autentikasi.ganti_password(req);
  res.json(data);
});

router.all('*',function(req, res, next){
  if (!req.session.id_user) {
    res.redirect('/');
  }
  next();
});
module.exports = router;
