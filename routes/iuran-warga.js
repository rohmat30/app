var express = require('express');
var router = express.Router();
var Iuran_warga = require('../obj/iuran_warga');
var Pendataan_keluarga = require('../obj/pendataan_keluarga');

router.get('/', async function(req, res) {
    var data = {};
    data.title = 'Iuran Warga';
    data.activePage = '/iuran-warga';
    data.key = req.query.q;

    if (data.key) {
        data.list = await Pendataan_keluarga.cari_keluarga(data.key,req.session.id_rt);
    } else {
        data.list = await Pendataan_keluarga.daftar_keluarga(req.session.id_rt);
    }
    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;   
    }

    data.tarif = await Iuran_warga.tarif_iuran(req.session.id_rt);
    res.view('iuran-warga/index',data);
}).post('/', async function(req, res) {
    var data = {};
    data.title = 'Iuran Warga';
    data.activePage = '/iuran-warga';
    data.key = req.query.q;

    if (data.key) {
        data.list = await Pendataan_keluarga.cari_keluarga(data.key,req.session.id_rt);
    } else {
        data.list = await Pendataan_keluarga.daftar_keluarga(req.session.id_rt);
    }
    
    let proses = await Iuran_warga.tarif_baru(req);

    if (proses.success) {
        req.session.msg = 'Berhasil diubah, Untuk mengubah kembali tarif baru diperlukan waktu 24jam!';
        res.redirect('/iuran-warga');
    }

    data.tarif = await Iuran_warga.tarif_iuran(req.session.id_rt);
    res.view('iuran-warga/index',data);
});

module.exports = router;
