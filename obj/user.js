var User = function() {};

User.prototype.verifikasiUser = (value) => {
    return sql.query('SELECT id_user,password FROM user WHERE (username = ? OR nik = ?) AND status_akun = ? LIMIT 1',[value,value,'1']);
};

User.prototype.cekUser = (value) => {
    return sql.query('SELECT id_user,nik,nama_lengkap,tempat_lahir,DATE_FORMAT(tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,password,status_akun,status_perkawinan,id_keluarga FROM user WHERE username = ? OR nik = ? OR id_user = ? LIMIT 1',[value,value,value]);
};

User.prototype.cekKK = (value) => {
    return sql.query('SELECT id_keluarga,nomor_kk,status_tinggal,alamat,DATE_FORMAT(tanggal_menempati,"%m/%Y") as tanggal_menempati,status_kepemilikan FROM keluarga WHERE nomor_kk = ? OR id_keluarga = ? LIMIT 1',[value,value]);
}

User.prototype.validasiKeluarga = (req) => {
    req.check({
        nomor_kk: {
            matches: {
                options: /([0-9]+){16}$/
            },
            errorMessage: 'Nomor kartu keluarga tidak sah, silakan ulangi!'
        },
        status_tinggal: {
            custom: {
                options: (value) => {
                    return value == 'sementara' || value == 'tetap';
                },
            },
            errorMessage: 'Pilihan tidak ada, silakan ulangi!'
        },
        alamat: {
            trim: true,
            isLength: {
                options: {min: 2}
            },
            errorMessage: 'Alamat salah, silakan ulangi!'
        },
        tanggal_menempati: {
            custom: {
                options: (val) => {
                    var tahun = val[1];
                    var bulan = parseInt(val[0]-1);
                    var sekarang = new Date();
                    var max_bulan = (tahun == sekarang.getFullYear())?sekarang.getMonth():12;
                    return bulan > max_bulan?false:true;
                }
            },
            errorMessage: 'Tanggal tidak boleh melebihi tanggal sekarang!'
        },
        status_kepemilikan: {
            custom: {
                options: (val) => {
                    return val == 'pemilik' || val == 'kontrak' || val == 'keluarga';
                }
            },
            errorMessage: 'Pilih status kepemilikan!'
        }
    });
    return req.validationErrors();
}

User.prototype.tambahKeluarga = async (req) => {
    let invalid = User.prototype.validasiKeluarga(req);
    if (!invalid) { 
        let notEmpty = await User.prototype.cekKK(req.body.nomor_kk);
        if (notEmpty.length > 0) {
            return {redirect: '/anggota-keluarga/'+notEmpty[0].id_keluarga};
        } else {
            try {
                let {nomor_kk, status_tinggal, alamat, status_kepemilikan, tanggal_menempati} = req.body;
                let tanggal = new Date(tanggal_menempati[1],parseInt(tanggal_menempati[0]-1),1);
                let query = await sql.query('INSERT INTO keluarga(nomor_kk,status_tinggal,alamat, status_kepemilikan, tanggal_menempati) VALUES(?,?,?,?,?)',[nomor_kk, status_tinggal, alamat, status_kepemilikan, tanggal]);
                return {redirect: '/tambah-anggota/'+query.insertId};
            } catch (error) {
                return error;
            }
        }
    } else {
        return invalid;
    }
}


User.prototype.ubahKeluarga = async (req) => {
    let invalid = User.prototype.validasiKeluarga(req);
    if (!invalid) {
        let notEmpty = await User.prototype.cekKK(req.body.nomor_kk);
        let [kk] = await User.prototype.cekKK(req.params.id);
        if (notEmpty.length == 0 || kk.nomor_kk == req.body.nomor_kk) {
            try {
                let {nomor_kk, status_tinggal, alamat, status_kepemilikan, tanggal_menempati} = req.body;
                let tanggal = new Date(tanggal_menempati[1],parseInt(tanggal_menempati[0]-1),1);
                let query = await sql.query('UPDATE keluarga SET nomor_kk = ?, status_tinggal = ?, status_kepemilikan = ?, tanggal_menempati = ?, alamat = ? WHERE id_keluarga = ?',[nomor_kk, status_tinggal, status_kepemilikan, tanggal, alamat, req.params.id]);
                return {redirect: '/anggota-keluarga/'+req.params.id};
            } catch (error) {
                return error;
            }
        } else {
            let err =  [ { location: 'body',
            param: 'nomor_kk',
            msg: 'Nomor kartu keluarga sudah digunakan, silakan ulangi!',
            value: req.body.nomor_kk, use: true } ];
            let object = req.validationErrors();
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const element = object[key];
                    err.push(element);
                }
            }
            return err;
        }
    } else {
        return invalid;
    }
}


User.prototype.validasiAnggotaKeluarga = async (req, my_nik) => {    
    let check_nik = await User.prototype.cekUser(req.body.nomor_nik);    

    var nik_sama = false;
    if (my_nik != undefined) {
        if (my_nik == check_nik[0].nik) {
            nik_sama = true;
        }
    }

    req.check({
        nomor_nik: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'NIK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (value) => {
                    if (my_nik!=undefined) {
                        return nik_sama;
                    } else {
                        return check_nik.length ? false : true;
                    }
                },
                errorMessage: 'NIK sudah digunakan silakan masukan nik yang berbeda!'
            }
        },
        status_keluarga: {
            custom: {
                options: (value) => {
                    return value == 'kepala_keluarga' || value == 'istri' || value == 'anak';
                }
            },
            errorMessage: 'Pilihan tidak ada, silakan ulangi!'
        },
        nama_lengkap: {
            trim: true,
            matches: {
                options: /([a-z\s]+){2,30}$/i
            },
            errorMessage: 'Nama Lengkap tidak sah, silakan ulangi!'
        },
        jenis_kelamin: {
            trim: true,
            custom: {
                options: (value) => {
                    return value == 'L' || value == 'P';
                }
            },
            errorMessage: 'Pilih jenis kelamin, silakan ulangi!'
        },
        tempat_lahir: {
            trim: true,
            matches: {
                options: /([a-z\s]+){2,30}$/i
            },
            errorMessage: 'Tempat Lahir tidak sah, silakan ulangi!'
        },
        tanggal_lahir: {
            toInt: true,
            custom: {
                options: (val) => {
                    if (val.length == 3) {
                        var tahun = val[2];
                        var bulan = val[1];
                        var tanggal = val[0];
                        var valid_tanggal;
                        if (bulan == 4 || bulan == 6 || bulan == 9 || bulan == 11) {
                            valid_tanggal = 30;
                        } else {
                            if (bulan == 2) {
                                if ((tahun%100 != 0 && tahun%4 == 0) || (tahun%100 == 0 && tahun%400 == 0)) {
                                    valid_tanggal = 29;                                    
                                } else {
                                    valid_tanggal = 28;
                                }
                            } else {
                                valid_tanggal = 31;
                            }
                        }

                        var sekarang = new Date();
                        var tanggal_input = new Date(tahun,(bulan-1),tanggal);
                        return (tanggal<=valid_tanggal)?(tanggal_input.getTime() <= sekarang.getTime())?true:false:false;
                    } else {
                        return false;
                    }
                }
            },
            errorMessage: 'Tanggal Lahir tidak sah! silakan ulangi'
        },
        agama: {
            trim: true,
            toInt: true,
            custom: {
                options: (value) => {
                    return value > 0 && value < 7;
                }
            },
            errorMessage: 'Silakan pilih agama!'
        },
        pendidikan: {
            trim: true,
            toInt: true,
            custom: {
                options: (value) => {
                    return value > 0 && value < 11;
                }
            },
            errorMessage: 'Silakan pilih pendidikan terakhir!'
        },
        status_perkawinan: {
            trim: true,
            toInt: true,
            custom: {
                options: (value) => {
                    return value > 0 && value < 5;
                }
            },
            errorMessage: 'Silakan pilih status Perkawinan!'
        }
    });

    return req.validationErrors();
}

User.prototype.tambahAnggotaKeluarga = async (req) => {
    let invalid = await User.prototype.validasiAnggotaKeluarga(req);
    let [cekKK] = await User.prototype.cekKK(req.params.id);
    let status_akun = cekKK.status_tinggal == 'tetap'? 1 : 0;
    if (invalid) {
        return invalid;
    } else {
        try {
            let pwd = await bcrypt.hash('12345',5);
            let post = req.body;
            let tgl_lahir = new Date(post.tanggal_lahir[2],post.tanggal_lahir[1],post.tanggal_lahir[0]);
            let values = [
                post.nomor_nik,
                post.nama_lengkap,
                post.tempat_lahir,
                tgl_lahir,
                post.jenis_kelamin,
                post.agama,
                post.status_keluarga,
                3,
                post.pendidikan,
                req.params.id+post.nama_lengkap.substr(0,1),
                pwd,
                status_akun,
                post.status_perkawinan,
                req.params.id
                ];
            let sql_insert = await sql.query('INSERT INTO user (nik,nama_lengkap,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,username,password,status_akun,status_perkawinan,id_keluarga) VALUES (?,?,?,?,?,?,?,?,?,CONCAT(?,LEFT(UUID(),4)),?,?,?,?)',values);
            return {status: true,msg: 'Berhasil ditambahkan',data: sql_insert};
        } catch (error) {
            return error;
        }
    }
}


User.prototype.ubahAnggotaKeluarga = async (req) => {
    let [cekUser] = await User.prototype.cekUser(req.params.id_user);

    let invalid = await User.prototype.validasiAnggotaKeluarga(req,cekUser.nik);
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tgl_lahir = new Date(post.tanggal_lahir[2],post.tanggal_lahir[1],post.tanggal_lahir[0]);
            let values = [
                post.nomor_nik,
                post.nama_lengkap,
                post.tempat_lahir,
                tgl_lahir,
                post.jenis_kelamin,
                post.agama,
                post.status_keluarga,
                post.pendidikan,
                post.status_perkawinan,
                req.params.id_user
                ];
            let sql_update = await sql.query('UPDATE user SET nik = ?,nama_lengkap = ?,tempat_lahir = ?,tanggal_lahir = ?,jenis_kelamin = ?,agama = ?,status_keluarga = ?,pendidikan = ?,status_perkawinan = ? WHERE id_user = ?',values);
            return {status: true,msg: 'Berhasil diubah',data: sql_update};
        } catch (error) {
            return error;
        }
    }
}


User.prototype.semuaKeluarga = function() {
    return sql.query('SELECT keluarga.*, GROUP_CONCAT(nama_lengkap ORDER BY user.status_keluarga DESC) AS nama_keluarga, COUNT(nama_lengkap) AS jumlah_anggota FROM keluarga LEFT JOIN USER ON keluarga.id_keluarga = user.id_keluarga GROUP BY keluarga.id_keluarga');
}

User.prototype.detailKeluarga = function(id_keluarga) {
    return sql.query('SELECT keluarga.*, user.id_user, user.nik, user.nama_lengkap, user.tempat_lahir, DATE_FORMAT(user.tanggal_lahir,"%d/%m/%Y") as tanggal_lahir, user.jenis_kelamin, user.status_keluarga, user.agama, user.pendidikan, user.status_akun, user.status_perkawinan FROM keluarga LEFT JOIN USER ON keluarga.id_keluarga = user.id_keluarga WHERE keluarga.id_keluarga = ? ORDER BY user.status_keluarga DESC',[id_keluarga]);
}

module.exports = new User();