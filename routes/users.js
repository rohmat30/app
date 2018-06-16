var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.view('users',{data: req.session.id_user,activePage:'/home'});
});

// router.get('/donatur', function(req, res) {
//   res.view('users',{data: req.session.id_user,activePage:'/donatur'});
// });

module.exports = router;
