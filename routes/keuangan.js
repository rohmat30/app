var express = require('express');
var router = express.Router();

var Iuran_warga = require('../obj/iuran_warga');
var Kas = require('../obj/kas');

router.get('/',async function(req, res) {
    var data = {};
    data.title = 'Keuangan';
    data.activePage = '/keuangan';
    data.kas_masuk = await Kas.kas_total(req,'masuk');
    data.kas_keluar = await Kas.kas_total(req,'keluar');
    data.kas_saldo = await Kas.kas_total(req);
    data.iuran_warga = await Iuran_warga.jumlah_bayar(req.session.id_rt);
    res.view('keuangan/index',data);
});

module.exports = router;