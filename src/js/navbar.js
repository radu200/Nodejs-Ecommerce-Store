
   let openSide = document.getElementById('open-slide');
   if(openSide !== null){

   openSide.addEventListener('click',  function openSideMenu (){
    document.getElementById('side-menu').style.width = '250px';
    
});
   }
    let closeSide = document.getElementById('btn-close');
    if(closeSide !== null){

      closeSide.addEventListener('click',function closeSideMenu(){
        document.getElementById('side-menu').style.width = '0';
        
      })
      
    }
    
 
      
    $('.navbar-toggle').click(function () {
      $('.navbar-nav').toggleClass('slide-in');
      $('.side-body').toggleClass('body-slide-in');
      $('#search').removeClass('in').addClass('collapse').slideUp(200);

      /// uncomment code for absolute positioning tweek see top comment in css
      //$('.absolute-wrapper').toggleClass('slide-in');
      
  });
 
 // Remove menu for searching
 $('#search-trigger').click(function () {
      $('.navbar-nav').removeClass('slide-in');
      $('.side-body').removeClass('body-slide-in');

      /// uncomment code for absolute positioning tweek see top comment in css
      //$('.absolute-wrapper').removeClass('slide-in');

  });

///toolpit
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});