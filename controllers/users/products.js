const db = require('../../config/database.js');
const fs  =  require('fs');
const methodOverride = require('method-override');
            
//add product
module.exports.getProductAdd = function(req, res, next) {
    res.render('./products/add-product-information');
};

//add product
module.exports.postProductAdd = function(req, res, next) {
    let title = req.body.title;
    let price = req.body.price;
    let keywords = req.body.keywords;
    let description = req.body.description;
    let category = req.body.category;

    
    req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    req.checkBody({'price':{ optional: {  options: { checkFalsy: true }},isDecimal: {  errorMessage: 'The product price must be a decimal'} } });
    req.checkBody('keywords', 'Keywords field cannot be empty.').notEmpty();



    //image
    if (req.file) {
        var productImage = req.file.filename;
        
    } 
    let errors = req.validationErrors();
    if (errors) {    
        res.render('./products/add-product-information', {
            errors: errors,
            title: title,
            price:price,
            keywords:keywords,
            description: description,
            category_name:category
           
        });
    } else {
     //user id from session
     let userId = req.user.id

       let product = {
            title: title,
            price:price,
            keywords:keywords,
            description: description,
            user_id:userId,
            image:productImage,
            category_name:category
        };
        db.query('INSERT INTO products SET ?', product, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product added'});
        res.redirect('/product/list');
    }
}

// get product list
module.exports.getProductList = function(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  products WHERE products.user_id = ?" ,[userId] ,function(err, result, fields) {
        if (err) throw err;
        res.render('./products/product-list', {
            "result": result
           
        });

    })
};


//get product edit
module.exports.getProductEdit = function(req, res, next) {
    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function(err, result, fields) {
        if (err) throw err;
        res.render('./products/edit-product', {
            "result": result[0]
        });
    })
    
};

module.exports.postProducEdit = function(req, res, next){
    let title = req.body.title;
    let price = req.body.price;
    let keywords = req.body.keywords;
    let description = req.body.description;
    let category = req.body.category;

    req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    req.checkBody({'price':{ optional: {  options: { checkFalsy: true }},isDecimal: {  errorMessage: 'The product price must be a decimal'} } });
    req.checkBody('keywords', 'Keywords field cannot be empty.').notEmpty();
    // req.checkBody('avatar', 'Image field cannot be empty.').notEmpty();
  


    if (req.file) {
        var productImage = req.file.filename;
       console.log('image',productImage);

    } else {
        var productImage = false;
        
    }
   
    let errors = req.validationErrors();
    if (errors) {
        res.render('./products/edit-product', {
            errors: errors,
            title: title,
            price:price,
            keywords:keywords,
            description: description
        });
    } else {
     //user id from session
     let userId = req.user.id
       let productUserBasic = {
            title: title,
            price:price,
            keywords:keywords,
            description: description,
            user_id:userId,
            category_name:category
        };
        if(productImage){
            productUserBasic.image = productImage;
        }
        db.query(`UPDATE products SET  ? WHERE id =${req.params.id}`, productUserBasic, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product updated'});
        res.redirect('/product/list');
    }
}


//delete product
module.exports.deleteProductUser = function(req, res) {
    let id = req.params.id;
    db.query(`SELECT * FROM products  WHERE id =${id}`, function(err, result) {
        if (err) throw err;
        if (result[0].image) {
            fs.unlink("./public/userFiles/products/images/" + result[0].image, function(err) {
                
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
        }
        db.query(`DELETE FROM products  WHERE id =${id}`, function(err, result) {
            if (err) throw err;
            
        })
    })

    req.flash('success_msg', {msg:"Product deleted"});
    res.redirect('/product/list');
};

//get product details page
module.exports.getProductDetailPage = function(req, res, next) {
    db.query(`SELECT products.* FROM  products  WHERE products.id=${req.params.id}`, function(err, rows, fields) {
        if (err) throw err;
        console.log(rows)

        if (!rows.length) {
           
            res.render('./pages/no-products')
        }else{

            res.render('./products/product_detail', {
                "rows": rows[0]
            });
        }
    })
};

