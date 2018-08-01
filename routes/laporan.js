var express = require('express');
var router = express.Router();
var User = require('../obj/user');
/* GET users listing. */
router.get('/', async function(req, res) {
    var data = {};
    data.title = 'Laporan';
    data.activePage = '/laporan';
    data.daftar_user = await User.daftar_user(req.session.id_rt); 
    res.view('laporan/index',data);
});

router.get('/preview', async function(req, res, next) {
    try {
        let id_rt = req.session.id_rt;
        let data = await User.daftar_user(id_rt);
        var pdf = require('../obj/laporan').buat_laporan(data,id_rt);
        pdf.pipe(res);
        pdf.end();
    } catch (error) {
        next()
    }
}).post('/preview', async function(req, res, next) {
    try {
        let id_rt = req.body.id_rt;
        let data = await User.daftar_user(id_rt);
        var pdf = require('../obj/laporan').buat_laporan(data,id_rt);
        pdf.pipe(res);
        pdf.end();
    } catch (error) {
        next()
    }
});

module.exports = router;
