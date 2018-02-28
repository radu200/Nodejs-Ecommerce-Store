var express = require('express');
var db = require('../../config/database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
var LocalStrategy   = require('passport-local').Strategy;
const request = require('request');


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
   



module.exports.getProfile = function(req, res, next) {
    console.log('profile', req.user);
    res.render('./account/userProfile', {
        title: 'profilepage'
 });
};

///delete user account
module.exports.getDeleteAccount = function(req, res, next) {
    
    res.render('./account/all-users/delete-account')
};





