var express = require('express');
var router = express.Router();
var Autentikasi = require('../mc/autentikasi');

/* GET home page. */
router.get('/',async function(req, res) {
  if (req.session.username) {
    res.redirect('/users');
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
    req.session.username = username;
    res.redirect('/users');
  }
})

router.get('/logout',function(req, res){
  Autentikasi.logout(req,res);
});

router.all('*',function(req, res, next){
  if (!req.session.username) {
    res.redirect('/');
  }
  next();
});
module.exports = router;
