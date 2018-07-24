var express = require('express');
var router = express.Router();
var Iuran_warga = require('../obj/iuran_warga');
var Pendataan_keluarga = require('../obj/pendataan_keluarga');

router.get('/', async function(req, res, next) {
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
    data.pendapatan = await Iuran_warga.jumlah_bayar(req.session.id_rt);

    if (data.tarif) {
        res.view('iuran-warga/index',data);
    } else {
        next();
    }
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
        req.session.msg = 'Berhasil diubah, Untuk mengubah kembali tarif baru diperlukan waktu sampai tanggal 1 bulan depan!';
        res.redirect('/iuran-warga');
    }

    data.tarif = await Iuran_warga.tarif_iuran(req.session.id_rt);
    data.pendapatan = await Iuran_warga.jumlah_bayar(req.session.id_rt);
    res.view('iuran-warga/index',data);
});


router.get('/transaksi/:id(\\d+)', async function(req, res) {
    var data = {}
    data.title = 'Transaksi';
    data.activePage = '/iuran-warga';
    data.data = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    data.detail_kk = data.data.length ? data.data[0] : {};
    var tahun = req.query.tahun || new Date().getFullYear();
    data.bayar_iuran = await Iuran_warga.transaksi_bayar(req.params.id,data.detail_kk.id_rt,tahun);
    data.params = req.params;

    if (req.session.msg) {
        data.simpan = req.session.msg;
        req.session.msg = null;
    }
    res.view('iuran-warga/transaksi',data);
});


router.post('/proses-transaksi/:id(\\d+)', async function(req, res) {
    var proses = await Iuran_warga.proses_bayar(req);
    if (proses.affectedRows > 0) {
        let bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        req.session.msg = 'Berhasil membayar untuk pembayaran '+bulan[req.body.bulan-1]+' '+req.body.tahun+'!';
        res.redirect('/iuran-warga/transaksi/'+req.params.id);
    } else {
        next();
    }
});

module.exports = router;
