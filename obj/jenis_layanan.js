var Jenis_layanan = function() {};

Jenis_layanan.prototype.validasi_layanan = (req) => {
    req.checkBody({
        nama_jenis_layanan: {
            trim: true,
            isLength: {
                options: {min: 1},
                errorMessage: 'Tidak Boleh Kosong'
            }
        }
    });
    return req.validationErrors();
}

Jenis_layanan.prototype.tambah_layanan = async (req) => {
    var invalid = Jenis_layanan.prototype.validasi_layanan(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let sql_add = await sql.query('INSERT INTO jenis_layanan(nama_jenis_layanan) VALUES(?)',[req.body.nama_jenis_layanan]);
            return {success: true,result: sql_add}
        } catch (error) {
            return {err: error}
        }
    }
}

Jenis_layanan.prototype.daftar_layanan = async (sort) => {
    var query = 'SELECT * FROM jenis_layanan WHERE aktif = ? ORDER BY id_jenis_layanan ';
    query += sort != undefined ? sort : 'DESC';
    return await sql.query(query,[1]);
}

Jenis_layanan.prototype.ubah_layanan = async (req) => {
    var invalid = Jenis_layanan.prototype.validasi_layanan(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let sql_update = await sql.query('UPDATE jenis_layanan SET nama_jenis_layanan = ? WHERE id_jenis_layanan = ?',[req.body.nama_jenis_layanan,req.params.id]);
            return {success: true,result: sql_update}
        } catch (error) {
            return {err: error}
        }
    }
}

Jenis_layanan.prototype.hapus_layanan = async (id_jenis_layanan) => {
    return await sql.query('UPDATE jenis_layanan SET aktif = ? WHERE id_jenis_layanan = ?',[0,id_jenis_layanan]);
}

Jenis_layanan.prototype.verifikasi_layanan = async (id) => {
    return await sql.query('SELECT * FROM jenis_layanan WHERE id_jenis_layanan = ?',[id]);
}

module.exports = new Jenis_layanan();