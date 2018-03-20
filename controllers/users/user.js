var express = require('express');
var db = require('../../config/database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
var LocalStrategy = require('passport-local').Strategy;
const request = require('request');
const fs = require('fs');

module.exports.getLogin = function (req, res, next) {
    res.render('./account/login', );
};
module.exports.postLogin = function (req, res, next) {
    //validation login
    req.checkBody('username', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors);
        return res.redirect('./login')
    }

};


module.exports.getLogout = function (req, res, next) {
    req.logout();
    // //  console.log('session',req.session.cookie.path);
    // // req.session.destroy(() => {
    //     //     res.clearCookie('connect.sid')
    //     // })
    //     req.session = null;
    res.redirect('/login')
};






///delete user account
module.exports.getDeleteAccount = function (req, res, next) {
    let userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?", [userId], function (err, results, fields) {
        if (err) throw err;
        res.render('./account/all-users/delete-account', {
            "results": results
        });

    })

};

module.exports.postDeleteAccount = function (req, res, next) {
    let userId = req.user.id;

    //select query avatar from users
    db.query('SELECT avatar from users WHERE id = ?', [userId], function (err, results) {
        if (results[0].avatar) {
            fs.unlink('./public/userFiles/userAvatars/' + results[0].avatar, function (err) {
                if (err) {
                    console.log('there a error to delete user avatar ' + err)
                } else {
                    console.log('  user avatart successfully deleted ');
                }
            })
        }
        //delete users table               
        db.query("DELETE FROM users where id =  ?", [userId], function (err, result) {
            if (err) throw err;
            console.log('account deleted')

            //select query products image from users 
            db.query('SELECT * From products WHERE products.user_id = ?', [userId], function (err, results) {
                if (results[0].image) {
                    fs.unlink('./public/userFiles/productImages/' + results[0].image, function (err) {
                        if (err) {
                            console.log('there a error to delete product image ' + err)
                        } else {
                            console.log('successfully deleted  product image');
                        }
                    })
                }
                // delete products table                   
                db.query("DELETE FROM products where products.user_id = ?", [userId], function (err, result) {
                    if (err) throw err;
                    console.log('account deleted')

                }) // delete products table ends

            }) //select query products image from users  ends

        }) //delete users table ends

    }) //select query avatar from users  ends


    req.flash('success_msg', {
        msg: 'Your account has been deleted'
    });
    res.redirect('/login');
}

module.exports.getResetPassword = function (req, res, next) {
    res.render('./account/all-users/reset-password')
};

module.exports.getEmailResetPassword = function (req, res, next) {
    res.render('./account/all-users/reset-password-email')
};
//orders
module.exports.getUserOrders  = function (req, res, next) {
    res.render('./account/all-users/orders')
};


