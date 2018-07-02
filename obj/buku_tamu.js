var Buku_tamu = function() {}

Buku_tamu.prototype.daftar_tamu = async (id_rt) => {
    return await sql.query('SELECT id,nik,DATE_FORMAT(tanggal,"%d/%m/%Y") as tanggal_bertamu,nama_tamu,alamat_asal,tujuan,id_rt FROM buku_tamu WHERE id_rt = ? ORDER BY tanggal DESC',[id_rt]);
}

Buku_tamu.prototype.validasi_tamu = (req) => {
    req.checkBody({
        nik: {
            matches: {
                options: /([0-9]+){16}$/,
                errorMessage: 'NIK tidak sah, silakan ulangi!'
            }
        },
        nama_tamu: {
            matches: {
                options: /([a-z ]+){2}$/i,
                errorMessage: 'Gunakan huruf atau spasi untuk nama tamu, silakan ulangi!'
            }
        },
        tujuan: {
            isLength: {
                options: {min: 3},
                errorMessage: 'Minimal 3 huruf, silakan ulangi!'
            }
        },
        alamat_asal: {
            isLength: {
                options: {min: 5},
                errorMessage: 'Minimal 5 huruf, silakan ulangi!'
            }
        }
    });
    return req.validationErrors();
}

Buku_tamu.prototype.tambah = async (req) => {
    let invalid = Buku_tamu.prototype.validasi_tamu(req);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let data_insert = [
                post.nik,
                post.nama_tamu,
                post.tujuan,
                post.alamat_asal,
                req.session.id_rt
            ];
            let sql_insert = await sql.query('INSERT INTO buku_tamu(nik,nama_tamu,tujuan,alamat_asal,id_rt) VALUES(?)',[data_insert]);
            return {success: sql_insert}
        } catch (error) {
            console.log(error);
            return {error: err};
        }
    }
}

Buku_tamu.prototype.ubah = async (req) => {
    let invalid = Buku_tamu.prototype.validasi_tamu(req);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let data_insert = [
                post.nik,
                post.nama_tamu,
                post.tujuan,
                post.alamat_asal,
                req.params.id
            ];
            let sql_insert = await sql.query('UPDATE buku_tamu SET nik = ?,nama_tamu = ?,tujuan = ?,alamat_asal = ? WHERE id = ?',data_insert);
            return {success: sql_insert}
        } catch (error) {
            console.log(error);
            return {error: err};
        }
    }
}

module.exports = new Buku_tamu();