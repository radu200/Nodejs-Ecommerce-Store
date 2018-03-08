//deleting posts
$(document).ready(function(){
    $('#delete-product').on('click', function(e){
      $target = $(e.target);
      const id = $target.attr('data-id');
      const confirmation = confirm('are you sure ?' );
      if(confirmation){
      $.ajax({
        type:'POST',
        url: '/product/delete/'+id,
        success: function(response){
          window.location.href='/user-basic/product/list';
        },
        complete: function(data){
          window.location.href='/user-basic/product/list'; 
         
           },
        error: function(err){
          console.log(err);
        }
      });
    };
    });
  });


  //deleting posts
$(document).ready(function(){
  $('#delete-productUserBasic').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    const confirmation = confirm('are you sure ?' );
    if(confirmation){
    $.ajax({
      type:'POST',
      url: '/user-basic/product/delete/'+id,
      success: function(response){
        window.location.href='/user-basic/product/list';
      },
      // complete: function(data){
      //   window.location.href='/user-basic/product/list'; 
       
      //    },
      error: function(err){
        console.log(err);
      }
    });
  };
  });
});

