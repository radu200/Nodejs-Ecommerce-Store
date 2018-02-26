function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#productPreviewImage').attr('src', e.target.result);
  
        $('#productPreviewImage').hide();
        $('#productPreviewImage').fadeIn(250);
  
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#avatarInput").change(function() {
    readURL(this);
  });