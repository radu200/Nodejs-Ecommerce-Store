var expressValidator = require('express-validator');
var fs = require('fs');
var multer = require('multer');
 var db = require('../config/database.js');

  

 module.exports.products_stats = function(req, res, next) {
     db.query("SELECT * FROM  products", function(err, results, fields) {
         if (err) throw err;
         res.render('./products/products_stats', {
             "results": results
         });
     })
 };

    //seect from database and display on screen
module.exports.getProducts = function(req, res, next) {
        db.query("SELECT * FROM  products ", function(err, results, fields) {
        if (err) throw err;
        res.render('./products/products', {
            "results": results
        });
    })
};
//display add posts form
module.exports.getPostForm = function(req, res, next) {
    res.render('./products/post_product');
};

module.exports.postProduct = function(req, res, next) {

    var name = req.body.name;
    var description = req.body.description;

    //validation
    req.checkBody('name', 'name field cannot be empty.').notEmpty();
    req.checkBody('description', 'description field cannot be empty.').notEmpty();
    //req.checkBody('avatar', 'please upload product avatar image.').notEmpty();

    if (req.file) {
        var avatarName = req.file.filename;
        console.log(avatarName)

    } else {
        req.flash('error_msg',errors);
    }
    var errors = req.validationErrors();
    if (errors) {
        res.render('post_product', {
            errors: errors,
            name: name,
            description: description
        });
    } else {
        var product = {
            name: name,
            description: description,
            image: avatarName
        };
        db.query('INSERT INTO products SET ?', product, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product added'});
        res.redirect('./products/product_stats');
    }
}

//update post
module.exports.getProductUpdateForm = function(req, res, next) {
    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function(err, result, fields) {
        if (err) throw err;
        res.render('./products/edit_product', {
            "result": result[0]
        });
    })
};

module.exports.editproduct = function(req, res, next) {
    var name = req.body.name;
    var description = req.body.description;
    req.checkBody('name', 'name field cannot be empty.').notEmpty();
    req.checkBody('description', 'description field cannot be empty.').notEmpty();
    
    
    //image
    if (req.file) {
        var avatarName = req.file.filename;
    } else {
        var avatarName = false;
    }
    const errors = req.validationErrors();
    //validation
    if (errors) {
        res.render('index', {
            errors: errors,
            name: name,
            description: description
        });
    } else {
      var product = {
            name: name,
            description: description
        };
        //image: avatarName
        if (avatarName) {
            product.image = avatarName;
        }
        db.query(`UPDATE products SET  ? WHERE id =${req.params.id}`, product, function(err, result) {
            console.log('product updated ')
        })
        req.flash('success_msg', {msg:"Product Updated"});
        res.redirect('./products/product_stats');
    }
};

//delete post
module.exports.deleteProduct = function(req, res) {
    var id = req.params.id;
    db.query(`SELECT * FROM products  WHERE id =${id}`, function(err, result) {
        if (err) throw err;
        if (result[0].image) {
            fs.unlink("./public/images/" + result[0].image, function(err) {
                
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
        }
    })
    db.query(`DELETE FROM products  WHERE id =${id}`, function(err, result) {
        if (err) throw err;
    })

    req.flash('success_msg', {msg:"Product deleted"});
    res.redirect('./products/products_stats');
};
//get single post
module.exports.getProductDetailPage = function(req, res, next) {
    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function(err, rows, fields) {
        if (err) throw err;
        res.render('./products/product_detail', {
            "rows": rows
        });
    })
};

