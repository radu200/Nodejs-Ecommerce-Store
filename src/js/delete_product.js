//deleting posts
$(document).ready(function(){
    $('.delete-product').on('click', function(e){
      $target = $(e.target);
      const id = $target.attr('data-id');
      const confirmation = confirm('are you sure');
      if(confirmation){
      $.ajax({
        type:'POST',
        url: '/product/delete/'+id,
        success: function(response){
         // alert('Deleting Posts');
          window.location.href='/admin';
        },
        // complete: function(data){
        //     window.location.href='/admin'; 

        //    },
        error: function(err){
          console.log(err);
        }
      });
    };
    });
  });


  