var Inventaris = function () {}

Inventaris.prototype.daftar_inventaris = async (req) => {
    let [cek] = await User.cekAktifUser(req.session.id_user);
    let rt_rw = req.session.id_rt;
    if (cek.level_user == 1) {
        rt_rw = 0;
    }

    return await sql.query('SELECT * FROM inventaris WHERE rt_rw = ?',[rt_rw]);
}

Inventaris.prototype.validasi_inventaris =  (req) => {
    req.checkBody({
        nama_barang: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Tidak boleh kosong'
            }
        },
        jumlah: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Masukan Jumlah'
            }
        },
        kondisi: {
            matches: {
                options: /(baik|rusak)$/,
                errorMessage: 'Silakan Pilih kondisi'
            }
        },
        keterangan: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Masukan Jumlah'
            }
        }
    });
    return req.validationErrors();
}

Inventaris.prototype.tambah_inventaris = async (req) => {
    let invalid = Inventaris.prototype.validasi_inventaris(req);
    let [cek] = await User.cekAktifUser(req.session.id_user);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let rt_rw = req.session.id_rt;
            if (cek.level_user == 1) {
                rt_rw = 0;
            }

            let data_insert = [
                post.nama_barang,
                post.jumlah,
                post.kondisi,
                post.keterangan,
                rt_rw
            ];
            let sql_insert = await sql.query('INSERT INTO inventaris(nama_barang,jumlah,kondisi,keterangan,rt_rw) VALUES(?)',[data_insert]);
            return {success: sql_insert};
        } catch (error) {
            return {error: error}
        }
    }
}

Inventaris.prototype.ubah_inventaris = async (req) => {
    let invalid = Inventaris.prototype.validasi_inventaris(req);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;

            let data_update = [
                post.nama_barang,
                post.jumlah,
                post.kondisi,
                post.keterangan,
                req.params.id
            ];

            let sql_update = await sql.query('UPDATE inventaris SET nama_barang = ?,jumlah = ?,kondisi = ?,keterangan = ? WHERE id = ?',data_update);
            return {success: sql_update};
        } catch (error) {
            return {error: error}
        }
    }
}

Inventaris.prototype.verifikasi_inventaris = async (id) => {
    return await sql.query('SELECT * FROM inventaris WHERE id = ?',[id]);
}

module.exports = new Inventaris();