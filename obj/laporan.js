var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');

var Laporan = function() {};
Laporan.prototype.buat_laporan = function(data, id_rt) {
    let data_warga = [];
    let agama = ['Islam','Kristen','Katholik','Hindu','Buddha','Kong Hu Cu'];
    let status_kawin = ['Belum Kawin','Kawin','Cerai Hidup','Cerai Mati'];
    for (const key in data) {
        data_warga[key] = data[key];
        data_warga[key].agama = agama[data[key].agama-1];
        data_warga[key].status_kawin = status_kawin[data[key].status_perkawinan-1];
        data_warga[key].no = parseInt(key) + 1;
    }
    var pdf = new PdfDocument({
        autoFirstPage: false,
        layout: 'landscape',
        size: 'A4'
    }),
    table = new PdfTable(pdf, {
        bottomMargin: 3
    });
    table
    .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
        column: 'nama_lengkap'
    }))
    .setColumnsDefaults({
        headerBorder: ['L','B','T','R'],
        border: ['L','B','T','R'],
        padding: [5,5,0,5],
        headerPadding: [5,5,0,5]            
    })
    .addColumns([
        {
            id: 'no',
            header: 'No',
            width: 30
        },
        {
            id: 'nik',
            header: 'NIK',
            width: 105
        },
        {
            id: 'nomor_kk',
            header: 'Nomor KK',
            width: 105
        },
        {
            id: 'nama_lengkap',
            header: 'Nama Lengkap',
        },
        {
            id: 'tempat_lahir',
            header: 'Tempat Lahir',
            width: 80
        },
        {
            id: 'tanggal_lahir',
            header: 'Tanggal Lahir',
            width: 80
        },
        {
            id: 'jenis_kelamin',
            header: 'JK',
            width: 30
        },
        {
            id: 'agama',
            header: 'Agama',
            width: 60
        },
        {
            id: 'status_kawin',
            header: 'Status',
            width: 75
        }
    ])
    .onPageAdded(function(tb){
        tb.addHeader();
    });
    
    pdf.on('pageAdded',() =>{
        pdf.font('Times-Bold').fontSize(16).text('PENGURUS KAMPUNG DARUNGDUNG RT0'+id_rt+' RW02\nDESA GUDANG KEC. CIKALONGKULON\nKABUPATEN CIANJUR',{align: 'center', dpi: 400});
        pdf.image('public/img/logo-cianjur.png',48,32,{fit: [52,52]});
        pdf.moveTo(32,92).lineTo(810,92);
        pdf.font('Times-Bold').fontSize(14).text('LAPORAN DATA PENDUDUK',90, 100, {align: 'center', dpi: 400});
        pdf.font('Times-Roman');
        pdf.fontSize(11);
    });
    
    pdf.addPage({
        margin: 32,
        layout: 'landscape',
        size: 'A4'
    });
    table.addBody(data_warga);
    return pdf;
}
module.exports = new Laporan();