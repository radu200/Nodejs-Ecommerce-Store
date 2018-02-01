
 jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
 jQuery('.quantity').each(function() {
   var spinner = jQuery(this),
     input = spinner.find('input[type="number"]'),
     btnUp = spinner.find('.quantity-up'),
     btnDown = spinner.find('.quantity-down'),
     min = input.attr('min'),
     max = input.attr('max');

   btnUp.click(function() {
     var oldValue = parseFloat(input.val());
     if (oldValue >= max) {
       var newVal = oldValue;
     } else {
       var newVal = oldValue + 1;
     }
     spinner.find("input").val(newVal);
     spinner.find("input").trigger("change");
   });

   btnDown.click(function() {
     var oldValue = parseFloat(input.val());
     if (oldValue <= min) {
       var newVal = oldValue;
     } else {
       var newVal = oldValue - 1;
     }
     spinner.find("input").val(newVal);
     spinner.find("input").trigger("change");
   });

 });
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




