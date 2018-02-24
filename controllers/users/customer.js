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
    return res.redirect('/signup/customer')
} 

db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
    if (err) throw err
    if (rows.length ){
        req.flash('error_msg', {msg:'This email is already taken.'});
        res.redirect('/signup/customer')
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
