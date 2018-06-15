var Autentikasi = function() {};

Autentikasi.prototype.login = async (username,password) => {
    try {
        let [get] = await User.cekUser(username);

        let cekpassword = await bcrypt.compare(password,get.password);

        if (cekpassword) {
            return {err: false, id_user: get.id_user};
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

Autentikasi.prototype.ubah_password = async function(req) {
    let [get] = await User.cekUser(req.session.id_user);
    let isPass = await bcrypt.compare(req.body.oldPass,get.password);

    req.check({
        oldPass: {
            trim: true,
            custom: {
                options: (value) => {
                    return isPass;
                },
                errorMessage: 'Password lama salah, silakan ulangi!'
            }
        },
        newPass: {
            custom: {
                options: (value) => {
                    return value !== req.body.oldPass
                },
                errorMessage: 'Password baru tidak boleh sama dengan password lama!'
            },
            isLength: {
                options: {min: 5},
                errorMessage: 'Password baru Minimal 5 Karakter'
            }
        },
        rePass: {
            custom: {
                options: (value) => {
                    return value == req.body.newPass
                },
                errorMessage: 'Konfirmasi Password Salah, Silakan ulang!'
            }
        }
    });
    var invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let pwd = await bcrypt.hash(req.body.newPass,5);
            let sqlupdate = await sql.query('UPDATE user SET password = ? WHERE id_user = ?',[pwd,req.session.id_user]);
            return {valid: true, msg: 'Password berhasil diubah!', data: sqlupdate};
        } catch (error) {
            return [{msg: error}]
        }
    }
}


Autentikasi.prototype.ubah_username = async function(req) {
    let [get] = await User.cekUser('1');
    let isPass = await bcrypt.compare(req.body.password,get.password);
    let [cek] = await User.cekUser(req.body.newUsername);
    
    req.check({
        password: {
            trim: true,
            custom: {
                options: (value) => {
                    return isPass;
                },
                errorMessage: 'Password salah, silakan ulangi!'
            }
        },
        newUsername: {
            trim: true,
            custom: {
                options: (value) => {
                    return cek==undefined?true:false;
                },
                errorMessage: 'Username telah digunakan, silakan gunakan username yang lain!'
            },
            isLength: {
                options: {min: 5, max: 10},
                errorMessage: 'Panjang Username antara 5 sampai 10 Karakter'
            },
            matches: {
                options: /([a-z0-9._]+)$/,
                errorMessage: 'Karakter tidak diizinkan, Gunakan huruf, angka, . (titik) dan _ (underscore)'
            }
        }
    });
    var invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let sqlupdate = await sql.query('UPDATE user SET username = ? WHERE id_user = ?',[req.body.newUsername,req.session.id_user]);
            return {valid: true, msg: 'Username berhasil diubah menjadi <b>'+req.body.newUsername+'</b>!',data:sqlupdate};
        } catch (error) {
            return [{msg: error}]
        }
    }
}


module.exports = new Autentikasi();