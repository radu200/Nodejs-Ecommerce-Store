$(document).ready(function () {
    $('.product-thumbnail').each(function () {

        if($(this).attr('src')==="")
        {
            $(this).css({display: "none"});
        }

    });
  


});