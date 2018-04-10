//title
$('#product-form-upload').on('submit', function (event) {
    event.stopPropagation();
    let title = $('.product-title').val();
    if (title === "") {
        $('.product-title-error').text('Please fill up the title')
        return false
    } else if (title.length < 3) {
        $('.product-title-error').text('Title cannot be less than 3 characters')
        return false
    } else if (title.length > 100) {
        $('.product-title-error').text('Title cannot be more than 100 characters')
        return false
    } else {
        return true;
    }

})

//description
$('#product-form-upload').on('submit', function (event) {
   // event.stopPropagation();
    let inputProductDescription = $('.product-description').val();
    if (inputProductDescription === "") {
        $('.product-description-error').text('Please fill up description')
        return false;
    }  else if (inputProductDescription.length < 150) {
        $('.product-description-error').text('Title cannot be less than 150 characters')
        return false
    } else if (inputProductDescription.length > 1500) {
        $('.product-description-error').text('Title cannot be more than 1500 characters')
        return false
    } 
    else {
        return true;
    }
})
// //price validation
$('#product-form-upload').on('submit', function (event) {
    event.stopPropagation();
    let inputProductPrice = $('.product-price-input').val();

    if (inputProductPrice === "") {
        $('.product-price-error').text('Please write down the price');
    } else if (inputProductPrice.length > 4) {
        $('.product-price-error').text('Price should not more than 1000');
        return false;
    }else{

        return true;
    }
})
//category
$('#product-form-upload').on('submit', function (event) {
    event.stopPropagation();
    let inputProductCategory = $('.product-category-all').val();

    if (inputProductCategory === 'all') {
        $('.product-category-error').text('Please choose category.It cannot be all.')
        return false
    }else{

        return true;
    }
})




