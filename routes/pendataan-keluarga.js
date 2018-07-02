var express = require('express');
var router = express.Router();

User = require('../obj/user');
var Pendataan_keluarga = require('../obj/pendataan_keluarga');

/* GET home page. */
router.get('/',async function(req, res) {
    data = {}
    data.title = 'Pendataan Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.key = req.query.q;

    if (data.key) {
        data.daftar_keluarga = await Pendataan_keluarga.cari_keluarga(data.key,req.session.id_rt);
    } else {
        data.daftar_keluarga = await Pendataan_keluarga.daftar_keluarga(req.session.id_rt);
    }

    if (req.session.msg_a) {
        data.simpan = req.session.msg_a;
    }

    res.view('pendataan-keluarga/index', data);

    if (req.session.msg_a) {
        req.session.msg_a = null;
    }
})

router.get('/tambah-keluarga',async function(req, res) {
    data = {}
    data.title = 'Tambah Keluarga';
    data.activePage = '/pendataan-keluarga';
    res.view('pendataan-keluarga/form-keluarga', data);
}).post('/tambah-keluarga',async function(req, res) {
    data = {}
    data.title = 'Tambah Keluarga';
    data.activePage = '/pendataan-keluarga';
    let proses = await Pendataan_keluarga.tambah_keluarga(req);

    if (proses.success) {
        res.redirect('/pendataan-keluarga/anggota-keluarga/'+proses.id)
    } else {
        res.view('pendataan-keluarga/form-keluarga', data);
    }
})


router.get('/anggota-keluarga/:id(\\d+)',async function(req, res, next) {
    data = {}
    data.title = 'Pendataan Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.data = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    data.detail_kk = data.data[0];

    if (data.data.length) {
        if (data.detail_kk.id_rt == req.session.id_rt) {
            data.simpan = req.session.msg;
            res.view('pendataan-keluarga/anggota-keluarga', data);
            req.session.msg = null;
        } else {
            res.view('pendataan-keluarga/anggota-keluarga', data);
        }
    } else {
        next();
    }
})


router.get('/tambah-anggota/:id(\\d+)',async function(req, res, next) {
    data = {}
    data.title = 'Tambah Anggota Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.param = req.params;
  
    let anggota = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    let detail_kk = anggota.length?anggota[0]:{};
    
    if ((detail_kk.status_kk == '0' || detail_kk.status_kk == '2') && detail_kk.id_rt == req.session.id_rt) {
        res.view('pendataan-keluarga/form-anggota-keluarga', data);
    } else {
        next();
    }
}).post('/tambah-anggota/:id(\\d+)',async function(req, res) {
    data = {};
    data.title = 'Tambah Anggota Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.param = req.params;
    data.data = await Pendataan_keluarga.tambah_anggota_keluarga(req);
    
    let anggota = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    let detail_kk = anggota.length?anggota[0]:{};
    
    if (data.data.success) {
        data.success = true;
        data.autovalue = false;
    }

    if ((detail_kk.status_kk == '0' || detail_kk.status_kk == '2') && detail_kk.id_rt == req.session.id_rt) {
        res.view('pendataan-keluarga/form-anggota-keluarga', data);
    } else {
        next();
    }
})


router.get('/ubah-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res, next) {
    data = {}
    data.title = 'Ubah Anggota Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.param = req.params;
  
    data.kepala_keluarga = await Pendataan_keluarga.cek_status_kepala_keluarga(req.params.id);    
    let anggota = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    let detail_kk = anggota.length?anggota[0]:{};
    if(data.kepala_keluarga.length) {
        data.pasangan = await (anggota.find(e => e.status_keluarga == 'istri' || e.status_keluarga == 'suami')?true:false)
    }
    let setvalue = [];
    setvalue[0] = await (anggota.find(e => parseInt(e.id_user) == parseInt(req.params.id_user)));
    let [tanggal_lahir,bulan_lahir,tahun_lahir] = setvalue[0].tanggal_lahir.split('/');
    setvalue[0].tanggal_lahir = tanggal_lahir;
    setvalue[0].bulan_lahir = bulan_lahir;
    setvalue[0].tahun_lahir = tahun_lahir;
    data.setvalue = setvalue;

    if ((detail_kk.status_kk == '0' || detail_kk.status_kk == '2') && detail_kk.id_rt == req.session.id_rt) {
        res.view('pendataan-keluarga/form-ubah-anggota-keluarga', data);
    } else {
        next();
    }
}).post('/ubah-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res, next) {
    data = {};
    data.title = 'Ubah Anggota Keluarga';
    data.activePage = '/pendataan-keluarga';
    data.param = req.params;
    
    data.kepala_keluarga = await Pendataan_keluarga.cek_status_kepala_keluarga(req.params.id);
    
    let anggota = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    let detail_kk = anggota.length?anggota[0]:{};
    if(data.kepala_keluarga.length) {
        data.pasangan = await (anggota.find(e => e.status_keluarga == 'istri' || e.status_keluarga == 'suami')?true:false)
    }

    let get = await (anggota.find(e => parseInt(e.id_user) == parseInt(req.params.id_user)));
    data.data = await Pendataan_keluarga.ubah_anggota_keluarga(req,get.nik);
    if ((detail_kk.status_kk == '0' || detail_kk.status_kk == '2') && detail_kk.id_rt == req.session.id_rt) {
        if (data.data.success) {
            req.session.msg = 'Data Keluarga Berhasil diubah!';
            res.redirect('/pendataan-keluarga/anggota-keluarga/'+req.params.id);
        } else {
            res.view('pendataan-keluarga/form-ubah-anggota-keluarga', data);
        }
    } else {
        next();
    }
})



router.get('/simpan-keluarga/:id(\\d+)',async function(req, res, next){
    let [cek] = await Pendataan_keluarga.anggota_keluarga(req.params.id);
    if (cek.id_rt == req.session.id_rt) {
        let result = await Pendataan_keluarga.simpan_keluarga(req.params.id);
        if (result.changedRows >= 1) {
            req.session.msg = 'Data keluarga berhasil disimpan!';
        }
        res.redirect('/pendataan-keluarga/anggota-keluarga/'+req.params.id);
    } else {
        next()
    }
});  


router.get('/hapus-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res, next){
    let [cek] = await Pendataan_keluarga.anggota_keluarga(req.params.id);

    if (cek.id_rt == req.session.id_rt) {
        let result = await Pendataan_keluarga.hapus_anggota_keluarga(req.params.id_user);
        if (result.changedRows >= 1) {
            req.session.msg = 'Data keluarga berhasil dihapus!';
        }
        res.redirect('/pendataan-keluarga/anggota-keluarga/'+req.params.id);
    } else {
        next()
    }
});  

router.get('/nonaktif-anggota/:id(\\d+)/:id_user(\\d+)',async function(req, res, next){
    let [cek] = await Pendataan_keluarga.anggota_keluarga(req.params.id);

    if (cek.id_rt == req.session.id_rt && cek.level_user == 3) {
        let result = await Pendataan_keluarga.nonaktif_anggota_keluarga(req.params.id_user);
        
        let newdata = await Pendataan_keluarga.anggota_keluarga(req.params.id);
        if (result.changedRows >= 1) {
            if (newdata.length) {
                req.session.msg = 'Data keluarga berhasil dinonaktifkan!';
                res.redirect('/pendataan-keluarga/anggota-keluarga/'+req.params.id);
            } else {
                req.session.msg_a = 'Data keluarga berhasil dinonaktifkan!';
                res.redirect('/pendataan-keluarga');
            }
        }
    } else {
        next()
    }
});  

router.get('/perbaharui-kk/:id(\\d+)',async function(req, res, next){
    data = {};
    data.title = 'Perbaharui KK';
    data.activePage = '/pendataan-keluarga';
    data.params = req.params;
    let setvalue = await Pendataan_keluarga.detail_kk(req.params.id);
    setvalue[0].bulan_menempati = new Date(setvalue[0].tanggal_menempati).getMonth()+1;
    setvalue[0].tahun_menempati = new Date(setvalue[0].tanggal_menempati).getFullYear();

    data.setvalue = setvalue;
    res.view('pendataan-keluarga/form-perbaharui-kk',data);    
}).post('/perbaharui-kk/:id(\\d+)',async function(req, res, next){
    data = {};
    data.title = 'Perbaharui KK';
    data.activePage = '/pendataan-keluarga';
    data.params = req.params;
    let perbaharui = await Pendataan_keluarga.perbaharui_kk(req);
    if (perbaharui.success) {
        req.session.msg = 'Data Berhasil diperbaharui';
        res.redirect('/pendataan-keluarga/anggota-keluarga/'+req.params.id);
    } else {
        res.view('pendataan-keluarga/form-perbaharui-kk',data);    
    }
});

module.exports = router;
