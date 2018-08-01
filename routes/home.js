var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
  var data = {};
  data.activePage='/home';
  res.view('users',data);
});

router.get('/gender.json',async function(req, res, next){
  try {
    var [user] = await sql.query('SELECT level_user,id_rt FROM user,keluarga WHERE user.id_keluarga = keluarga.id_keluarga AND user.id_user = ?',[req.session.id_user]);
    var query = "SELECT COUNT(CASE WHEN jenis_kelamin = 'L' THEN 1 END) AS laki_laki, COUNT(CASE WHEN jenis_kelamin = 'P' THEN 1 END) AS perempuan FROM v_chart";
    if (user.level_user != 1) {
      query += " WHERE id_rt = "+user.id_rt;
    }
    let [gender] = await sql.query(query);
    let gen = [];
    for (const key in gender) {
      gen.push(gender[key]);
    }
    res.json(gen);
  } catch (error) {
    res.json({error: 'Error'});
  }
});

router.get('/usia.json',async function(req, res, next){
  try {
    var [user] = await sql.query('SELECT level_user,id_rt FROM user,keluarga WHERE user.id_keluarga = keluarga.id_keluarga AND user.id_user = ?',[req.session.id_user]);
    var query = "SELECT COUNT(CASE WHEN usia BETWEEN 0 AND 5 THEN 'balita' END) AS balita,COUNT(CASE WHEN usia BETWEEN 6 AND 11 THEN 'kanak_kanak' END) AS kanak_kanak,COUNT(CASE WHEN usia BETWEEN 12 AND 16 THEN 'remaja_awal' END) AS remaja_awal, COUNT(CASE WHEN usia BETWEEN 17 AND 25 THEN 'remaja_akhir' END) AS remaja_akhir, COUNT(CASE WHEN usia BETWEEN 26 AND 35 THEN 'dewasa_awal' END) AS dewasa_awal, COUNT(CASE WHEN usia BETWEEN 36 AND 45 THEN 'dewasa_akhir' END) AS dewasa_akhir, COUNT(CASE WHEN usia BETWEEN 46 AND 55 THEN 'lansia_awal' END) AS lansia_awal, COUNT(CASE WHEN usia BETWEEN 56 AND 65 THEN 'lansia_akhir' END) AS lansia_akhir, COUNT(CASE WHEN usia > 65 THEN 'manula' END) AS manula FROM v_chart";
    if (user.level_user != 1) {
      query += " WHERE id_rt = "+user.id_rt;
    }
    let [usia] = await sql.query(query);
    let umur = [];
    for (const key in usia) {
      umur.push(usia[key]);
    }
    res.json(umur);
  } catch (error) {
    res.json({error: 'Error'});
  }
});

module.exports = router;
