var express = require('express');
var router = express.Router();
var Layanan = require('../obj/layanan');

router.get('/', async function(req, res) {
    var data            = {}
        data.activePage = '/tanggapan-layanan';
        data.title      = 'Tanggapan Layanan';
        data.list       = await Layanan.daftar_pengajuan(req.session.id_rt);
    if (req.session.msg) {
        data.simpan     = req.session.msg;
        req.session.msg = null;
    }

    res.view('tanggapan-layanan/index',data);
});

router.get('/konfirmasi/:id(\\d+)', async function(req, res, next) {
    var data            = {};
        data.activePage = '/tanggapan-layanan';
        data.title      = 'Tanggapan Layanan';
    var verifikasi      = await Layanan.verifikasi_layanan(req.params.id, req.session.id_rt);

    if (verifikasi.length) {
        res.view('tanggapan-layanan/form',data);
    } else {
        next();
    }
}).post('/konfirmasi/:id(\\d+)', async function(req, res, next) {
    var data            = {};
        data.activePage = '/tanggapan-layanan';
        data.title      = 'Tanggapan Layanan';

    let verifikasi      = await Layanan.verifikasi_layanan(req.params.id, req.session.id_rt);
    let proses          = await Layanan.konfirmasi_layanan(req);

    if (verifikasi.length) {
        if (proses.success) {
            req.session.msg = 'Berhasil di konfirmasi!';
            res.redirect('/tanggapan-layanan');
        }
        res.view('tanggapan-layanan/form',data);
    } else {
        next();
    }
});

module.exports = router;
