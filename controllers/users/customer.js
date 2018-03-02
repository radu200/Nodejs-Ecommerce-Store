const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;



//signup login
module.exports.getSignupCustomer = function(req, res, next) {
    res.render('./account/customer/customer_signup');
};

module.exports.postSignupCustomer= function(req, res, next) {
        
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
    return res.redirect('/customer/signup')
} 

db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
    if (err) throw err
    if (rows.length ){
        req.flash('error_msg', {msg:'This email is already taken.'});
        res.redirect('/customer/signup')
    } else {
        
        // create the user
        bcrypt.hash(password, saltRounds, function(err, hash) {
            db.query('INSERT INTO users (password,email,username, type) VALUES (?,?,?,?)',[hash,email,username,'customer'],function(error, result) {
                if(error)throw error
                db.query('SELECT id , type FROM users WHERE email = ? ' , [email], function(err,results,fileds){
                    if(error)throw error
                    const user = results[0];
                    req.login( user,function(err){
                        req.flash('success_msg', "Now you are registered as customer");
                        res.redirect('/profile')   
                    });
                }); 
            }); 
        });
        
    }
});
};


//profile
module.exports.getProfileCustomer = function(req, res, next) {
    res.render('./account/customer/profile');
};

//settings
module.exports.getSettingsCustomer = function(req, res, next) {
    res.render('./account/customer/settings');
};

//settings
module.exports.postSettingsCustomer = function(req, res, next) {

 
    // var title = req.body.title;
    // var price = req.body.price;
    // var keywords = req.body.keywords;
    // var description = req.body.description;

    // req.checkBody('title', ' Product title field cannot be empty.').notEmpty();
    // req.checkBody('description', 'Description field cannot be empty.').notEmpty();
    // req.checkBody('price', 'Price field cannot be empty.').notEmpty();
    // req.checkBody({'price':{ optional: {  options: { checkFalsy: true }},isDecimal: {  errorMessage: 'The product price must be a decimal'} } });
    // req.checkBody('keywords', 'Keywords field cannot be empty.').notEmpty();
    // // req.checkBody('avatar', 'Image field cannot be empty.').notEmpty();
  

    if (req.file) {
        var avatarCustomer = req.file.filename;
        console.log(avatarCustomer)

    } else {
        req.flash('error_msg',errors);
    }
    var errors = req.validationErrors();
    if (errors) {
        res.render('./account/customer/settings', {
            errors: errors,
          
        });
    } else {
        var customer = {
            avatar: avatarCustomer
        };
        db.query('INSERT INTO customer SET ?', customer, function(err, result) {
            console.log('posted')
        })
        req.flash('success_msg', {msg:'Product added'});
        res.redirect('/settings/customer');
    }
};

module.exports.getResetPassword = function(req, res, next) {
    
    res.render('./account/customer/forgot-password')
};

