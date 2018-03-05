


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
 

   


  



