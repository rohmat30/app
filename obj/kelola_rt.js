var Kelola_rt = function () {}

Kelola_rt.prototype.daftar_rt = async () => {
    return await sql.query('SELECT rt.id_rt,rt.nama_rt,user.nama_lengkap FROM rt INNER JOIN keluarga ON keluarga.id_rt = rt.id_rt INNER JOIN user ON user.id_keluarga = keluarga.id_keluarga WHERE user.level_user = 2');
}


Kelola_rt.prototype.verifikasi_rt = async (id_rt) => {
    return await sql.query('SELECT rt.id_rt,rt.nama_rt,user.nama_lengkap,user.id_user FROM rt INNER JOIN keluarga ON keluarga.id_rt = rt.id_rt INNER JOIN user ON user.id_keluarga = keluarga.id_keluarga WHERE user.level_user = 2 AND rt.id_rt = ?',[id_rt]);
}

Kelola_rt.prototype.ganti_rt = async (req) => {
    let user_warga = await User.cekAktifUser(req.params.id_user);
    let rt = await Kelola_rt.prototype.verifikasi_rt(req.params.id);

    if (rt.length && user_warga.length) {
        rt = rt[0];
        user_warga = user_warga[0];
        
        let user_rt = await User.cekAktifUser(rt.id_user);

        let [cek] = await User.cekKK(user_warga.id_keluarga);

        if (user_rt.length && user_warga.level_user == 3 && cek.id_rt == req.params.id) {
            let rt_ke_warga = await sql.query('UPDATE user SET level_user = 3 WHERE id_user = ?',[rt.id_user]);
            let warga_ke_rt = await sql.query('UPDATE user SET level_user = 2 WHERE id_user = ?',[req.params.id_user]);

            return {success: true}
        } else {
            return {error: 'User tidak terdaftar atau User telah menjadi RT/RW'}
        }
    } else {
        return {error: 'User tidak terdaftar atau telah di nonaktifkan!'}
    }
}

module.exports = new Kelola_rt();