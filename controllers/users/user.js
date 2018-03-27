var express = require('express');
var db = require('../../config/database.js');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
var LocalStrategy = require('passport-local').Strategy;
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');




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
    if (req.user.type === 'basic' || req.user.type === 'pro') {
        DeleteAccountBasicPro(req, res, next);
    } else if (req.user.type === 'customer') {
        DeleteAccountCustomer(req, res, next);
    } else {
        res.redirect('/login');
    }
};

function DeleteAccountCustomer(req, res, next) {
    let userId = req.user.id;
    db.query("DELETE FROM users where id =  ?", [userId], function (err, result) {
        if (err) throw err;
        console.log('account deleted')
    });
    req.flash('success_msg', {
        msg: 'Your account has been deleted'
    });
    res.redirect('/login');
}
//delete account user-basic and user-pro
function DeleteAccountBasicPro(req, res, next) {
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
                // if (results[0].image) {
                //     fs.unlink('./public/userFiles/productImages/' + results[0].image, function (err) {
                //         if (err) {
                //             console.log('there a error to delete product image ' + err)
                //         } else {
                //             console.log('successfully deleted  product image');
                //         }
                //     })
                // }
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
    db.query('SELECT * FROM  users WHERE resetPasswordToken = ? AND passwordResetExpires > NOW()', [req.params.token], function (err, rows, fields) {
        if (err) throw err;

        if (!rows.length) {
            req.flash('error_msg', {
                msg: 'Password reset token is invalid or has expired.'
            })
            res.redirect('/forgot')
        } else {

            res.render('./account/all-users/reset-password', {
                'result': rows[0]

            })
        }
    })
};

//post reset password
module.exports.postResetPassword = function (req, res, next) {
    let password = req.body.password;
    let confirm = req.body.confirm
    req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);


    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors);
        return res.redirect('back');
    }
    /// check for valid token

    db.query('SELECT * FROM  users WHERE resetPasswordToken = ? AND passwordResetExpires > NOW()', [req.params.token], function (err, rows, fields) {
        if (err) throw err;
        let email = rows[0].email
        let user = rows[0]
        console.log('user', user)
        if (!rows.length) {
            req.flash('error_msg', {
                msg: 'Password reset token is invalid or has expired.'
            })
            res.redirect('/forgot')

        }
        //    
        ///hash and update password
        bcrypt.hash(password, saltRounds, function (err, hash) {
            db.query('UPDATE  users SET password = ? WHERE resetPasswordToken = ? AND passwordResetExpires > NOW()', [hash, req.params.token], function (error, result) {
                if (error) throw error
                console.log('updated')

            })

        })




        //send email that password was updated
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
            subject: 'Your password has been changed',
            text: `Hello,\n\nThis is a confirmation that the password for your account  has just been changed.\n`

        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                req.flash('error_msg', errors);
                req.flash('success_msg', {
                    msg: 'Success! Your password has been changed.'
                });
                return res.redirect('/forgot');
            }
        });

        req.login(user, function (err) {
            req.flash('success_msg', {
                msg: 'Success! Your password has been changed.'
            });
            res.redirect('/profile')
        });

    })

}




module.exports.getForgot = function (req, res, next) {
    res.render('./account/all-users/forgot')
};


module.exports.postForgot = function (req, res, next) {
    req.checkBody('email', 'Please enter a valid email address.').isEmail();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors);
        return res.redirect('/forgot');
    }
    sendTokenResetPassword(req, res, next);

};


function sendTokenResetPassword(req, res, next) {
    let email = req.body.email;
    db.query('SELECT email FROM users WHERE email = ?', [email], function (err, results) {
        if (err) throw err;
        if (!results.length) {
            req.flash('error_msg', {
                msg: 'Account with that email address does not exist.'
            });
            res.redirect('/forgot')

            console.log('no user with this email')
        } else {
            //create random token
            crypto.randomBytes(16, function (err, buffer) {
                let token = buffer.toString('hex');
                // console.log('token',token)
                let updateToken = {
                    resetPasswordToken: token
                }
                db.query('UPDATE users SET ?,passwordResetExpires = TIMESTAMPADD(HOUR, 1, NOW())  WHERE email = ? ', [updateToken, email], function (error, result) {
                    if (error) throw error

                })


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
                    subject: 'Reset your password  ',
                    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the following link, or copy and  paste this into your browser to complete the process:\n\n
                    http://${req.headers.host}/password/reset/${token}\n\n
                    This link will be valid for only 1 hour.\n\n.
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,

                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        req.flash('error_msg', errors);

                        return res.redirect('/forgot');
                    }
                });

            });
            req.flash('success_msg', {
                msg: `An e-mail has been sent to ${email} with further instructions.`
            });
            res.redirect('/forgot');


        }
    });
}
//orders
module.exports.getUserOrders = function (req, res, next) {
    res.render('./account/all-users/orders')
};