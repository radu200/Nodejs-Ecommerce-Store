$("#upload-input-product-file").change(function () {
    var input = this;
    var url = $(this).val();
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (ext == "zip" || ext == "rar" || ext == "tar" || ext == "7z")) {
       return true;

    } else {
        $('.progress-bar-file').text('0%');
        $('.progress-bar-file').width('0%');
        $('.product-file-error').text('Please upload folder in format .zip, rar, 7z,tar .')
        return false;
    }

});