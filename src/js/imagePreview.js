function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#UserbasicPreviewImage').attr('src', e.target.result);
  
        $('#UserbasicPreviewImage').hide();
        $('#UserbasicPreviewImage').fadeIn(250);
  
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#avatarInput").change(function() {
    readURL(this);
  });


  //profile user basic preview image
  function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#UserbasicPreviewImage').attr('src', e.target.result);
  
        $('#UserbasicPreviewImage').hide();
        $('#UserbasicPreviewImage').fadeIn(250);
  
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#avatarUserBasic").change(function() {
    readURL(this);
  });