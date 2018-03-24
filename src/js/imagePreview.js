

//profile preview image
function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('.avatarImage').attr('src', e.target.result);

      $('.avatarImage').hide();
      $('.avatarImage').fadeIn(250);

    }

    reader.readAsDataURL(input.files[0]);
  }
}


$(".avatarInput").change(function () {
  readURL(this);
});

