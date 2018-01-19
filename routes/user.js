var express = require('express');
var db = require('../db.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;

//Login required middleware
 module.exports.ensureAuthenticated = function  (req, res, next) {  
        if (req.isAuthenticated()) {
            next();
        }else{

            res.redirect('/login')
        }

};
module.exports.profile = function(req, res, next) {
    res.render('./account/userProfile', {
        title: 'profilepage'
    });
};
module.exports.getLogin = function(req, res, next) {
    res.render('./account/login');
};
 module.exports.postLogin = function(req,res,next){
  
 };
 
 
 module.exports.getLogout = function(req,res,next){
   req.logout();
   req.session.destroy();
   res.redirect('/login');
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
            bcrypt.hash(password, saltRounds, function(err, hash) {
                db.query('INSERT INTO users (password,email,first_name,last_name) VALUES (?,?,?,?)',[hash,email,firstname,lastname],function(error, result) {
                     if(error)throw error
                      db.query('SELECT LAST_INSERT_ID() as user_id', function(err,results,fileds){
                        if(error)throw error
                       
                         const user_id = results[0];
                         console.log(results[0]);
                         req.login( user_id,function(err){
                          res.redirect('/profile')   
                        });
                       }); 
                  }); 
              });

            // req.flash('success_msg', "Now you are registered");
            // res.redirect('/login');
        };       
                
    };
    
    passport.serializeUser(function(user_id, done) {
    done(null, user_id);
    });
    
    passport.deserializeUser(function(user_id, done) {
        done(null, user_id);
    
    });