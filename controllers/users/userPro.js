const express = require('express');
const db = require('../../config/database.js');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
const LocalStrategy   = require('passport-local').Strategy;
const crypto = require('crypto');
const nodemailer = require('nodemailer');



//user pro
module.exports.getSignupUserPro = function(req, res, next) {
    res.render('./account/user_pro/user_pro_signup');
};


module.exports.postSignupUserPro = function(req, res, next) {
        
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
    return res.redirect('/user-pro/signup')
} 

db.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
    if (err) throw err
    if (rows.length ){
        req.flash('error_msg', {msg:'This email is already taken.'});
        res.redirect('/user-pro/signup')
    } else {
        
      
       // create the user
       bcrypt.hash(password, saltRounds, function (err, hash) {
        crypto.randomBytes(16, function (err, buffer) {
            let token = buffer.toString('hex');
            // console.log('token',token)

            db.query('INSERT INTO users (password,email,username, type, user_status, email_confirmation_token) VALUES (?,?,?,?,?,?)', [hash, email, username, 'pro', 'unverified', token], function (error, result) {
                if (error) throw error
                db.query('UPDATE users SET email_token_expire = TIMESTAMPADD(HOUR, 1, NOW())  WHERE  email_confirmation_token = ? ', [token], function (error, result) {
                    if (error) throw error


                    db.query('SELECT id , type, username FROM users WHERE email = ? ', [email], function (err, results, fileds) {
                        if (error) throw error

                    });

                })
            });
            ///send email with token
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            });

            const mailOptions = {
                to: email,
                from: 'Company ecomerce',
                subject: 'Account Verification ',
                text: `You are receiving this email because you (or someone else) registed on our webite.\n\n
                 Please click on the following link, or copy and  paste this into your browser to complete the process:\n\n 
                 http://${req.headers.host}/account/verify/${token}\n\n
                 This link will be valid for only 1 hour.\n\n
                 If you did not request this, please ignore this email or report this action.\n`,

            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    req.flash('error_msg', errors);

                    return res.redirect('/forgot');
                }
            });

        }); //crypto ends
        req.flash('warning_msg', {
            msg: " Thank you for registering on our website. We sent you an email with futher details to confirm your account"
        });
        res.redirect('/login')
    }); //bcrypt ends

        
    }
});
};


