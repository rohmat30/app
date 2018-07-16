var Kas = function() {}

Kas.prototype.daftar_transaksi = async (req) => {
    let [user] = await User.cekUser(req.session.id_user);
    var id_start;
    
    if (user.level_user == 1) {
        id_start = user.level_user.toString();
    } else {
        id_start = user.level_user.toString()+req.session.id_rt.toString();
    }

    let data  = [],
        saldo = 0;
        
    let sql_data =  await sql.query('SELECT no_transaksi,DATE_FORMAT(tanggal_transaksi,"%d/%m/%Y") as tanggal,kas_masuk,kas_keluar,keterangan FROM v_kas_transaksi WHERE no_transaksi LIKE ? OR no_transaksi LIKE ? ORDER BY tanggal_transaksi ASC',['I'+id_start+'%','O'+id_start+'%']);
    for (const key in sql_data) {
        if (sql_data.hasOwnProperty(key)) {
            const element   = sql_data[key];
            saldo           = saldo + sql_data[key].kas_masuk - sql_data[key].kas_keluar;
            data[key]       = element;
            data[key].saldo = saldo;
        }
    }

    return data;
}

Kas.prototype.validasi_kas_masuk = (req) => {
    req.checkBody({
        jumlah: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Silakan Masukan jumlah Kas Masuk'
            },
            custom: {
                options: (val) => {
                    return parseInt(val) >= 100 && parseInt(val) <= 9999999999;
                },
                errorMessage: 'Jumlah minimal 100'
            }
        },
        keterangan: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Silakan Masukan Keterangan'
            }
        }
    });
    return req.validationErrors();
}

Kas.prototype.kas_masuk = async (req) => {
    let invalid  = Kas.prototype.validasi_kas_masuk(req);    
    let nomor_transaksi_baru = await Kas.prototype.generate_id_kas('I',req);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post           = req.body;
            let data_kas_masuk = [
                nomor_transaksi_baru,
                post.jumlah,
                post.keterangan
            ];
            let sql_kas_masuk = await sql.query('INSERT INTO kas(no_transaksi,jumlah,keterangan) VALUES(?)',[data_kas_masuk]);
            return {success: sql_kas_masuk}
        } catch (error) {
            return {error: error};
        }
    }
}

Kas.prototype.validasi_kas_keluar = (req,max_value) => {
    req.checkBody({
        jumlah: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Silakan Masukan jumlah Kas Masuk'
            },
            custom: {
                options: (val) => {
                    return parseInt(val) >= 1 && parseInt(val) <= max_value;
                },
                errorMessage: 'Jumlah tidak boleh melebihi jumlah maximum '+max_value
            }
        },
        keterangan: {
            isLength: {
                options: {min: 1},
                errorMessage: 'Silakan Masukan Keterangan'
            }
        }
    });
    return req.validationErrors();
}

Kas.prototype.kas_keluar = async (req) => {
    let total                = await Kas.prototype.kas_total(req);
    let invalid              = Kas.prototype.validasi_kas_keluar(req,total);
    let nomor_transaksi_baru = await Kas.prototype.generate_id_kas('O',req);

    if (invalid) {
        return invalid;
    } else {
        try {
            let post            = req.body;
            let data_kas_keluar = [
                nomor_transaksi_baru,
                post.jumlah,
                post.keterangan
            ];
            let sql_kas_keluar = await sql.query('INSERT INTO kas(no_transaksi,jumlah,keterangan) VALUES(?)',[data_kas_keluar]);
            return {success: sql_kas_keluar}
        } catch (error) {
            return {error: error};
        }
    }
}

Kas.prototype.generate_id_kas = async (first_text,req) => {
    let [get_user] = await User.cekUser(req.session.id_user);
    let level_user = get_user.level_user,
        id_rt      = req.session.id_rt,
        tahun      = new Date().getFullYear().toString().substr(2);
    
    // nomor transaksi terakhir
    let nomor_transaksi_start   = first_text+level_user+id_rt+tahun;
    let [{max_nomor_transaksi}] = await sql.query('SELECT max(no_transaksi) as max_nomor_transaksi FROM kas WHERE no_transaksi LIKE ? LIMIT 1',[nomor_transaksi_start+'%'])

    // nomor transaksi baru
    var nomor_transaksi_baru = nomor_transaksi_start + '01';
    if (max_nomor_transaksi != null) {
        let nomor_transaksi_end          = max_nomor_transaksi.substr(5);
        let nomor_transakasi_length      = nomor_transaksi_end.length;
        let nomor_transaksi_baru_end     = (parseInt(nomor_transaksi_end)+1).toString();
        let nomor_transakasi_baru_length = nomor_transaksi_baru_end.length;
        let nomor_transaksi_zerofill     = nomor_transaksi_baru_end.padStart(nomor_transakasi_length-nomor_transakasi_baru_length+1,0);
        
        nomor_transaksi_baru             = nomor_transaksi_start + nomor_transaksi_zerofill;
    }
    return nomor_transaksi_baru;
}

Kas.prototype.kas_total = async (req,kas) => {
    let [user]      = await User.cekUser(req.session.id_user);
    let id_start    = user.level_user.toString()+req.session.id_rt.toString();
    let [trans_in]  = await sql.query('SELECT COALESCE(SUM(jumlah),0) AS total FROM kas WHERE no_transaksi LIKE ? LIMIT 1',['I'+id_start+'%']);
    let [trans_out] = await sql.query('SELECT COALESCE(SUM(jumlah),0) AS total FROM kas WHERE no_transaksi LIKE ? LIMIT 1',['O'+id_start+'%']);
    let total       = 0;
    
    switch (kas) {
        case 'masuk':
            total = trans_in.total;
        break;
        case 'keluar':
            total = trans_out.total;
        break;
        default:
            total = trans_in.total - trans_out.total;
        break;
    }
    return total;
}

module.exports = new Kas();