var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('users',{data: req.session.id_user});
});

module.exports = router;
