


//file size validation
$("#upload-input-product-file").change(function () {
    let input = this;
    let url = $(this).val();
    let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if ( input.files[0].size > 5e+7) {
        $('.product-file-error').text('Max size should be 50MB')
          return false;

    } else {
       return true;
    }

});


    
///image size validation
$(".profileAvatar").change(function () {
    let input = this;
    let url = $(this).val();
    let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if ( input.files[0].size > 5e+6 ) {
        $('.product-image-error').text('Max size should be 5MB')
          return false;

    } else {
       return true;
    }

});



