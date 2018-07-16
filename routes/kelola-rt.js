var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Kelola_rt = require('../obj/kelola_rt');

router.get('/', async function(req, res) {
    var data            = {};
        data.title      = 'Kelola RT';
        data.activePage = '/kelola-rt';
        data.list       =  await Kelola_rt.daftar_rt();
    if (req.session.success) {
        data.simpan = req.session.success;
        req.session.success = null;
    }
    res.view('kelola-rt/index',data);
});

router.get('/daftar-warga/:id(\\d+)', async function(req, res, next) {
    var data            = {};
        data.title      = 'Daftar Warga';
        data.activePage = '/kelola-rt';
        var verifikasi_rt = await Kelola_rt.verifikasi_rt(req.params.id);
    if (verifikasi_rt.length) {
        data.key = req.query.q;
        if (data.key) {
            data.daftar_user = await User.pencarian_user(req.params.id,data.key);
        } else {
            data.daftar_user = await User.daftar_user(req.params.id);
        }
        data.id_rt = req.params.id;
        res.view('kelola-rt/daftar-warga',data);
    } else {
        next()
    }
});

router.get('/set-rt/:id(\\d+)/:id_user(\\d+)',async function(req, res, next) {
    let set_rt = await Kelola_rt.ganti_rt(req);


    if (set_rt.success) {
        req.session.success = 'Berhasil diganti!';
        res.redirect('/kelola-rt');
    } else {
        next()
    }
});

module.exports = router;
