const db = require('../../config/database.js');
const fs = require('fs');
const methodOverride = require('method-override');
const util = require('util');
//add product

const path = require('path')



module.exports.getProductAdd = function (req, res, next) {
    let Todaydate = Date.now()
    db.query(`SELECT users.id,users.membership_aproved_date, users.type, products.id  as productID, products.user_id FROM users  LEFT JOIN products ON  users.id = products.user_id WHERE users.id =${req.user.id}`, function (err, rows) {
        let productID = rows.map((product) => {
            return product.productID;
        })
        if (err) {
            console.log('[mysql]', err)
        } else if (rows[0].type === 'basic' && productID.length > 2) {
            req.flash('info_msg', {
                msg: 'You cannot upload more than 1 products'
            })
            res.redirect('/dashboard')
        } else if (rows[0].type === 'basic' && productID.length <= 2) {
            res.render('./products/add-product-information', {});
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date < Todaydate) {
            res.render('./pages/membershipExpired')

        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date > Todaydate && productID.length > 2) {
            req.flash('info_msg', {
                msg: 'You cannot upload more than 100 products'
            })
            res.redirect('/dashboard')
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date > Todaydate && productID.length <= 2) {
            res.render('./products/add-product-information', {});
        } else {
            res.redirect('/login')
        }



    })

};



//add product
module.exports.postProductAdd = function (req, res, next) {


    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.description;
    let category = req.body.category;


    req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    req.checkBody({'price':{ optional: {  options: { checkFalsy: true }},isDecimal: {  errorMessage: 'The product price must be a decimal'} } });





    let errors = req.validationErrors();
    if (errors) {
        res.render('./products/add-product-information', {
            errors: errors,
            title: title,
            price: price,
            description: description,
            category_name: category

        });
    } else {
        let userId = req.user.id

        let product = {
            title: title,
            price: price,
            description: description,
            user_id: userId,
            category_name: category,
            product_status: 'unverified'
        };
     
            db.query('INSERT INTO products SET ? ', product, function (err, result) {
                console.log('posted')
               
            })
             req.flash('success_msg', {
                    msg: 'Product added'
                });
                
                res.render('./products/add-file')
       
    }
}


module.exports.uploadProductImage = (req, res, next) => {

    if (req.file) {
        var productImage = req.file.filename;
    }


    let imageName = {
        stage1: 'imageApproved',
        image: productImage,
        user_id: req.user.id
    };

    db.query('SELECT LAST_INSERT_ID()  as product_id ', function (err, result, fields) {
        console.log('id', result[0].product_id)
        let product_id = result[0].product_id
        db.query('UPDATE products SET ? WHERE id = ? ',[ imageName, product_id], function (err, result) {
            console.log('posted')

        })

    })

}

module.exports.uploadProductFile = (req, res, next) => {

if (req.file) {
    var productFile = req.file.filename;
    console.log(productFile)
}


let ProductFile = {
    stage2: 'fileApproved',
    product_file: productFile

};

db.query('SELECT LAST_INSERT_ID()  as product_id ', function (err, result, fields) {
    console.log('id', result[0].product_id)
    let product_id = result[0].product_id
 db.query('UPDATE products SET ? WHERE id = ? ', [ProductFile, product_id], function (err, result) {
    console.log('posted')

  })

  })
}




module.exports.getProductList = function (req, res, next) {

    let Todaydate = Date.now()
    db.query(`SELECT membership_aproved_date , type FROM users WHERE id =${req.user.id}`, function (err, rows) {
        if (rows[0].type === 'basic') {
            ProductListPageSeller(req, res, next);
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date < Todaydate) {
            res.render('./pages/membershipExpired')
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date > Todaydate) {
            ProductListPageSeller(req, res, next);
        } else {
            res.redirect('/login')
        }
    })


};


function ProductListPageSeller(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  products WHERE products.user_id = ?", [userId], function (err, result, fields) {
        if (err) throw err;
        let products = [];

        for (let i = 0; i < result.length; i++) {
            products.push(result[i])

        }

        res.render('./products/product-list', {
            "result": products

        });
    })
}


//get product edit
module.exports.getProductEdit = function (req, res, next) {
    let Todaydate = Date.now()
    db.query(`SELECT membership_aproved_date , type FROM users WHERE id =${req.user.id}`, function (err, rows) {
        if (rows[0].type === 'basic') {
            productEditPage(req, res, next);
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date < Todaydate) {
            res.render('./pages/membershipExpired')
        } else if (rows[0].type === 'pro' && rows[0].membership_aproved_date > Todaydate) {
            productEditPage(req, res, next)
        } else {
            res.redirect('/login')
        }
    })

};



function productEditPage(req, res, next) {

    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function (err, result, fields) {
        if (err) throw err;
        res.render('./products/edit-product', {
            "result": result[0],
        });
    })
}



module.exports.postProducEditImage = function (req,res,next){

}
module.exports.postProducEdit = function (req, res, next) {
    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.description;
    let category = req.body.category;

    req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    req.checkBody({
        'price': {
            optional: {
                options: {
                    checkFalsy: true
                }
            },
            isDecimal: {
                errorMessage: 'The product price must be a decimal'
            }
        }
    });


    if (req.file) {
        var productImage = req.file.filename;


    } else {
        var productImage = false;

    }

    let errors = req.validationErrors();
    if (errors) {
        res.render('./products/edit-product', {
            errors: errors,
            title: title,
            price: price,
            description: description
        });
    } else {
        let userId = req.user.id
        let product = {
            title: title,
            price: price,
            description: description,
            user_id: userId,
            category_name: category,
            product_status: 'unverified'
        };
        if (productImage) {
            product.image = productImage;
        }
        db.query(`UPDATE products SET  ? WHERE id =${req.params.id}`, product, function (err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {
            msg: 'Product updated'
        });
        res.redirect('/product/list');
    }
}


//delete product
module.exports.deleteProductUser = function (req, res, next) {
    let id = req.params.id;
    db.query(`SELECT * FROM products  WHERE id =${id}`, function (err, result) {
        if (err) throw err;
        // if (result[0].image) {
        //     fs.unlink("./public/userFiles/products/images/" + result[0].image, function(err) {

        //         if (err) {
        //             console.log("failed to delete local image:" + err);
        //         } else {
        //             console.log('successfully deleted local image');
        //         }
        //     });

        db.query(`DELETE FROM products  WHERE id =${id}`, function (err, result) {
            if (err) throw err;

        })
    })

    req.flash('success_msg', {
        msg: "Product deleted"
    });
    res.redirect('back');
};

//get product details page
module.exports.getProductDetailPage = function (req, res, next) {
    db.query(`SELECT products.* , users.id as userId , users.username FROM  products LEFT JOIN users ON products.user_id = users.id WHERE products.id=${req.params.id}`, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)

        if (!rows.length) {

            res.render('./pages/no-products')
        } else {

            res.render('./products/product_detail', {
                "rows": rows[0],
            });
        }
    })
};