var express = require('express');
var db = require('../config/database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
var LocalStrategy   = require('passport-local').Strategy;
const request = require('request');

//Login required middleware
module.exports.ensureAuthenticated = function  (req, res, next) {  
    if (req.isAuthenticated()) {
        next();
    }else{
        
        res.redirect('/login')
    }
    
};
module.exports.getLogin = function(req, res, next) {
    res.render('./account/login',);
};
module.exports.postLogin = function(req,res,next){
    //validation login
    req.checkBody('username','Email is not valid').isEmail();
    req.checkBody('password', 'Password cannot be blank').notEmpty();
   
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
        req.logout()
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            res.redirect('/login')
        })
    };
    
    module.exports.getSignup = function(req, res, next) {
        res.render('./account/signup');
    };
    
    
    module.exports.postSignup = function(req, res, next) {
        
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const user_type = req.body.user_type;
        
        //validation
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username  is required').notEmpty();
        // req.checkBody('lastname', 'Last Name required').notEmpty();
        req.checkBody('password', 'Password must be between 6-100 characters long.').len(1,100);
        req.checkBody('confirmpassword', 'Passwords do not match').equals(req.body.password);
        
        
        
        const errors = req.validationErrors();
        
        if(errors){
        req.flash('error_msg', errors);
        return res.redirect('./signup')
    } 
    
    db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
        if (err) throw err
        if (rows.length ){
            req.flash('error_msg', {msg:'This email is already taken.'});
            res.redirect('./signup')
        } else {
            
            // create the user
            bcrypt.hash(password, saltRounds, function(err, hash) {
                db.query('INSERT INTO users (password,email,username, type) VALUES (?,?,?,?)',[hash,email,username,user_type],function(error, result) {
                    if(error)throw error
                    db.query('SELECT id , type FROM users WHERE email = ? ' , [email], function(err,results,fileds){
                        if(error)throw error
                        const user = results[0];
                        req.login( user,function(err){
                            req.flash('success_msg', "Now you are registered");
                            res.redirect('/profile')   
                        });
                    }); 
                }); 
            });
            
        }
    });
};



module.exports.getProfile = function(req, res, next) {
    console.log('profile', req.user);
    res.render('./account/userProfile', {
        title: 'profilepage'
 });
};



/// middleware for user access controll
module.exports.userBasic = function (req,res,next){
    if(req.user.type === 'basic'){
        return next();
    }else{
        res.redirect('/login')
    }
}

module.exports.userAdvanced = function (req,res,next){
    if(req.user.type === 'advanced'){
        return next();
    }else{
        res.redirect('/login')
    }
}
module.exports.customer = function (req,res,next){
    if(req.user.type === 'customer'){
        return next();
    }else{
        res.redirect('/login')
    }
}


