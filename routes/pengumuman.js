var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Pengumuman = require('../obj/pengumuman');

router.get('/', async function(req, res) {
    var data = {}
    data.title = 'Pengumuman';
    data.activePage = '/pengumuman';
    data.list = await Pengumuman.daftar_pengumuman(req.session.id_rt,'warga');
    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;
    }
    res.view('pengumuman/index',data);
});


router.get('/detail/:id(\\d+)', async function(req, res) {
    var data = {}
    data.title = 'Detail Pengumuman';
    data.activePage = '/pengumuman';
    data.detail = await Pengumuman.detail_pengumuman(req.params.id);
    res.view('pengumuman/detail',data);
});

module.exports = router;
