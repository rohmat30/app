var express = require('express');
var router = express.Router();

var Aspirasi = require('../obj/aspirasi');

router.get('/', async function(req, res) {
    var data            = {};
        data.title      = 'Penyampaian Aspirasi';
        data.activePage = '/penyampaian-aspirasi';
        data.list = await Aspirasi.daftar_aspirasi(req.session.id_rt,req.session.id_user);

    res.view('aspirasi/index_warga',data);
});

router.get('/buat', async function(req, res) {
    var data            = {};
        data.title      = 'Buat Penyampaian Aspirasi';
        data.activePage = '/penyampaian-aspirasi';
    res.view('aspirasi/form',data);
}).post('/buat', async function(req, res) {
    var data            = {};
        data.title      = 'Buat Penyampaian Aspirasi';
        data.activePage = '/penyampaian-aspirasi';
    
    var proses          = await Aspirasi.buat_aspirasi(req);
    if (proses.success) {
        data.simpan    = 'Berhasil Disimpan';
        data.autovalue = false;
    }    
    res.view('aspirasi/form',data);
});

router.get('/edit/:id(\\d+)', async function(req, res, next) {
    var data            = {};
        data.title      = 'Edit Penyampaian Aspirasi';
        data.activePage = '/penyampaian-aspirasi';

    var verifikasi_aspirasi =  await Aspirasi.verifikasi_aspirasi(req);

    if (verifikasi_aspirasi.length) {
        data.setvalue = await verifikasi_aspirasi;
        res.view('aspirasi/form',data);
    } else {
        next()
    }
}).post('/edit/:id(\\d+)', async function(req, res) {
    var data            = {};
        data.title      = 'Edit Penyampaian Aspirasi';
        data.activePage = '/penyampaian-aspirasi';    
    
    var proses          = await Aspirasi.edit_aspirasi(req);
    if (proses.success) {
        data.simpan     = 'Berhasil Diubah';
    }
    res.view('aspirasi/form',data);
});

module.exports = router;
