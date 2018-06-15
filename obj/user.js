var User = function() {
};

User.prototype.cekUser = (value) => {
    return sql.query('SELECT id_user,password FROM user WHERE username = ? OR nik = ? OR id_user = ? LIMIT 1',[value,value,value]);
};

module.exports = new User();