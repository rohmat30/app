var Layanan = function() {}

Layanan.prototype.validasi_pengajuan = async (req, list) => {
    req.checkBody({
        jenis_layanan: {
            custom: {
                options: (val) => {
                    return list.find(function(e){
                        return e.id_jenis_layanan == val
                    }) != undefined ? true : false;
                },
                errorMessage: 'Silakan Pilih Jenis Layanan!'
            }
        },
        keterangan: {
            trim: true,
            isLength: {
                options: {min: 1},
                errorMessage: 'Silakn Tulis Keterangan / Keperluan anda!'
            }
        }
    });
    return req.validationErrors();
}
Layanan.prototype.buat_pengajuan = async (req, list) => {
    let invalid = await Layanan.prototype.validasi_pengajuan(req,list);
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let data_insert = [
                post.keterangan,
                req.session.id_user,
                post.jenis_layanan,
                req.session.id_rt,
            ];
            return await sql.query('INSERT INTO layanan (keterangan,id_user,id_jenis_layanan,id_rt) VALUES(?)',[data_insert]);
        } catch (error) {
            return {error: error}
        }
    }
}

Layanan.prototype.daftar_pengajuan = async (id_rt,id_user) => {
    var query = 'SELECT * FROM layanan INNER JOIN jenis_layanan ON layanan.id_jenis_layanan = jenis_layanan.id_jenis_layanan INNER JOIN user ON user.id_user = layanan.id_user WHERE layanan.id_rt = '+id_rt;
    if (id_user != undefined) {
        query += ' AND layanan.id_user = '+id_user;
    }
    query += ' ORDER BY layanan.tanggal DESC'
    return await sql.query(query);
}

Layanan.prototype.validasi_konfirmasi = async (req) => {
    req.checkBody({
        konfirmasi: {
            matches: {
                options: /(Terima|Tolak)$/,
                errorMessage: 'Silakan pilih status konfirmasi!'
            }
        },
        pesan: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Pesan Tidak boleh kosong!'
            }
        }
    })
    return req.validationErrors();
}

Layanan.prototype.konfirmasi_layanan = async (req) => {
    let invalid = await Layanan.prototype.validasi_konfirmasi(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let konfirmasi_data = [
                post.konfirmasi,
                post.pesan,
                req.params.id
            ];
            let sql_konfirmasi = await sql.query('UPDATE layanan SET status = ?, pesan_rt = ? WHERE id_layanan = ?',konfirmasi_data);
            return {success : sql_konfirmasi};
        } catch (error) {
            return {error: error}
        }
    }
}

Layanan.prototype.verifikasi_layanan = async (id_layanan,id_rt) => {
    return await sql.query('SELECT * FROM layanan WHERE id_layanan = ? AND id_rt = ?',[id_layanan,id_rt]);
}

module.exports = new Layanan();