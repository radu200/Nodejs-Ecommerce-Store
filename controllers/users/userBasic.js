
const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const fs  =  require('fs');
const methodOverride = require('method-override');
///user basic
    module.exports.getSignupUserBasic = function(req, res, next) {
        res.render('./account/user-basic/user-basic-signup');
    };
    
 ///sign up
    module.exports.postSignupUserBasic= function(req, res, next) {
        
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        
        
        //validation
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username  is required').notEmpty();
        // req.checkBody('lastname', 'Last Name required').notEmpty();
        req.checkBody('password', 'Password must be between 6-100 characters long.').len(1,100);
        req.checkBody('confirmpassword', 'Passwords do not match').equals(req.body.password);
        
        
        
       let errors = req.validationErrors();
        
        if(errors){
        req.flash('error_msg', errors);
        return res.redirect('/user-basic/signup')
    } 
    
    db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
        if (err) throw err
        if (rows.length ){
            req.flash('error_msg', {msg:'This email is already taken.'});
            res.redirect('/user-basic/signup')
        } else {
            
            // create the user
            bcrypt.hash(password, saltRounds, function(err, hash) {
                db.query('INSERT INTO users (password,email,username, type) VALUES (?,?,?,?)',[hash,email,username,'basic'],function(error, result) {
                    if(error)throw error
                    db.query('SELECT id , type, username FROM users WHERE email = ? ' , [email], function(err,results,fileds){
                        if(error)throw error
                        const user = results[0];
                        req.login( user,function(err){
                            req.flash('success_msg', "Now you are registered  as user basic");
                            res.redirect('/user-basic/dashboard')   
                        });
                    }); 
                }); 
            });
            
        }
    });
};

//get profile with products
module.exports.getProfileUserBasic = function(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  users LEFT JOIN products ON users.id = products.user_id WHERE users.id = ?" ,[userId] ,function(err, result, fields) {
        if (err) throw err;
        res.render('./account/user-basic/profile', {
            "result": result,
            "resultCard":result[0]
        });

    })
   
};

//get dashboard
module.exports.getDashboard = function(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?" ,[userId] ,function(err, results, fields) {
        if (err) throw err;
        res.render('./account/user-basic/dashboard', {
            "results": results[0]
        });

    })
};
//profile edit
module.exports.getSettingsProfile = function(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?" ,[userId] ,function(err, results, fields) {
        if (err) throw err;
        res.render('./account/user-basic/settings/edit-profile', {
            "results": results[0]
        });

    })
};


//profile post
module.exports.postSettingsProfile = function(req, res, next) {
    
    let username = req.body.username;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let about = req.body.about;
    let paypalAccount = req.body.paypalAccount
    let stripeAccount = req.body.stripeAccount
  
    // req.checkBody('username', ' Product username field cannot be empty.').notEmpty();
    // req.checkBody('firstname', 'firstname field cannot be empty.').notEmpty();
    // req.checkBody('firstname', 'firstname field cannot be empty.').notEmpty();
    // req.checkBody('lastaname', 'lastaname field cannot be empty.').notEmpty();
   
    // req.checkBody('avatar', 'Image field cannot be empty.').notEmpty();
  

    if (req.file) {
        var userBasicAvatar= req.file.filename;
    

    } else {
        var userBasicAvatar = false;
        
    }
    let errors = req.validationErrors();
    if (errors) {
        res.render('./account/user-basic/settings/edit-profile', {
            errors: errors,
            username: username,
            first_name:firstname,
            last_name:lastname,
            about: about,
            paypal_account:paypalAccount,
            stripe_account:stripeAccount
        });
    } else {
       let userbasic= {
            username: username,
            first_name:firstname,
            last_name:lastname,
            about: about,
            paypal_account:paypalAccount,
            stripe_account:stripeAccount,
        
        };

        if(userBasicAvatar){
            userbasic.avatar = userBasicAvatar;
        }
        //  console.log('avatar',userbasic.avatar);
          let userId = req.user.id
        
        db.query('UPDATE users SET ? WHERE id = ?',[userbasic,userId], function(err, results) {
            if (err) throw err;
            //when user update profile image remoe the old image
            // db.query('SELECT avatar from users WHERE id = ?',[userId], function(err,results){
        //    if(!results[0].avatar){
            //        fs.unlink('./public/user', function(err){
                //            if(err){
                    //                console.log('there a error to delete avatar image user basic' + err)
                    //            }else{
                        //             console.log('successfully deleted uuser basic image');
                        //            }
                        //        })
                        //    }
                        // })
                        console.log(results.affectedRows + " record(s) updated");
                    })
                    req.flash('success_msg', {msg:'Profile updated'});
                    res.redirect('back');
                }
            };

            
//add product
module.exports.getProductAdd = function(req, res, next) {
    res.render('./account/user-basic/products/add-product-information');
};

//add product
module.exports.postProductAdd = function(req, res, next) {
   
    let title = req.body.title;
    let price = req.body.price;
    let keywords = req.body.keywords;
    let description = req.body.description;
    let productImg = req.body.productImage;
    //restLogo = typeof req.files['rest_logo'] !== "undefined" ? req.files['rest_logo'][0].filename : '';  
    req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    req.checkBody({'price':{ optional: {  options: { checkFalsy: true }},isDecimal: {  errorMessage: 'The product price must be a decimal'} } });
    req.checkBody('keywords', 'Keywords field cannot be empty.').notEmpty();
    // req.checkBody('avatar', 'Image field cannot be empty.').notEmpty();
    //req.checkBody('rest_logo', 'Restaurant Logo - Please upload an image Jpeg, Png or Gif').isImage(restLogo);


    //image
    if (req.file) {
        var productImage = req.file.filename;
        
    } 
    let errors = req.validationErrors();
    if (errors) {    
        res.render('./account/user-basic/products/add-product-information', {
            errors: errors,
            title: title,
            price:price,
            keywords:keywords,
            description: description,
           
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
            image:productImage
        };
        db.query('INSERT INTO products SET ?', productUserBasic, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product added'});
        res.redirect('/user-basic/product/list');
    }
}

// get product list
module.exports.getProductList = function(req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  products WHERE products.user_id = ?" ,[userId] ,function(err, result, fields) {
        if (err) throw err;
        res.render('./account/user-basic/products/product-list', {
            "result": result
           
        });

    })
};


//get product edit
module.exports.getProductEdit = function(req, res, next) {
    console.log('params', req.params.id)
    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function(err, result, fields) {
        if (err) throw err;
        res.render('./account/user-basic/products/edit-product', {
            "result": result[0]
        });
    })
    
};

module.exports.postProducEdit = function(req, res, next){
    let title = req.body.title;
    let price = req.body.price;
    let keywords = req.body.keywords;
    let description = req.body.description;

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
        res.render('./account/user-basic/products/edit-product', {
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
            user_id:userId
        };
        if(productImage){
            productUserBasic.image = productImage;
        }
        db.query(`UPDATE products SET  ? WHERE id =${req.params.id}`, productUserBasic, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product updated'});
        res.redirect('/user-basic/product/list');
    }
}


//delete product
module.exports.deleteProductUserBasic = function(req, res) {
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
    res.redirect('/user-basic/product/list');
};



//reset  password
module.exports.getSettingsPassword = function(req, res, next) {
    res.render('./account/user-basic/settings/edit-password');
};

//reset email
module.exports.getSettingsEmail = function(req, res, next) {
    res.render('./account/user-basic/settings/edit-email');
};





// get product list
module.exports.getProductThumbnails = function(req, res, next) {
    res.render('./account/user-basic/products/product-thumbnails');
};
