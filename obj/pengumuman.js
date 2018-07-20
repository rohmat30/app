var Pengumuman = function() {}

Pengumuman.prototype.daftar_pengumuman = async (id_rt,share) => {
    let query = 'SELECT * FROM pengumuman';
    if (id_rt != undefined) {
        query += ' WHERE bagikan_kepada = "'+id_rt+'"';
    }
    if (share != undefined) {
        if (share == 'rt') {
            query += ' OR bagikan_kepada = "rt" OR bagikan_kepada = "semua"';
        } else if (share == 'warga') {
            query += ' OR bagikan_kepada = "semua"';
        }
    }
    return await sql.query(query);
}


Pengumuman.prototype.detail_pengumuman = async (id_pengumuman) => {
    let query = 'SELECT * FROM pengumuman WHERE id_pengumuman = ?';
    return await sql.query(query,[id_pengumuman]);
}

Pengumuman.prototype.validasi_pengumuman = (req, level_user) => {
    var validation_form = {
        judul_pengumuman : {
            trim: true,
            isLength: {
                options: {min: 1},
                errorMessage: 'Tidak boleh kosong!'
            }
        },
        isi_pengumuman : {
            trim: true,
            isLength: {
                options: {min: 1},
                errorMessage: 'Tidak boleh kosong!'
            }
        }
    }; 
    if (level_user == 1) {
        validation_form.bagikan_kepada = {
            matches: {
                options: /(semua|rt)$/,
                errorMessage: 'Silakan pilih status kepemilikan'
            }
        };
    }
    req.checkBody(validation_form);
    return req.validationErrors(); 
}

Pengumuman.prototype.buat = async (req) => {
    let [user] = await User.cekAktifUser(req.session.id_user);
    let invalid = Pengumuman.prototype.validasi_pengumuman(req, user.level_user);
    
    if (invalid) {
        return invalid;
    } else {
        try {
            let post = req.body;

            let bagikan = user.level_user == 1 ? post.bagikan_kepada : req.session.id_rt;

            let data_insert = [
                post.judul_pengumuman,
                post.isi_pengumuman,
                bagikan,
                req.session.id_user
            ];

            let sql_insert = await sql.query('INSERT INTO pengumuman(judul_pengumuman,isi_pengumuman,bagikan_kepada,id_user) VALUES(?)',[data_insert]);
            return {success: sql_insert};
        } catch (error) {
            console.log(error);
            return {error: error}
        }
    }
}


module.exports = new Pengumuman();