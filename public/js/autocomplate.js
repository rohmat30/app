(function($){
    $('input[name="nik"]').keyup(function(){
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
    $('.form-control').focusin(function(){
        if ($(this).hasClass('is-invalid')) {
            $(this).parent().parent().prev('label').addClass('text-danger').removeClass('text-secondary');
            $(this).prev('label').addClass('text-danger').removeClass('text-secondary');
        } else {
            $(this).parent().parent().prev('label').addClass('text-primary').removeClass('text-secondary');
            $(this).prev('label').addClass('text-primary').removeClass('text-secondary');
        }
    });
    
    $('.form-control').focusout(function(){
        if ($(this).hasClass('is-invalid')) {
            $(this).parent().parent().prev('label').removeClass('text-danger').addClass('text-secondary');
            $(this).prev('label').removeClass('text-danger').addClass('text-secondary');
        } else {
            $(this).parent().parent().prev('label').removeClass('text-primary').addClass('text-secondary');
            $(this).prev('label').removeClass('text-primary').addClass('text-secondary');
        }
    });

    $('a[data-toggle="show-detail"]').click(function(e){
        e.preventDefault();
        let el = $(this).attr('href');
        if ($(el).is(':visible')) {
            $(el).slideUp(150);
            $(this).find('i').addClass('mif-expand-more').removeClass('mif-expand-less');
        } else {
            $(el).slideDown(150);
            $(this).find('i').addClass('mif-expand-less').removeClass('mif-expand-more');
        }
        // $(el).slideToggle(150);
    });

    $('[data-toggle="modal"]').click(function(){
        $($(this).attr('href')+' .remove-link').attr('href',$(this).attr('data-link'));
        $($(this).attr('href')+' .text-data').text($(this).attr('data-text'));
        $($(this).attr('href')+' .value-data').val($(this).attr('data-value'));
    });
})(jQuery)