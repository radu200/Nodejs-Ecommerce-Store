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
        return res.redirect('./login')}
    // } else{
            
    //     }
        
        
 
        
    };


module.exports.getLogout = function(req,res,next){
        req.logout();
        // //  console.log('session',req.session.cookie.path);
        // // req.session.destroy(() => {
        //     //     res.clearCookie('connect.sid')
        //     // })
        //     req.session = null;
        res.redirect('/login')
    };
   



module.exports.getProfile = function(req, res, next) {
    console.log('profile', req.user.id);
     let userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?" ,[userId] ,function(err, results, fields) {
        if (err) throw err;
        res.render('./account/userProfile', {
            "results": results
        });

    })
};



///delete user account
module.exports.getDeleteAccount = function(req, res, next) {
    res.render('./account/all-users/delete-account')
};

module.exports.getResetPassword = function(req, res, next) {
    res.render('./account/all-users/reset-password')
};

module.exports.getEmailResetPassword = function(req, res, next) {
    res.render('./account/all-users/reset-password-email')
};






