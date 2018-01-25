document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("categories").addEventListener('change', function () {
      document.querySelector('.selected_category').innerHTML = this.querySelector('option[value=' + this.value +
        ']').innerHTML;
    });
  });

  window.onload = function(){
    document.getElementById('open-slide').addEventListener('click', openSideMenu);
    document.getElementById('btn-close').addEventListener('click', closeSideMenu)
  }
 function openSideMenu (){
    document.getElementById('side-menu').style.width = '250px';
};


function closeSideMenu(){
  document.getElementById('side-menu').style.width = '0';

};



