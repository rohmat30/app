var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res) {
  var data = {};
  data.activePage='/home';
  let [kelompok_usia] = await sql.query("SELECT COUNT(CASE WHEN usia BETWEEN 0 AND 5 THEN 'balita' END) AS balita,COUNT(CASE WHEN usia BETWEEN 6 AND 11 THEN 'kanak_kanak' END) AS kanak_kanak,COUNT(CASE WHEN usia BETWEEN 12 AND 16 THEN 'remaja_awal' END) AS remaja_awal, COUNT(CASE WHEN usia BETWEEN 17 AND 25 THEN 'remaja_akhir' END) AS remaja_akhir, COUNT(CASE WHEN usia BETWEEN 26 AND 35 THEN 'dewasa_awal' END) AS dewasa_awal, COUNT(CASE WHEN usia BETWEEN 36 AND 45 THEN 'dewasa_akhir' END) AS dewasa_akhir, COUNT(CASE WHEN usia BETWEEN 46 AND 55 THEN 'lansia_awal' END) AS lansia_awal, COUNT(CASE WHEN usia BETWEEN 56 AND 65 THEN 'lansia_akhir' END) AS lansia_akhir, COUNT(CASE WHEN usia > 65 THEN 'manula' END) AS manula FROM v_chart LIMIT 1") || {};
  let [gender] = await sql.query("SELECT COUNT(CASE WHEN jenis_kelamin = 'L' THEN 1 END) AS laki_laki, COUNT(CASE WHEN jenis_kelamin = 'P' THEN 1 END) AS perempuan FROM v_chart") || {};
  data.kelompok_usia = [];
  data.gender = [];
  for (const key in kelompok_usia) {
    data.kelompok_usia.push(kelompok_usia[key]);
  }
  for (const key in gender) {
    data.gender.push(gender[key]);
  }

  console.log(data.gender);
  res.view('users',data);
});

module.exports = router;
