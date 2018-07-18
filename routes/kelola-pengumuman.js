var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Pengumuman = require('../obj/pengumuman');

router.get('/', async function(req, res) {
    var data = {}
    data.title = 'Kelola Pengumuman';
    data.activePage = '/kelola-pengumuman';
    data.list = await Pengumuman.daftar_pengumuman(req.session.id_rt,'rt');
    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;
    }
    res.view('kelola-pengumuman/index',data);
});

router.get('/buat', async function(req, res) {
    var data = {}
    data.title = 'Kelola Pengumuman';
    data.activePage = '/kelola-pengumuman';
    res.view('kelola-pengumuman/form',data);
}).post('/buat', async function(req, res) {
    var data = {}
    data.title = 'Kelola Pengumuman';
    data.activePage = '/kelola-pengumuman';
    var proses = await Pengumuman.buat(req);
    if (proses.success) {
        req.session.msg = 'Berhasil ditambahkan';
        res.redirect('/kelola-pengumuman');
    }
    res.view('kelola-pengumuman/form',data);
});



module.exports = router;
