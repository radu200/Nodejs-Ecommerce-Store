const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;
const bodyParser = require('body-parser');


///user basic
    module.exports.getSignupUserBasic = function(req, res, next) {
        res.render('./account/user-basic/user-basic-signup');
    };
    
 
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
        
        
        
        const errors = req.validationErrors();
        
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
                    db.query('SELECT id , type FROM users WHERE email = ? ' , [email], function(err,results,fileds){
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
    res.render('./account/user-basic/profile');
};

//get dashboard
module.exports.getDashboard = function(req, res, next) {
    res.render('./account/user-basic/dashboard');
};
//profile edit
module.exports.getSettingsProfile = function(req, res, next) {
    var userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?" ,[userId] ,function(err, results, fields) {
        if (err) throw err;
        res.render('./account/user-basic/settings/edit-profile', {
            "results": results[0]
        });

    })
};

//profile post
module.exports.postSettingsProfile = function(req, res, next) {
    
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var about = req.body.about;
    var paypalAccount = req.body.paypalAccount
    var stripeAccount = req.body.stripeAccount
  
    // req.checkBody('username', ' Product username field cannot be empty.').notEmpty();
    // req.checkBody('firstname', 'firstname field cannot be empty.').notEmpty();
    // req.checkBody('firstname', 'firstname field cannot be empty.').notEmpty();
    // req.checkBody('lastaname', 'lastaname field cannot be empty.').notEmpty();
   
    // req.checkBody('avatar', 'Image field cannot be empty.').notEmpty();
  

    if (req.file) {
        var userBasicAvatar= req.file.filename;
        console.log(userBasicAvatar)

    } else {
       // var userBasicAvatar = noimage.png
        req.flash('error_msg',{msg:'We only support PNG, GIF, or JPG pictures. '});
    }
    var errors = req.validationErrors();
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
        var userbasic= {
            username: username,
            first_name:firstname,
            last_name:lastname,
            about: about,
            paypal_account:paypalAccount,
            stripe_account:stripeAccount,
            avatar: userBasicAvatar
        };
         console.log(userbasic);
          var userId = req.user.id
          console.log('userid',userId);
        db.query('UPDATE users SET ? WHERE id = ?',[userbasic,userId], function(err, results) {
            if (err) throw err;
            console.log('posted')
            console.log(results.affectedRows + " record(s) updated");
        })
        req.flash('success_msg', {msg:'Profile updated'});
        res.redirect('back');
    }
};
//reset  password
module.exports.getSettingsPassword = function(req, res, next) {
    res.render('./account/user-basic/settings/edit-password');
};

//reset email
module.exports.getSettingsEmail = function(req, res, next) {
    res.render('./account/user-basic/settings/edit-email');
};



//add product
module.exports.getProductAdd = function(req, res, next) {
    res.render('./account/user-basic/products/add-product-information');
};
//get product edit
module.exports.getProductEdit = function(req, res, next) {
    res.render('./account/user-basic/products/edit-product');
};

// get product list
module.exports.getProductList = function(req, res, next) {
    res.render('./account/user-basic/products/product-list');
};

// get product list
module.exports.getProductThumbnails = function(req, res, next) {
    res.render('./account/user-basic/products/product-thumbnails');
};
