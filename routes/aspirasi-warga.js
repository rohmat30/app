var express = require('express');
var router = express.Router();

var Aspirasi = require('../obj/aspirasi');

router.get('/', async function(req, res) {
    var data            = {};
        data.title      = 'Aspirasi Warga';
        data.activePage = '/aspirasi-warga';
        data.list = await Aspirasi.daftar_aspirasi(1);

    res.view('aspirasi/index_rt',data);
});

router.get('/detail/:id(\\d+)', async function(req, res) {
    var data            = {};
        data.title      = 'Detail Aspirasi Warga';
        data.activePage = '/aspirasi-warga';

        data.detail = await Aspirasi.detail_aspirasi(req.params.id);

    res.view('aspirasi/detail',data);
});

module.exports = router;
