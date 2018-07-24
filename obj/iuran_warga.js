var Iuran_warga = function() {}

Iuran_warga.prototype.tarif_baru = async (req) => {
    let tarif = await Iuran_warga.prototype.tarif_iuran(req.session.id_rt);
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

Iuran_warga.prototype.transaksi_bayar = async (id_keluarga,id_rt,tahun) => {
    try {
    let transaksi_bayar = [];
    let [min] = await sql.query('SELECT DATE_FORMAT(MIN(tanggal_berlaku),"%m") AS bulan,DATE_FORMAT(MIN(tanggal_berlaku),"%Y") AS tahun FROM tarif_iuran WHERE id_rt = ?',[id_rt]);
    let max_bulan = parseInt(new Date().getMonth())+1;
    let max_tahun = new Date().getFullYear();
    
    if (min.tahun != tahun) {
        min.bulan = 1;
    }
 
    if (max_tahun != tahun) {
        if (tahun > max_tahun) {
            max_bulan = 0;
        } else {
            max_bulan = 12;
        }
        if (min.tahun > tahun) {
            min.bulan = 1;
            max_bulan = 0;
        }
    }

    for (let index = max_bulan; index >= parseInt(min.bulan); index--) {
        let data_tarif = [tahun+'/'+(parseInt(index)+1)+'/01',id_rt]
 
        let [bayar] = await sql.query('SELECT jumlah_tarif AS tarif FROM tarif_iuran WHERE tanggal_berlaku <= ? AND id_rt = ? ORDER BY tanggal_berlaku DESC LIMIT 1',data_tarif);
        bayar = bayar == undefined ? {} : bayar;
        let [bayar_lunas] = await sql.query('SELECT * FROM bayar_iuran WHERE bulan_iuran = ? AND tahun_iuran = ? AND id_keluarga = ?',[index,tahun,id_keluarga]);

        bayar.bulan = index.toString();
        bayar.tahun = tahun;
        bayar.status = false;
        bayar.tanggal_bayar = 'Belum';
        if (bayar_lunas != null) {
            bayar.bulan = bayar_lunas.bulan_iuran;
            bayar.tahun = bayar_lunas.tahun_iuran;
            bayar.status = true;
            bayar.tarif = bayar_lunas.jumlah;
            let tanggal = new Date(bayar_lunas.tanggal_bayar);
            bayar.tanggal_bayar = tanggal.getDate()+'/'+tanggal.getMonth().toString().padStart(3-tanggal.getMonth().toString().length,'0')+'/'+tanggal.getFullYear();
        }
        transaksi_bayar.push(bayar);
    }
    return transaksi_bayar;
    
    } catch (error) {
        return await {error: error};
    }
}

Iuran_warga.prototype.jumlah_bayar = async (id_rt) => {
    let tanggal = new Date();
    let bulan = tanggal.getFullYear()+'/'+(parseInt(tanggal.getMonth())+1)+'/01';
    let interval_bulan = tanggal.getFullYear()+'/'+(parseInt(tanggal.getMonth())+2)+'/01';
    let data = [
        bulan,
        interval_bulan,
        id_rt
    ];
    let [bulan_ini] = await sql.query('SELECT SUM(jumlah) AS total FROM bayar_iuran WHERE (tanggal_bayar BETWEEN ? AND ?) AND id_rt = ?',data);
    let [semua] = await sql.query('SELECT SUM(jumlah) AS total FROM bayar_iuran WHERE id_rt = ?',[id_rt]);
    return {bulan_ini : bulan_ini.total, semua : semua.total, bulan: bulan, bulan_d: interval_bulan}
}

Iuran_warga.prototype.proses_bayar = async (req) => {
    try {
        let post = req.body;
        let data = [
            post.bulan,
            post.tahun,
            post.value,
            req.params.id,
            req.session.id_rt
        ]
        let query = await sql.query('INSERT INTO bayar_iuran(bulan_iuran,tahun_iuran,jumlah,id_keluarga,id_rt) VALUES(?)',[data]);
        return query;
    } catch (error) {
        return {error: error};
    }
}

module.exports = new Iuran_warga();