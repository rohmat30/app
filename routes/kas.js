var express = require('express');
var router = express.Router();

User    = require('../obj/user');
var Kas = require('../obj/kas');

router.get('/',async function(req, res) {
    var data            = {};
        data.title      = 'Kas';
        data.activePage = '/kas';
    
    if (req.session.kas) {
        data.simpan     = req.session.kas;
        req.session.kas = null;
    }

    data.total_masuk  = await Kas.kas_total(req,'masuk');
    data.total_keluar = await Kas.kas_total(req,'keluar');
    data.total        = await Kas.kas_total(req);    

    data.transaksi = await Kas.daftar_transaksi(req);

    res.view('kas/index',data);
});


router.get('/masuk', async function(req, res) {
    var data            = {};
        data.title      = 'Kas Masuk';
        data.activePage = '/kas';

    res.view('kas/form',data);
}).post('/masuk', async function(req, res) {
    var data            = {};
        data.title      = 'Kas Masuk';
        data.activePage = '/kas';
    
    var proses = await Kas.kas_masuk(req);

    if (proses.success) {
        req.session.kas = 'Kas Berhasil ditambahkan!';
        res.redirect('/kas');
    }

    res.view('kas/form',data);
});


router.get('/keluar', async function(req, res) {
    var data            = {};
        data.title      = 'Kas Keluar';
        data.activePage = '/kas';

    res.view('kas/form',data);
}).post('/keluar', async function(req, res) {
    var data            = {};
        data.title      = 'Kas Keluar';
        data.activePage = '/kas';
    
    var proses = await Kas.kas_keluar(req);

    if (proses.success) {
        req.session.kas = 'Kas Berhasil dikurangi!';
        res.redirect('/kas');
    }

    res.view('kas/form',data);
});

module.exports = router;
