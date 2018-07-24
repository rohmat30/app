var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');

var Laporan = function() {};
Laporan.prototype.buat_laporan = function(data) {
    let data_warga = [];
    let agama = ['Islam','Kristen','Katholik','Hindu','Buddha','Kong Hu Cu'];
    let status_kawin = ['Belum Kawin','Kawin','Cerai Hidup','Cerai Mati'];
    for (const key in data) {
        data_warga[key] = data[key];
        data_warga[key].agama = agama[data[key].agama-1];
        data_warga[key].status_kawin = status_kawin[data[key].status_perkawinan-1];
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
        pdf.font('Times-Roman');
        pdf.fontSize(18).text('Rekap Data penduduk kampung Darungdung',72,96);
        pdf.fontSize(11);
    });
    
    pdf.addPage({
        margin: 72,
        layout: 'landscape',
        size: 'A4'
    });
    table.addBody(data_warga);
    return pdf;
}
module.exports = new Laporan();