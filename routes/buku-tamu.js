var express = require('express');
var router = express.Router();
var Buku_tamu = require('../obj/buku_tamu');
/* GET users listing. */

router.get('/', async function(req, res) {
    var data        = {};
    data.title      = 'Buku Tamu';
    data.activePage = '/buku-tamu';
    data.list       = await Buku_tamu.daftar_tamu(1);

    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;
    }

    res.view('buku-tamu/index',data);
});


router.get('/tambah', async function(req, res) {
    var data        = {};
    data.title      = 'Tambah Tamu';
    data.activePage = '/buku-tamu';

    res.view('buku-tamu/form',data);
}).post('/tambah', async function(req, res) {
    var data        = {};
    data.title      = 'Tambah Tamu';
    data.activePage = '/buku-tamu';
    let tambah       = await Buku_tamu.tambah(req);
    if (tambah.success) {
        data.autovalue = false;
        data.simpan = 'Berhasil ditambahkan!';
    }
    res.view('buku-tamu/form',data);
});


router.get('/edit/:id(\\d+)', async function(req, res) {
    var data        = {};
    data.title      = 'Ubah Data Tamu';
    data.activePage = '/buku-tamu';
    data.setvalue = await sql.query('SELECT * FROM buku_tamu WHERE id = ?',[req.params.id]);

    res.view('buku-tamu/form',data);
}).post('/edit/:id(\\d+)', async function(req, res) {
    var data        = {};
    data.title      = 'Ubah Data Tamu';
    data.activePage = '/buku-tamu';
    let tambah       = await Buku_tamu.ubah(req);
    if (tambah.success) {
        req.session.msg = 'Berhasil diubah!';
        res.redirect('/buku-tamu');
    }
    res.view('buku-tamu/form',data);
});


module.exports = router;
