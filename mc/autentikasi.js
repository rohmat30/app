var Akun = require('../mc/akun');

var Autentikasi = function() {};

Autentikasi.prototype.login = async (username,password) => {
    try {
        let cekAkun = await Akun.cekAkun(username);
        let cekpassword = await bcrypt.compare(password,cekAkun[0].password);
        if (cekpassword) {
            return {err: false};
        } else {
            return {err: true, msg: 'Password salah silakan ulangi!'};
        }
    } catch (err) {
        return {err: true, msg: 'Username/NIK salah silakan ulangi!'};
    }
};

Autentikasi.prototype.logout = function(req,res) {
    req.session.destroy();
    res.redirect('/');
}

module.exports = new Autentikasi();