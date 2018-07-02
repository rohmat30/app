var Jenis_layanan = function() {};

Jenis_layanan.prototype.validasi_layanan = (req) => {
    req.checkBody({
        nama_layanan: {
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
            let sql_add = await sql.query('INSERT INTO layanan(nama_layanan) VALUES(?)',[req.body.nama_layanan]);
            return {success: true,result: sql_add}
        } catch (error) {
            return {err: error}
        }
    }
}

Jenis_layanan.prototype.daftar_layanan = async () => {
    return await sql.query('SELECT * FROM layanan WHERE aktif = ? ORDER BY id_layanan DESC',[1]);
}

Jenis_layanan.prototype.ubah_layanan = async (req) => {
    var invalid = Jenis_layanan.prototype.validasi_layanan(req);
    if (invalid) {
        return invalid;
    } else {
        try {
            let sql_update = await sql.query('UPDATE layanan SET nama_layanan = ? WHERE id_layanan = ?',[req.body.nama_layanan,req.params.id]);
            return {success: true,result: sql_update}
        } catch (error) {
            return {err: error}
        }
    }
}

Jenis_layanan.prototype.hapus_layanan = async (id_layanan) => {
    return await sql.query('UPDATE layanan SET aktif = ? WHERE id_layanan = ?',[0,id_layanan]);
}

module.exports = new Jenis_layanan();