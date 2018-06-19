(function($){
    $('input[name="nomor_nik"]').keyup(function(){
        var text = $(this).val();
        if (!isNaN(text) && text.length >= 16) {
            let ddd = text.substr(6,2);
            let dmm = text.substr(8,2);
            let dyy = text.substr(10,2);
            let cdd = parseInt(ddd);
            let cmm = parseInt(dmm);
            let cyy = parseInt(dyy);
            let now = new Date();
            if (!isNaN(cdd)) {
                if (cdd >= 40) {
                    $('[name="jenis_kelamin"][value="P"]').prop('checked',true);
                    $('[name="jenis_kelamin"][value="L"]').prop('checked',false);
                    $('#tanggal').val(cdd-40);
                } else {
                    $('[name="jenis_kelamin"][value="L"]').prop('checked',true);
                    $('[name="jenis_kelamin"][value="P"]').prop('checked',false);
                    $('#tanggal').val(cdd);
                }
            }
            if (!isNaN(cmm)) {
                $('#bulan option').prop('selected',false);
                $('#bulan option[value="'+cmm+'"]').prop('selected',true);
            }
            if (!isNaN(cyy)) {
                let ayy = (now.getFullYear() - 2000 - cyy);
                $('#tahun').val((ayy<0?'19':(ayy.toString().length==1)?'20':'200')+cyy);
            }
        }
    });
})(jQuery)