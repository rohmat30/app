var express = require('express');
var router = express.Router();
User = require('../obj/user');
var Pendataan_keluarga = require('../obj/pendataan_keluarga');

router.get('/', async function(req, res) {
    var [user]          = await User.cekUser(req.session.id_user);
    var data            = {};
        data.activePage = '/anggota-keluarga';
        data.title      = 'Anggota Keluarga';
        data.user       = user;
        data.data       = await Pendataan_keluarga.anggota_keluarga(user.id_keluarga);

    res.view('anggota-keluarga/index',data);
});

module.exports = router;
