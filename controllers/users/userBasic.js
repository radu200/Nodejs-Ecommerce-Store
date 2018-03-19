
const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const fs  =  require('fs');
const methodOverride = require('method-override');
///user basic
    module.exports.getSignupUserBasic = function(req, res, next) {
        res.render('./account/user-basic/user-basic-signup');
    };
    
 ///sign up
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
        
        
        
       let errors = req.validationErrors();
        
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
                    db.query('SELECT id , type, username FROM users WHERE email = ? ' , [email], function(err,results,fileds){
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





            




