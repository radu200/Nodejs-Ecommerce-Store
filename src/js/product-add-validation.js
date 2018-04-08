$('#product-form-upload').on('submit', function () {
    let inputProductImage = $('#upload-input-product-image').val();

    if (inputProductImage === "") {
        $('.product-image-error').text('Please choose an image')
    }
    return false
})

//file
$('#product-form-upload').on('submit', function () {
    let inputProductFile = $('#upload-input-product-file').val();

    if (inputProductFile === "") {
        $('.product-file-error').text('Please choose a file')
    }
    return false
})
//title
$('#product-form-upload').on('submit', function () {
    let title = $('.product-title').val();

    if (title === "") {
        $('.product-title-error').text('Please fill up the title')
    } else if (title.length < 10) {
        $('.product-title-error').text('Title cannot be less than 10 characters')

    } else if (title.length > 150) {
        $('.product-title-error').text('Title cannot be more than 150 characters')
    }
    return false
})

//description
$('#product-form-upload').on('submit', function () {
    let inputProductDescription = $('.product-description').val();

    if (inputProductDescription === "") {
        $('.product-description-error').text('Please fill up description')
    }
    return false
})
//price validation
$('#product-form-upload').on('submit', function () {
    let inputProductPrice = $('.product-price-input').val();
    let decimal = /^[-+]?[0-2]+\.[0-4]+$/;

    if (inputProductPrice === "") {
        $('.product-price-error').text('Please write down the price');

    } else if (!inputProductPrice.match(decimal)) {
        $('.product-price-error').text('Price should be a decimal.example 1.00, 10.00 , 100.00')
    } else if (inputProductPrice.length > 7) {
        $('.product-price-error').text('Price should not more than 1000.00')
    }
    return false
})

$('#product-form-upload').on('submit', function () {
    let inputProductCategory = $('.product-category-all').val();

    if (inputProductCategory === 'all') {
        $('.product-category-error').text('Please choose category.It cannot be all.')
    }
    return false
})