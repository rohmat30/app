var express = require('express');
var router = express.Router();
var Jenis_layanan = require('../obj/jenis_layanan');

router.get('/', async function(req, res) {
    var data = {};
    data.title = 'Jenis Layanan';
    data.activePage = '/jenis-layanan';
    data.list = await Jenis_layanan.daftar_layanan();
    if (req.session.simpan_layanan) {
        data.simpan = req.session.simpan_layanan;
        req.session.simpan_layanan = null;
    }

    
    if (req.session.hapus_layanan) {
        data.hapus = req.session.hapus_layanan;
        req.session.hapus_layanan = null;
    }

    res.view('jenis-layanan/index',data);
}).post('/', async function(req, res) {
    var data = {};
    data.title = 'Jenis Layanan';
    data.activePage = '/jenis-layanan';
    var proses = await Jenis_layanan.tambah_layanan(req);
    if (proses.success) {
        req.session.simpan_layanan = 'Berhasil Ditambahkan';
        res.redirect('/jenis-layanan');
    } else {    
        data.list = await Jenis_layanan.daftar_layanan();
        res.view('jenis-layanan/index',data);
    }
});

router.get('/edit/:id(\\d+)', async function(req, res) {
    var data = {};
    data.title = 'Jenis Layanan';
    data.activePage = '/jenis-layanan';
    data.list = await Jenis_layanan.daftar_layanan();
    data.setvalue = await Jenis_layanan.verifikasi_layanan(req.params.id);
    console.log(data.setvalue);
    res.view('jenis-layanan/index',data);
}).post('/edit/:id(\\d+)', async function(req, res) {
    var data = {};
    data.title = 'Jenis Layanan';
    data.activePage = '/jenis-layanan';
    var proses = await Jenis_layanan.ubah_layanan(req);
    if (proses.success) {
        req.session.simpan_layanan = 'Berhasil Diubah';
        res.redirect('/jenis-layanan');
    } else {    
        data.list = await Jenis_layanan.daftar_layanan();
        res.view('jenis-layanan/index',data);
    }
});

router.get('/hapus/:id(\\d+)', async function(req, res, next) {
    let sql_del = await Jenis_layanan.hapus_layanan(req.params.id);

    if (sql_del.changedRows >= 1) {
        req.session.hapus_layanan = 'Berhasil dihapus!';
        res.redirect('/jenis-layanan');
    } else {
        next()
    }
})

module.exports = router;
