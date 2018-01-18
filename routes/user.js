var express = require('express');
var db = require('../db.js');
var expressValidator = require('express-validator');


module.exports.user = function(req, res, next) {
    res.render('user', {
        title: 'home'
    });
};
module.exports.login = function(req, res, next) {
    res.render('./account/login');
 };
 
 module.exports.signup = function(req, res, next) {
    res.render('./account/signup');
};
module.exports.signuppost = function(req, res, next) {
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    
    //validation
    req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('firstname', 'First Name  required').notEmpty();
    req.checkBody('lastname', 'Last Name required').notEmpty();
    req.checkBody('password', 'Password must be between 6-100 characters long.').len(6,100);
    req.checkBody('confirmpassword', 'Passwords do not match').equals(req.body.password);
    
    
    const errors = req.validationErrors();
    
        if(errors){
                res.render('./account/signup',{
            	  errors:errors
            		});
        } else {
            db.query('INSERT INTO users (password,email,first_name,last_name) VALUES (?,?,?,?)',[password,email,firstname,lastname],function(err, result) {
                 if(err)throw err
                    
            }); 

            req.flash('success_msg', "Now you are registered");
            res.redirect('/login');;
        };       
                
    };