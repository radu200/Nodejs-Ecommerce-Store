document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("categories").addEventListener('change', function () {
      document.querySelector('.selected_category').innerHTML = this.querySelector('option[value=' + this.value +
        ']').innerHTML;
    });
  });
 document.getElementById('open-slide').addEventListener('click', function(){
    document.getElementById('side-menu').style.width = '250px';
});


document.getElementById('btn-close').addEventListener('click', function(){
        document.getElementById('side-menu').style.width = '0';

});



