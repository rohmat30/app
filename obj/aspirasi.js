var Aspirasi = function () {}

Aspirasi.prototype.daftar_aspirasi = async (id_rt, id_user) => {
    let sql_query;
    if (id_user != undefined) {
        sql_query = 'SELECT id_aspirasi,DATE_FORMAT(tanggal,"%d/%m/%Y") as tanggal,DATE_FORMAT(tanggal,"%H:%i:%s") as waktu,judul_aspirasi,isi_aspirasi,id_user,id_rt FROM aspirasi WHERE id_rt = ? AND id_user = ? ORDER BY tanggal DESC';
        return await sql.query(sql_query, [id_rt, id_user]);
    } else {
        sql_query = 'SELECT user.id_user,user.nama_lengkap,user.nik,aspirasi.id_aspirasi,DATE_FORMAT(aspirasi.tanggal,"%d/%m/%Y") as tanggal,DATE_FORMAT(aspirasi.tanggal,"%H:%i:%s") as waktu,aspirasi.judul_aspirasi,aspirasi.isi_aspirasi,aspirasi.id_rt FROM aspirasi INNER JOIN user ON user.id_user = aspirasi.id_user WHERE aspirasi.id_rt = ? ORDER BY tanggal DESC';
        return await sql.query(sql_query, [id_rt]);
    }
}

Aspirasi.prototype.detail_aspirasi = async (id) => {
    return await sql.query('SELECT user.id_user,user.nama_lengkap,user.nik,aspirasi.id_aspirasi,DATE_FORMAT(aspirasi.tanggal,"%d/%m/%Y") as tanggal,DATE_FORMAT(aspirasi.tanggal,"%H:%i:%s") as waktu,aspirasi.judul_aspirasi,aspirasi.isi_aspirasi,aspirasi.id_rt FROM aspirasi INNER JOIN user ON user.id_user = aspirasi.id_user WHERE aspirasi.id_aspirasi = ? LIMIT 1',[id]);
}

Aspirasi.prototype.validasi_aspirasi = (req) => {
    req.checkBody({
        judul_aspirasi: {
            trim: true,
            isLength: {
                options: {min: 5},
                errorMessage: 'Minimal 5 Karakter'
            }
        },
        isi_aspirasi: {
            trim: true,
            isLength: {
                options: {min: 5},
                errorMessage: 'Minimal 5 Karakter'
            }
        }
    });
    return req.validationErrors();
}

Aspirasi.prototype.buat_aspirasi = async (req) => {
    let invalid = Aspirasi.prototype.validasi_aspirasi(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let data_create = [
                post.judul_aspirasi,
                post.isi_aspirasi,
                req.session.id_user,
                req.session.id_rt
            ];
            let sql_create = await sql.query('INSERT INTO aspirasi(judul_aspirasi, isi_aspirasi, id_user, id_rt) VALUES(?)',[data_create]);
            return {success: sql_create}
        } catch (error) {
            return {error: error}
        }
    }
}


Aspirasi.prototype.edit_aspirasi = async (req) => {
    let invalid = Aspirasi.prototype.validasi_aspirasi(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;

            let data_update = [
                post.judul_aspirasi,
                post.isi_aspirasi,
                req.params.id
            ];

            let sql_update = await sql.query('UPDATE aspirasi SET judul_aspirasi = ? , isi_aspirasi = ? WHERE id_aspirasi = ?', data_update);

            return {success: sql_update}
        } catch (error) {
            return {error: error}
        }
    }
}

Aspirasi.prototype.verifikasi_aspirasi = async (req) => {
    return await sql.query('SELECT * FROM aspirasi WHERE id_aspirasi = ? AND id_user = ?',[req.params.id,req.session.id_user]);
}

module.exports = new Aspirasi();