var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Layanan = require('../obj/layanan');
var Kelola_rt = require('../obj/kelola_rt');

router.get('/', async function(req, res) {
    var data = {};
    data.activePage = '/pelayanan';
    data.title = 'Pelayanan';
    data.active = 1;
    data.list = await Layanan.daftar_pengajuan(data.active);
    data.daftar_rt = await Kelola_rt.daftar_rt();
    res.view('pelayanan/index',data);
}).get('/:id(\\d+)', async function(req, res) {
    var data = {};
    data.activePage = '/pelayanan';
    data.title = 'Pelayanan';
    data.active = req.params.id;
    data.list = await Layanan.daftar_pengajuan(data.active);
    data.daftar_rt = await Kelola_rt.daftar_rt();
    res.view('pelayanan/index',data);
});

module.exports = router;
