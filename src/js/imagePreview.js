$(".avatarInput").change(function () {
    var input = this;
    var url = $(this).val();
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.wrapperAvatar').css('background-image', 'url(' + e.target.result + ')');
            $('.wrapperAvatar').hide();
            $('.wrapperAvatar').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);

    } else {
        $('.product-image-error').text('We only support PNG, GIF, JPEG or JPG pictures.')
        $('.progress-bar-productImage').text('0%');
        $('.progress-bar-productImage').width('0%');
        return false;
    }

});