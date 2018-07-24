var User = function() {};

User.prototype.verifikasiUser = async (value) => {
    return await sql.query('SELECT user.id_user,user.password,rt.id_rt FROM user INNER JOIN keluarga ON user.id_keluarga = keluarga.id_keluarga INNER JOIN rt ON keluarga.id_rt = rt.id_rt WHERE (user.username = ? OR user.nik = ?) AND keluarga.status_tinggal = ? AND keluarga.status_kk IN(1,2) AND user.aktif = ? LIMIT 1',[value,value,'tetap',1]);
};

User.prototype.cekUser = async (value) => {
    return await sql.query('SELECT id_user,nik,nama_lengkap,tempat_lahir,DATE_FORMAT(tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,password,status_perkawinan,id_keluarga FROM user WHERE username = ? OR nik = ? OR id_user = ? LIMIT 1',[value,value,value]);
};

User.prototype.cekAktifUser = async (value) => {
    return await sql.query('SELECT id_user,nik,nama_lengkap,tempat_lahir,DATE_FORMAT(tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,password,status_perkawinan,id_keluarga FROM user WHERE (username = ? OR nik = ? OR id_user = ?) AND aktif = ? LIMIT 1',[value,value,value,1]);
};

User.prototype.cekNonAktifUser = async (value) => {
    return await sql.query('SELECT id_user,nik,nama_lengkap,tempat_lahir,DATE_FORMAT(tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,jenis_kelamin,agama,status_keluarga,level_user,pendidikan,password,status_perkawinan,id_keluarga FROM user WHERE (username = ? OR nik = ? OR id_user = ?) AND aktif = ? LIMIT 1',[value,value,value,0]);
};

User.prototype.cekKK = async (value) => {
    return await sql.query('SELECT id_keluarga,nomor_kk,status_tinggal,alamat,DATE_FORMAT(tanggal_menempati,"%m/%Y") as tanggal_menempati,status_kepemilikan,id_rt FROM keluarga WHERE nomor_kk = ? OR id_keluarga = ? LIMIT 1',[value,value]);
}

User.prototype.daftar_user = async (id_rt) => {
    return await sql.query('SELECT user.id_user,user.nik,user.nama_lengkap,user.tempat_lahir,DATE_FORMAT(user.tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,user.jenis_kelamin,user.agama,user.status_keluarga,user.pendidikan,user.status_perkawinan,user.id_keluarga,user.level_user,keluarga.nomor_kk FROM user INNER JOIN keluarga ON keluarga.id_keluarga = user.id_keluarga WHERE keluarga.id_rt = ? AND user.aktif = ? ORDER BY user.level_user,user.nama_lengkap',[id_rt,1]);
}

User.prototype.pencarian_user = async (id_rt,key) => {
    return await sql.query('SELECT user.id_user,user.nik,user.nama_lengkap,user.tempat_lahir,DATE_FORMAT(user.tanggal_lahir,"%d/%m/%Y") as tanggal_lahir,user.jenis_kelamin,user.agama,user.status_keluarga,user.pendidikan,user.status_perkawinan,user.id_keluarga,user.level_user,keluarga.nomor_kk FROM user INNER JOIN keluarga ON keluarga.id_keluarga = user.id_keluarga WHERE (keluarga.id_rt = ? AND user.aktif = ?) AND (user.nama_lengkap like ? OR user.nik like ?) ORDER BY IF(user.nama_lengkap LIKE ? OR user.nik LIKE ?,1,2),user.level_user,user.nama_lengkap',[id_rt,1,'%'+key+'%','%'+key+'%',key+'%',key+'%']);
}

module.exports = new User();