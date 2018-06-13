var Akun = function() {
};

Akun.prototype.akun = () => {
    return 'asu';
};

Akun.prototype.cekAkun = (value) => {
    return sql.query('SELECT * FROM akun WHERE username = ? OR nik = ?',[value,value]);
};

module.exports = new Akun();