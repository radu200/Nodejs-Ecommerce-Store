let express = require('express');
let db = require('../../config/database.js');
let expressValidator = require('express-validator');
let bcrypt = require('bcrypt');
const passport = require('passport');
const saltRounds = 10;
let LocalStrategy = require('passport-local').Strategy;
const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const csrf = require ('csurf');

const csrfProtection = csrf();



module.exports.userProfileView = async function (req, res, next) {
    let userId = req.params.id;

    function awaitGetUsers(userId) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT  users.id, users.username, users.avatar, users.about FROM  users WHERE users.id = ?", [userId], function (err, result_user_card, fields) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                }

                resolve(result_user_card);
            });
        });
    }


    function awaitGetProducts(userId) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT products.id,products.user_id, products.image,products.date,products.price, products.title, products.description FROM products WHERE products.user_id = ? ", [userId], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    resolve([]);
                }
                let products = [];
                for (let i = 0; i < result.length; i++) {
                    let answer = result[i]
                    products.push(result[i])
                    let DateOptions = {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    };

                    let dateFormat = result[i].date.toLocaleDateString('en-ZA', DateOptions)
                    answer.date = dateFormat;
                }

                resolve(!err && products ? products : []);
            });
        });
    }
    let users_result = await awaitGetUsers(userId);
    let products = await awaitGetProducts(userId);

    res.render('./account/user-basic/profile', {
        "result": products,
        "resultCard": users_result[0]
    });
}
module.exports.getLogin = function (req, res, next) {
    res.render('./account/login', {
        csrfToken: req.csrfToken()
    });

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

            // //select query products image from users 
            // db.query('SELECT * From products WHERE products.user_id = ?', [userId], function (err, results) {
            //     // if (results[0].image) {
            //     //     fs.unlink('./public/userFiles/productImages/' + results[0].image, function (err) {
            //     //         if (err) {
            //     //             console.log('there a error to delete product image ' + err)
            //     //         } else {
            //     //             console.log('successfully deleted  product image');
            //     //         }
            //     //     })
            //     // }
            // delete products table                   
            db.query("DELETE FROM products where products.user_id = ?", [userId], function (err, result) {
                if (err) throw err;
                console.log('account deleted')

            }) // delete products table ends

            // }) //select query products image from users  ends

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
        const transwerporter = nodemailer.createTranswerport({
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

        transwerporter.sendMail(mailOptions, (err) => {
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
                const transwerporter = nodemailer.createTranswerport({
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

                transwerporter.sendMail(mailOptions, (err) => {
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
    let userId = req.user.id;
    db.query('SELECT orders.id, orders.date, orders.customer_id, order_details.*, users.id, users.username FROM orders LEFT JOIN order_details ON orders.id = order_details.order_id LEFT JOIN users ON users.id = order_details.seller_id WHERE orders.customer_id = ?', [userId], function (err, result) {
        if (err) {
            console.log("[mysql error]", err)
        }
        let products = [];
        for (let i = 0; i < result.length; i++) {
            let answer = result[i]
            result[i].totalPrice = result[i].product_qty * result[i].product_price;
            products.push(result[i])
            let DateOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };

            let dateFormat = result[i].date.toLocaleDateString('en-ZA', DateOptions)
            answer.date = dateFormat;
        }

        console.log('result', result)
        res.render('./account/all-users/orders', {
            'result': products


        })
    })
};


///change password

module.exports.getChangePassword = function (req, res, next) {

    if (req.user.type === 'basic' || req.user.type === 'pro') {
        res.render('./account/all-users/change-password')

    } else if (req.user.type === 'customer') {
        res.render('./account/customer/change-password')
    } else {
        res.redirect('/login');
    }
}

module.exports.postChangePassword = function (req, res, next) {

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;



    req.checkBody('oldPassword', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('newPassword', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.newPassword);




    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors);
        return res.redirect('/password/reset')
    }

    db.query("SELECT users.password,users.email FROM users WHERE id = ?", [req.user.id], function (err, rows) {
        if (err) {
            console.log("[mysql error]", err)
        } else {

            let hash = rows[0].password;

            bcrypt.compare(oldPassword, hash, function (error, result) {
                if (err) {
                    throw (err)
                }
                if (result === true) {
                    bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                        db.query('UPDATE users SET password = ? WHERE id = ? ', [hash, req.user.id], function (err, result) {
                            if (err) throw err
                            console.log('success')
                        })

                    })
                }
            })

        }
        const transwerporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }


        });


        //send email that password was updated

        const mailOptions = {
            to: rows[0].email,
            from: 'Company ecomerce',
            subject: 'Your password has been changed',
            text: `Hello,\n\nThis is a confirmation that the password for your account  has just been changed.\n`

        };

        transwerporter.sendMail(mailOptions, (err) => {
            if (err) {
                req.flash('error_msg', errors);

            } else {
                req.flash('success_msg', {
                    msg: 'Success! Your password has been changed.'
                });
                res.redirect('/password/reset')
            }
        });



    })


    req.flash('success_msg', {
        msg: 'Success! Your password has been changed.'
    });
    res.redirect('/password/reset')

}


module.exports.getChangeEmail = function (req, res, next) {
    if (req.user.type === 'basic' || req.user.type === 'pro') {
        db.query('SELECT users.email FROM users WHERE id = ?', [req.user.id], function (err, result) {

            res.render('./account/all-users/change-email', {
                'result': result[0]
            })
        })

    } else if (req.user.type === 'customer') {
        res.render('./account/customer/change-password')
    } else {
        res.redirect('/login');
    }
}



module.exports.postChangeEmail = function (req, res, next) {
    let email = req.body.newEmail;
    let password = req.body.password;

    console.log(email);

    console.log(password)

    req.checkBody('email').optional().isEmail({
        errorMessage: "email is not valid"
    })
    req.checkBody('password', 'Password must be between 6-100 characters long').len(1, 100)

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error_msg', errors);
        res.redirect('/email/change')
    }


    db.query("SELECT users.password,users.email FROM users WHERE id = ?", [req.user.id], function (err, rows) {

        if (err) {
            console.log("[mysql error]", err)
        } else {

            let hash = rows[0].password;

            bcrypt.compare(password, hash, function (error, result) {
                if (err) {
                    throw (err)
                }
                if (result === true) {
                    crypto.randomBytes(16, function (err, buffer) {
                        let token = buffer.toString('hex');
                        db.query('UPDATE users SET email = ?, user_status = ?, 	email_confirmation_token = ? , email_token_expire = TIMESTAMPADD(HOUR, 2, NOW()) WHERE id = ? ', [email, 'unverified', token, req.user.id], function (err, result) {
                            if (err) throw err
                            console.log('success')




                            db.query('SELECT users.email FROM users WHERE id = ? ', [req.user.id], function (err, result) {
                                if (err){
                                    console.log("[mysql error", err)
                                }
                                console.log('success')
                                 


                                ///send email with token
                                const transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: process.env.GMAIL_USER,
                                        pass: process.env.GMAIL_PASSWORD
                                    }
                                });

                                const mailOptions = {
                                    to: result[0].email,
                                    from: 'Company ecomerce',
                                    subject: 'Email Change ',
                                    text: `You are receiving this email because you (or someone else) request to change email on acount.\n\n
                         Please click on the following link, or copy and  paste this into your browser to complete the process:\n\n 
                         http://${req.headers.host}/email/change/${token}\n\n
                         This link will be valid for only 2 hours.\n\n
                         If you did not request this, please ignore this email or report this action.\n`,

                                };

                                transporter.sendMail(mailOptions, (err) => {
                                    if (err) {
                                        req.flash('error_msg', errors);

                                        return res.redirect('/');
                                    }
                                });
                            })
                        })
                    })

                }
            })

        }

    })

    req.flash('warning_msg', {
        msg: "  We sent you an email with futher details to confirm your email.Until confirmation you are not goona be able to log in."
    });
    res.redirect('/login')


}
    

module.exports.checkEmailToken = function (req,res,next){
    let token = req.params.token
    db.query('SELECT * FROM users where email_confirmation_token = ? AND email_token_expire > NOW()', [token], function (err, rows) {
        if (err) {
            console.log(err)
        } else if (rows.length) {
            // let verified = 'verified';
            db.query('UPDATE users SET user_status = ? WHERE email_confirmation_token = ? AND email_token_expire > NOW()', ['verified', token], function (err, rows) {
                if (err) throw err
            })
            db.query("UPDATE users SET email_confirmation_token = ? WHERE id = ? ", [null, rows[0].id])
            req.login(rows[0], function (err) {
                req.flash('success_msg', {
                    msg: "Success! Your email has been verified"
                });
                res.redirect('/profile')
            });
        } else {
            req.flash('error_msg', {
                msg: " Sorry we wasn't able to verify your email"
            });
            res.redirect('/login')
        }

    })
}


// req.flash('success_msg', {
        //     msg: 'Success! Your email has been changed.'
        // });
        // res.redirect('/email/change')