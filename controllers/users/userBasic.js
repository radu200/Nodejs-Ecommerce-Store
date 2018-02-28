const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;
   


///user basic
    module.exports.getSignupUserBasic = function(req, res, next) {
        res.render('./account/user-basic/user-basic_signup');
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
        return res.redirect('/signup/user-basic')
    } 
    
    db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
        if (err) throw err
        if (rows.length ){
            req.flash('error_msg', {msg:'This email is already taken.'});
            res.redirect('/signup/user-basic')
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
                            res.redirect('/profile')   
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
    res.render('./account/user-basic/settings/edit-profile');
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
