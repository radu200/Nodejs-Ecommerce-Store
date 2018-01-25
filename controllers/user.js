var express = require('express');
var db = require('../config/database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
var LocalStrategy   = require('passport-local').Strategy;

//Login required middleware
module.exports.ensureAuthenticated = function  (req, res, next) {  
    if (req.isAuthenticated()) {
        next();
    }else{
        
        res.redirect('/login')
    }
    
};
module.exports.getLogin = function(req, res, next) {
    res.render('./account/login');
};
module.exports.postLogin = function(req,res,next){
 
    
    const usernamel = req.body.username;
    const password = req.body.password;
    //validation login
    req.checkBody('username', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
   
    const errors = req.validationErrors();

    if(errors){
        req.flash('error_msg', errors);
        return res.redirect('./login')
         } else{
             passport.authenticate('local', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            })(req,res);       

         }
     
};
module.exports.getLogout = function(req,res,next){
    req.logout();
    req.session = null;
    res.redirect('/login');
};
module.exports.getProfile = function(req, res, next) {
    res.render('./account/userProfile', {
        title: 'profilepage'
    });
};

 module.exports.getSignup = function(req, res, next) {
     res.render('./account/signup');
    };
    module.exports.postSignup = function(req, res, next) {
      
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
        req.flash('error_msg', errors);
        res.redirect('./signup')
         } 
       else {
            db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err) throw err
                if (rows.length ){
                    req.flash('error_msg', {msg:'This email is already taken.'});
                    res.redirect('./signup')
                } else {
                    // if there is no user with that email
                    // create the user
            bcrypt.hash(password, saltRounds, function(err, hash) {
                db.query('INSERT INTO users (password,email,first_name,last_name) VALUES (?,?,?,?)',[hash,email,firstname,lastname],function(error, result) {
                     if(error)throw error
                      db.query('SELECT LAST_INSERT_ID() as user_id', function(err,results,fileds){
                        if(error)throw error
                         const user_id = results[0];
                         req.login( user_id,function(err){
                         req.flash('success_msg', "Now you are registered");
                          res.redirect('/profile')   
                        });
                       }); 
                  }); 
              });

            }
        });
    };
           
      
    };
  
     