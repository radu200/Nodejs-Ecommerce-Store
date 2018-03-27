// /**
//  * Upload the photos using ajax request.
//  *
//  * @param formData
//  */
// function uploadFile(formData) {
//     $.ajax({
//         url: '/product/upload_product_image',
//         method: 'post',
//         data: formData,
//         processData: false,
//         contentType: false,
//         xhr: function () {
//             var xhr = new XMLHttpRequest();

//             // Add progress event listener to the upload.
//             xhr.upload.addEventListener('progress', function (event) {
//                 var progressBar = $('.progress-bar');

//                 if (event.lengthComputable) {
//                     var percent = (event.loaded / event.total) * 100;
//                     progressBar.width(percent + '%');
//                     // de pus deodata 50% apoi cand e gata ap' merge urmatorul if
//                     if (percent === 100) {
//                         progressBar.removeClass('active');
//                     }
//                 }
//             });

//             return xhr;
//         }
//     }).done(handleSuccess).fail(function (xhr, status) {
//         alert(status);
//     });
// }

// /**
//  * Handle the upload response data from server and display them.
//  *
//  * @param data
//  */
// function handleSuccess(data) {
//     console.log(data);
//     $("#form_upload_product [name=productImage]").val(data.filename);
// }

// // Set the progress bar to 0 when a file(s) is selected.
// $('input.avatarInput[name=productImage]').on('change', function () {
//     $('.progress-bar').width('0%');
    
//     // Get the files from input, create new FormData.
//     var files = $('#form_upload_product_image input.avatarInput[name=productImage]').get(0).files,
//         formData = new FormData();

//     if (files.length === 0) {
//         alert('Select atleast file to upload.');
//         return false;
//     }

//     if (files.length > 1) {
//         alert('You can only upload one file.');
//         return false;
//     }

//     // Append the files to the formData.
//     formData.append('productImage', files[0], files[0].name);

//     // Note: We are only appending the file inputs to the FormData.
//     uploadFile(formData);
// });