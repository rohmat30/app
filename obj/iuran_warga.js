var Iuran_warga = function() {}

Iuran_warga.prototype.tarif_baru = async (req) => {
    let tarif = await Iuran_warga.prototype.tarif_iuran(1);
    req.checkBody({
        jumlah: {
            isInt: {
                options: {gt: 999,lt: 1000000},
                errorMessage: 'Tarif antara 1000 s/d 999999'
            },
            custom: {
                options: (val) => {
                    return parseInt(val) != tarif.jumlah_tarif;
                },
                errorMessage: 'Tarif tidak boleh sama dengan tarif saat ini!'
            }
        }
    });
    let invalid = req.validationErrors();
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;
            let tarif_baru = [
                post.jumlah,
                req.session.id_rt
            ];
    
            let sql_tarif = await sql.query('INSERT INTO tarif_iuran(jumlah_tarif,id_rt) VALUES(?)',[tarif_baru]);
            return {success: sql_tarif};
        } catch (error) {
            return {error: error};
        }
    }
}

Iuran_warga.prototype.tarif_iuran = async (id_rt) => {
    let [tarif] = await sql.query('SELECT id_tarif,jumlah_tarif,DATE_FORMAT(tanggal_berlaku, "%d/%m/%Y %H:%i:%s") AS tanggal_berlaku,id_rt FROM tarif_iuran WHERE id_rt = ? ORDER BY tanggal_berlaku DESC LIMIT 1',[id_rt]);
    return tarif;
}

module.exports = new Iuran_warga();