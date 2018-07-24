var Pendataan_keluarga = function() {};

Pendataan_keluarga.prototype.daftar_keluarga = async (id_rt) => {
    var query = 'SELECT keluarga.*,GROUP_CONCAT(nama_lengkap) AS daftar_nama, COUNT(nama_lengkap) AS jumlah_anggota FROM keluarga LEFT JOIN user ON keluarga.id_keluarga = user.id_keluarga  WHERE user.aktif = 1';
    if (id_rt != undefined) {
        query += ' AND keluarga.id_rt = '+id_rt;
    }
    query += ' GROUP BY keluarga.id_keluarga';
    return await sql.query(query);
}


Pendataan_keluarga.prototype.cari_keluarga = async (key, id_rt) => {
    var query = 'SELECT keluarga.*,GROUP_CONCAT(nama_lengkap) AS daftar_nama, COUNT(nama_lengkap) AS jumlah_anggota FROM keluarga LEFT JOIN user ON keluarga.id_keluarga = user.id_keluarga WHERE user.aktif = 1';
    if (id_rt != undefined) {
        query += ' AND keluarga.id_rt = '+id_rt;
    }
    query += ' GROUP BY keluarga.id_keluarga HAVING daftar_nama LIKE "%'+key+'%" OR nomor_kk LIKE "%'+key+'%"';
    return await sql.query(query);
}

Pendataan_keluarga.prototype.tambah_keluarga = async (req) => {
    let cekKeluarga = await User.cekKK(req.body.nomor_kk);
    let cekNIK = await User.cekAktifUser(req.body.nik);
    let cek_non_aktif = await User.cekNonAktifUser(req.body.nik);
    req.checkBody({
        nomor_kk: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'Nomor KK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (val) => {
                    return cekKeluarga.length ? false : true;
                },
                errorMessage: 'Nomor KK telah digunakan, silakan gunakan yang lain!'
            }
        },
        status_tinggal: {
            matches: {
                options: /(tetap|sementara)$/,
                errorMessage: 'Silakan pilih status tinggal'
            }
        },
        status_kepemilikan: {
            matches: {
                options: /(pemilik|numpang|kontrak)$/,
                errorMessage: 'Silakan pilih status kepemilikan'
            }
        },
        bulan_menempati: {
            custom: {
                options: (val) => {
                    let bulan = val - 1;
                    let tanggal_input = new Date(req.body.tahun_menempati,bulan,1);
                    let tanggal_sekarang = new Date();
                    return tanggal_input.getTime() - tanggal_sekarang.getTime() >= 0 ? false : true;
                },
                errorMessage: 'Tanggal menempati tidak boleh lebih dari bulan atau tahun saat ini!'
            }
        },
        tahun_menempati: {
            custom: {
                options: (val) => {
                    return val > new Date().getFullYear() ? false : true;
                },
                errorMessage: 'Tanggal menempati tidak boleh lebih dari bulan atau tahun saat ini!'
            }
        },
        alamat: {
            trim: true,
            isLength: {
                options: {min: 5},
                errorMessage: 'Masukan minimal 5 karakter untuk alamat!'
            }
        },
        nik: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'NIK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (val) => {
                    return cekNIK.length ? false : true;
                },
                errorMessage: 'NIK telah digunakan, silakan gunakan yang lain!'
            }
        },
        nama_lengkap: {
            matches: {
                options: /([a-z ]+){2}$/i,
                errorMessage: 'Format Nama Salah, silakan ulangi!'
            },
        },
        jenis_kelamin: {
            matches: {
                options: /(L|P)$/,
                errorMessage: 'Pilih Jenis kelamin, silakan ulangi!'
            },
        },
        agama: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 7 ? true : false) : false;
                },
                errorMessage: 'Agama Tidak sah, silakan ulangi!'
            }
        },
        tempat_lahir : {
            matches: {
                options: /([a-z0-9 ]+){2}$/i,
                errorMessage: 'Tempat lahir salah, silakan ulangi!'
            },
        },
        tanggal_lahir : {
            custom: {
                options: (val) => {
                    let tahun = parseInt(req.body.tahun_lahir);
                    let bulan = parseInt(req.body.bulan_lahir);
                    let tanggal = parseInt(val);
                    let tahun_kabisat = ((tahun%4 == 0 && tahun % 100 != 0) || tahun%400 == 0)?29:28;
                    let max_tanggal = (bulan == 4 || bulan == 6 || bulan == 9 || bulan == 11)?30:bulan == 2?tahun_kabisat:31;
                    if (isNaN(tanggal) || isNaN(bulan) || isNaN(tahun)) {
                        return false;
                    } else {                        
                        return (tanggal <= max_tanggal)?true:false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        bulan_lahir : {
            custom: {
                options: (val) => {
                    let bulan = parseInt(val);
                    let tahun = new Date().getFullYear();
                    let bulan_ini = new Date().getMonth()+1;
                    let tahun_input = req.body.tahun_lahir;
                    let max_bulan = tahun_input < tahun ? 12 : (tahun_input > tahun ? 0 : bulan_ini);
                    if (!isNaN(bulan)) {
                        return max_bulan < bulan ? false : true ;
                    } else {
                        return false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        tahun_lahir : {
            custom: {
                options: (val) => {
                    let tahun_ini = new Date().getFullYear();
                    let tahun = parseInt(val);
                    return isNaN(tahun)||(tahun_ini < tahun)?false:true;
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        pendidikan: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 11 ? true : false) : false;
                },
                errorMessage: 'Silakan pilih pendidikan terakhir!'
            }
        },
        status_perkawinan: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 5 ? true : false) : false;
                },
                errorMessage: 'Silakan pilih status perkawinan!'
            }
        }
    });
    let invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tanggal_menempati = new Date(post.tahun_menempati,parseInt(post.bulan_menempati)-1,1);
            let tanggal_lahir = new Date(post.tahun_lahir,parseInt(post.bulan_lahir)-1,post.tanggal_lahir);

            let data_keluarga = [
                post.nomor_kk,
                post.status_tinggal,
                post.alamat,
                tanggal_menempati,
                post.status_kepemilikan,
                0,
                req.session.id_rt
            ];
            let insert_keluarga = await sql.query('INSERT INTO keluarga(nomor_kk,status_tinggal,alamat,tanggal_menempati,status_kepemilikan,status_kk,id_rt) VALUES(?)',[data_keluarga]);

            let username_first = insert_keluarga.insertId+post.nama_lengkap.substr(0,1).toUpperCase();
            let salt = bcrypt.genSaltSync(5);
            let password = bcrypt.hashSync('12345',salt);

            if (cek_non_aktif.length) {
            let data_kepala_keluarga = [
                post.nama_lengkap,
                post.tempat_lahir,
                tanggal_lahir,
                post.jenis_kelamin,
                post.agama,
                'kepala_keluarga',
                post.pendidikan,
                username_first,
                password,
                post.status_perkawinan,
                insert_keluarga.insertId,
                1,
                cek_non_aktif[0].id_user
            ];
            let insert_kepala_keluarga = await sql.query('UPDATE user SET nama_lengkap = ?,tempat_lahir = ?,tanggal_lahir = ?,jenis_kelamin = ?,agama = ?,status_keluarga = ?,pendidikan = ?,username = CONCAT(?,LEFT(UUID(),4)),password = ?,status_perkawinan = ?,id_keluarga = ?,aktif = ? WHERE id_user = ?',data_kepala_keluarga);
            return {success: true, keluarga: insert_keluarga, kepala_keluarga: insert_kepala_keluarga, id: insert_keluarga.insertId};
            } else {
            let data_kepala_keluarga = [
                post.nik,
                post.nama_lengkap,
                post.tempat_lahir,
                tanggal_lahir,
                post.jenis_kelamin,
                post.agama,
                'kepala_keluarga',
                3,
                post.pendidikan,
                username_first,
                password,
                post.status_perkawinan,
                insert_keluarga.insertId
            ];
            let insert_kepala_keluarga = await sql.query('INSERT INTO user(nik,nama_lengkap,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,username,password,status_perkawinan,id_keluarga) VALUES(?,?,?,?,?,?,?,?,?,CONCAT(?,LEFT(UUID(),4)),?,?,?)',data_kepala_keluarga);
            return {success: true, keluarga: insert_keluarga, kepala_keluarga: insert_kepala_keluarga, id: insert_keluarga.insertId};   
            }
        } catch (error) {
            return error;
        }
    }
}


Pendataan_keluarga.prototype.anggota_keluarga = (id_keluarga) => {
    return sql.query('SELECT keluarga.*, user.id_user, user.nik, user.nama_lengkap, user.tempat_lahir, DATE_FORMAT(user.tanggal_lahir,"%d/%m/%Y") as tanggal_lahir, user.jenis_kelamin, user.status_keluarga, user.agama, user.pendidikan, user.status_perkawinan, user.level_user FROM keluarga LEFT JOIN user ON keluarga.id_keluarga = user.id_keluarga WHERE keluarga.id_keluarga = ? AND user.aktif = ? ORDER BY user.status_keluarga DESC',[id_keluarga,1]);
}

Pendataan_keluarga.prototype.tambah_anggota_keluarga = async (req) => {
    let cekNIK = await User.cekAktifUser(req.body.nik);
    let cek_non_aktif = await User.cekNonAktifUser(req.body.nik);
    req.checkBody({
        nik: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'NIK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (val) => {
                    return cekNIK.length ? false : true;
                },
                errorMessage: 'NIK telah digunakan, silakan gunakan yang lain!'
            }
        },
        status_keluarga: {
            matches: {
                options: /(kepala_keluarga|istri|suami|anak|menantu|cucu|orangtua|mertua|famili_lain|pembantu|lainnya)$/,
                errorMessage: 'Status keluarga salah, silakan ulangi!'
            }
        },
        nama_lengkap: {
            matches: {
                options: /([a-z ]+){2}$/i,
                errorMessage: 'Format Nama Salah, silakan ulangi!'
            },
        },
        jenis_kelamin: {
            matches: {
                options: /(L|P)$/,
                errorMessage: 'Pilih Jenis kelamin, silakan ulangi!'
            }
        },
        agama: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 7 ? true : false) : false;
                },
                errorMessage: 'Agama Tidak sah, silakan ulangi!'
            }
        },
        tempat_lahir : {
            matches: {
                options: /([a-z0-9 ]+){2}$/i,
                errorMessage: 'Tempat lahir salah, silakan ulangi!'
            },
        },
        tanggal_lahir : {
            custom: {
                options: (val) => {
                    let tahun = parseInt(req.body.tahun_lahir);
                    let bulan = parseInt(req.body.bulan_lahir);
                    let tanggal = parseInt(val);
                    let tahun_kabisat = ((tahun%4 == 0 && tahun % 100 != 0) || tahun%400 == 0)?29:28;
                    let max_tanggal = (bulan == 4 || bulan == 6 || bulan == 9 || bulan == 11)?30:bulan == 2?tahun_kabisat:31;
                    if (isNaN(tanggal) || isNaN(bulan) || isNaN(tahun)) {
                        return false;
                    } else {                        
                        return (tanggal <= max_tanggal)?true:false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        bulan_lahir : {
            custom: {
                options: (val) => {
                    let bulan = parseInt(val);
                    let tahun = new Date().getFullYear();
                    let bulan_ini = new Date().getMonth()+1;
                    let tahun_input = req.body.tahun_lahir;
                    let max_bulan = tahun_input < tahun ? 12 : (tahun_input > tahun ? 0 : bulan_ini);
                    if (!isNaN(bulan)) {
                        return max_bulan < bulan ? false : true ;
                    } else {
                        return false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        tahun_lahir : {
            custom: {
                options: (val) => {
                    let tahun_ini = new Date().getFullYear();
                    let tahun = parseInt(val);
                    return isNaN(tahun)||(tahun_ini < tahun)?false:true;
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        pendidikan: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 11 ? true : false) : false;
                },
                errorMessage: 'Silakan pilih pendidikan terakhir!'
            }
        },
        status_perkawinan: {
            isInt: {
                options: {gt: 0, lt: 5},
                errorMessage: 'Silakan pilih status perkawinan!'
            }
        }
    });
    let invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tanggal_lahir = new Date(post.tahun_lahir,parseInt(post.bulan_lahir)-1,post.tanggal_lahir);
            let username_first = req.params.id+post.nama_lengkap.substr(0,1).toUpperCase();
            let salt = bcrypt.genSaltSync(5);
            let password = bcrypt.hashSync('12345',salt);

            if (cek_non_aktif.length) {
                let data_anggota_keluarga = [
                    post.nama_lengkap,
                    post.tempat_lahir,
                    tanggal_lahir,
                    post.jenis_kelamin,
                    post.agama,
                    post.status_keluarga,
                    post.pendidikan,
                    username_first,
                    password,
                    post.status_perkawinan,
                    req.params.id,
                    1,
                    cek_non_aktif[0].id_user
                ];
                let insert_anggota_keluarga = await sql.query('UPDATE user SET nama_lengkap = ?, tempat_lahir = ?,tanggal_lahir = ?,jenis_kelamin = ?,agama = ?,status_keluarga = ?,pendidikan = ?, username = CONCAT(?,LEFT(UUID(),4)),password = ?, status_perkawinan = ?,id_keluarga = ?, aktif = ? WHERE id_user = ?',data_anggota_keluarga);
                return {success: true, anggota_keluarga: insert_anggota_keluarga};
            } else {
                let data_anggota_keluarga = [
                    post.nik,
                    post.nama_lengkap,
                    post.tempat_lahir,
                    tanggal_lahir,
                    post.jenis_kelamin,
                    post.agama,
                    post.status_keluarga,
                    3,
                    post.pendidikan,
                    username_first,
                    password,
                    post.status_perkawinan,
                    req.params.id
                ];
                let insert_anggota_keluarga = await sql.query('INSERT INTO user(nik,nama_lengkap,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,username,password,status_perkawinan,id_keluarga) VALUES(?,?,?,?,?,?,?,?,?,CONCAT(?,LEFT(UUID(),4)),?,?,?)',data_anggota_keluarga);
                return {success: true, anggota_keluarga: insert_anggota_keluarga};
            }
        } catch (error) {
            return error;
        }
    }
}

Pendataan_keluarga.prototype.ubah_anggota_keluarga = async (req,mynik) => {
    let cekNIK = await User.cekUser(req.body.nik);
    var valid_nik = false;
    if (mynik != undefined) {
        if (cekNIK.length) {
            if (mynik == cekNIK[0].nik) {
                valid_nik = true;
            }
        } else {
            valid_nik = true;
        }
    }

    req.checkBody({
        nik: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'NIK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (val) => {
                    return valid_nik ? true : false;
                },
                errorMessage: 'NIK telah digunakan, silakan gunakan yang lain!'
            }
        },
        status_keluarga: {
            matches: {
                options: /(kepala_keluarga|istri|suami|anak|menantu|cucu|orangtua|mertua|famili_lain|pembantu|lainnya)$/,
                errorMessage: 'Status keluarga salah, silakan ulangi!'
            }
        },
        nama_lengkap: {
            matches: {
                options: /([a-z ]+){2}$/i,
                errorMessage: 'Format Nama Salah, silakan ulangi!'
            },
        },
        jenis_kelamin: {
            matches: {
                options: /(L|P)$/,
                errorMessage: 'Pilih Jenis kelamin, silakan ulangi!'
            }
        },
        agama: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 7 ? true : false) : false;
                },
                errorMessage: 'Agama Tidak sah, silakan ulangi!'
            }
        },
        tempat_lahir : {
            matches: {
                options: /([a-z0-9 ]+){2}$/i,
                errorMessage: 'Tempat lahir salah, silakan ulangi!'
            },
        },
        tanggal_lahir : {
            custom: {
                options: (val) => {
                    let tahun = parseInt(req.body.tahun_lahir);
                    let bulan = parseInt(req.body.bulan_lahir);
                    let tanggal = parseInt(val);
                    let tahun_kabisat = ((tahun%4 == 0 && tahun % 100 != 0) || tahun%400 == 0)?29:28;
                    let max_tanggal = (bulan == 4 || bulan == 6 || bulan == 9 || bulan == 11)?30:bulan == 2?tahun_kabisat:31;
                    if (isNaN(tanggal) || isNaN(bulan) || isNaN(tahun)) {
                        return false;
                    } else {                        
                        return (tanggal <= max_tanggal)?true:false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        bulan_lahir : {
            custom: {
                options: (val) => {
                    let bulan = parseInt(val);
                    let tahun = new Date().getFullYear();
                    let bulan_ini = new Date().getMonth()+1;
                    let tahun_input = req.body.tahun_lahir;
                    let max_bulan = tahun_input < tahun ? 12 : (tahun_input > tahun ? 0 : bulan_ini);
                    if (!isNaN(bulan)) {
                        return max_bulan < bulan ? false : true ;
                    } else {
                        return false;
                    }
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        tahun_lahir : {
            custom: {
                options: (val) => {
                    let tahun_ini = new Date().getFullYear();
                    let tahun = parseInt(val);
                    return isNaN(tahun)||(tahun_ini < tahun)?false:true;
                },
                errorMessage: 'Tanggal lahir salah, silakan ulangi'
            }
        },
        pendidikan: {
            custom: {
                options: (val) => {
                    return !isNaN(parseInt(val)) ? (val > 0 && val < 11 ? true : false) : false;
                },
                errorMessage: 'Silakan pilih pendidikan terakhir!'
            }
        },
        status_perkawinan: {
            isInt: {
                options: {gt: 0, lt: 5},
                errorMessage: 'Silakan pilih status perkawinan!'
            }
        }
    });
    let invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tanggal_lahir = new Date(post.tahun_lahir,parseInt(post.bulan_lahir)-1,post.tanggal_lahir);

            let data_anggota_keluarga = [
                post.nik,
                post.nama_lengkap,
                post.tempat_lahir,
                tanggal_lahir,
                post.jenis_kelamin,
                post.agama,
                post.status_keluarga,
                post.pendidikan,
                post.status_perkawinan,
                req.params.id_user
            ];
            let insert_anggota_keluarga = await sql.query('UPDATE user SET nik = ?,nama_lengkap = ?,tempat_lahir = ?,tanggal_lahir = ?,jenis_kelamin = ?,agama = ?,status_keluarga = ?,pendidikan = ?, status_perkawinan = ? WHERE id_user = ?',data_anggota_keluarga);
            return {success: true, kepala_keluarga: insert_anggota_keluarga};
        } catch (error) {
            return error;
        }
    }
}

Pendataan_keluarga.prototype.simpan_keluarga = (id) => {
    return sql.query('UPDATE keluarga SET status_kk = 1 WHERE id_keluarga = ?',[id]);
}

Pendataan_keluarga.prototype.hapus_anggota_keluarga = (id) => {
    return sql.query('DELETE FROM user WHERE id_user = ?',[id]);
}

Pendataan_keluarga.prototype.nonaktif_anggota_keluarga = (id) => {
    return sql.query('UPDATE user SET aktif = ? WHERE id_user = ?',[0,id]);
}


Pendataan_keluarga.prototype.detail_kk = (id_keluarga) => {
    return sql.query('SELECT * FROM keluarga WHERE id_keluarga = ? LIMIT 1',[id_keluarga]);
}

Pendataan_keluarga.prototype.perbaharui_kk = async (req) => {
    let cekKeluarga = await User.cekKK(req.body.nomor_kk);
    req.checkBody({
        nomor_kk: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'Nomor KK tidak sah, silakan ulangi!'
            },
            custom: {
                options: (val) => {
                    return cekKeluarga.length ? false : true;
                },
                errorMessage: 'Nomor KK telah digunakan, silakan gunakan yang lain!'
            }
        },
        status_tinggal: {
            matches: {
                options: /(tetap|sementara)$/,
                errorMessage: 'Silakan Pilih Status tinggal'
            }
        },
        status_kepemilikan: {
            matches: {
                options: /(pemilik|numpang|kontrak)$/,
                errorMessage: 'Silakan Pilih Status kepemilikian'
            }
        },
        status_kepemilikan: {
            matches: {
                options: /(pemilik|numpang|kontrak)$/,
                errorMessage: 'Silakan pilih status kepemilikan'
            }
        },
        bulan_menempati: {
            custom: {
                options: (val) => {
                    let bulan = val - 1;
                    let tanggal_input = new Date(req.body.tahun_menempati,bulan,1);
                    let tanggal_sekarang = new Date();
                    return (tanggal_input.getTime() - tanggal_sekarang.getTime()) >= 0 ? false : true;
                },
                errorMessage: 'Tanggal menempati tidak boleh lebih dari bulan atau tahun saat ini!'
            }
        },
        tahun_menempati: {
            custom: {
                options: (val) => {
                    return val > new Date().getFullYear() ? false : true;
                },
                errorMessage: 'Tanggal menempati tidak boleh lebih dari bulan atau tahun saat ini!'
            }
        },
        alamat: {
            trim: true,
            isLength: {
                options: {min: 5},
                errorMessage: 'Masukan minimal 5 karakter untuk alamat!'
            }
        }
    });
    var invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tanggal_menempati = new Date(post.tahun_menempati,parseInt(post.bulan_menempati)-1,1);

            let field_update = [
                    post.nomor_kk,
                    post.status_tinggal,
                    post.status_kepemilikan,
                    tanggal_menempati,
                    post.alamat,
                    2,
                    req.params.id
                ];
            let sql_update = await sql.query('UPDATE keluarga SET nomor_kk = ?,status_tinggal = ?,status_kepemilikan = ?,tanggal_menempati = ?,alamat = ?,status_kk = ? WHERE id_keluarga = ?',field_update);
            return {success: sql_update};
        } catch (error) {
            return {err: error};            
        }        
    }
}

module.exports = new Pendataan_keluarga();