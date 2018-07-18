var express = require('express');
var router = express.Router();

Jenis_layanan = require('../obj/jenis_layanan');
var Layanan = require('../obj/layanan');

router.get('/', async function(req, res) {
    var data = {};
    data.title = 'Pengajuan Layanan';
    data.activePage = '/pengajuan-layanan';
    data.list = await Layanan.daftar_pengajuan(req.session.id_rt,req.session.id_user);

    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;
    }

    res.view('pengajuan-layanan/index', data);
});

router.get('/buat', async function(req, res) {
    var data = {};
    data.title = 'Buat Pengajuan';
    data.activePage = '/pengajuan-layanan';
    data.list = await Jenis_layanan.daftar_layanan('ASC');
    res.view('pengajuan-layanan/form',data);
}).post('/buat', async function(req, res) {
    var data = {};
    data.title = 'Buat Pengajuan';
    data.activePage = '/pengajuan-layanan';
    data.list = await Jenis_layanan.daftar_layanan('ASC');
    var proses = await Layanan.buat_pengajuan(req, data.list);

    if (proses.affectedRows) {
        req.session.msg = 'Berhasil ditambahkan!';
        res.redirect('/pengajuan-layanan');
    }

    res.view('pengajuan-layanan/form',data);
});

module.exports = router;
