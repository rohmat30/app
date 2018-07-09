var express    = require('express');
var router     = express.Router();
    User       = require('../obj/user');
var Inventaris = require('../obj/inventaris');

/* GET users listing. */
router.get('/', async function(req, res) {
    var data = {};
    data.title = 'Inventaris';
    data.activePage = '/inventaris';
    data.list = await Inventaris.daftar_inventaris(req);

    if (req.session.s_inv) {
        data.simpan = req.session.s_inv;
        req.session.s_inv = null;
    }
    res.view('inventaris/index',data);
});


router.get('/tambah', async function(req, res) {
    var data = {};
    data.title = 'Tambah Inventaris';
    data.activePage = '/inventaris';
    res.view('inventaris/form',data);
}).post('/tambah', async function(req, res) {
    var data            = {};
        data.title      = 'Tambah Inventaris';
        data.activePage = '/inventaris';
        proses          =  await Inventaris.tambah_inventaris(req);

    if (proses.success) {
        data.simpan   = 'Berhasil Ditambahkan';
        data.autovalue = false;
    }

    res.view('inventaris/form',data);
});



router.get('/edit/:id(\\d+)', async function(req, res) {
    var data = {};
    data.title = 'Ubah Inventaris';
    data.activePage = '/inventaris';
    data.setvalue =  await Inventaris.verifikasi_inventaris(req.params.id);
    res.view('inventaris/form',data);
}).post('/edit/:id(\\d+)', async function(req, res) {
    var data            = {};
        data.title      = 'Ubah Inventaris';
        data.activePage = '/inventaris';
        proses          =  await Inventaris.ubah_inventaris(req);

    if (proses.success) {
        req.session.s_inv = 'Berhasil Diubah';
        res.redirect('/inventaris');
    }

    res.view('inventaris/form',data);
});

module.exports = router;
