
// $('.upload-btn').on('click', function (){
//     $('#upload-input-product-image').click();
//     $('. progress-bar').text('0%');
//     $('. progress-bar').width('0%');
// });

// $('.upload-file-form').on('submit', function(){

//   var files = $(this).get(0).files;

//   if (files.length > 0){
//     // create a FormData object which will be sent as the data payload in the
//     // AJAX request
//     var formData = new FormData();
 
//     // loop through all the selected files and add them to the formData object
//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];

//       // add the files to formData object for the data payload
//       formData.append('productImage', file, file.name);
//     }

//     $.ajax({
//       url: '/upload',
//       type: 'POST',
//       data: formData,
//       processData: false,
//       contentType: false,
//       success: function(data){
//           console.log('upload successful!\n' + data);
//       },
//       xhr: function() {
//         // create an XMLHttpRequest
//         var xhr = new XMLHttpRequest();
        
    
      
//         // listen to the 'progress' event
//         xhr.upload.addEventListener('progress', function(evt) {
  
//           if (evt.lengthComputable) {
//             // calculate the percentage of upload completed
//             var percentComplete = evt.loaded / evt.total;
//             percentComplete = parseInt(percentComplete * 100);

//             // update the Bootstrap progress bar with the new percentage
//             $('.progress-bar').text(percentComplete + '%');
//             $('.progress-bar').width(percentComplete + '%');

//             // once the upload reaches 100%, set the progress bar text to done
//             if (percentComplete === 100) {
//               $('.progress-bar').html('Done');
//             }

//           }

//         }, false);

//         return xhr;
//       }
//     });

//   }

// });


// var formData = new FormData();
// var file = document.getElementById('').files[0];
// formData.append('productImage', file);
// var xhr = new XMLHttpRequest();

// your url upload
// xhr.open('post', '/upload/product/image', true);

// xhr.upload.onprogress = function(e) {
//   if (e.lengthComputable) {
//     var percentage = (e.loaded / e.total) * 100;
//     console.log('procente',percentage + "%");
//   }
// };

// xhr.onerror = function(e) {
//   console.log('Error');
//   console.log(e);
// };
// xhr.onload = function() {
//   console.log(this.statusText);
// };

// xhr.send(formData);

