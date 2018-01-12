var express = require('express');
var db = require('../db.js');
var expressValidator = require('express-validator');
// var expressValidator = require('express-validator');
// var mysql = require('mysql');
// var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })
//     ///mysql credential
// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'nodeproject'
// });

// var storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, 'public/images/');
//     },
//     filename: function(req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now());
//     }
// });
// var upload = multer({ storage: storage }).single('avatar');

/* GET users listing. */
module.exports.user = function(req, res, next) {
    res.render('user', {
        title: 'home'
    });
    // con.query("SELECT * FROM  image ", function(err, results, fields) {
    //     if (err) throw err;
    //     res.render('users', {
    //         "results": results
    // //     });
    // })
};

// router.post('/avatar', function(req, res, next) {
//     upload(req, res, function(err) {
//         var avatarName = req.file.filename;
//         if (err) {
//             return res.end("Error uploading file.");
//             var avatarName = 'noimage.jpg'
//         }
//         var avatar = {
//             image: avatarName
//         };

//         con.query('INSERT INTO image SET ?', avatar, function(err, result) {
//             ('posted')
//         })
//         res.redirect('/users')
//     });

// })


module.exports.login = function(req, res, next) {
    res.render('./account/login');
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
    ///validation
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('firstname', 'First Name  required').notEmpty();
    req.checkBody('lastname', 'Last Name required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be between 6-100 characters long.').len(4, 100);
    req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);
    
    const errors = req.validationErrors();
    
    /// input values
    
    if(errors){
		res.render('./account/signup',{
			errors:errors
		});
	} else {
		var newUser = new User({
			UserEmail: email,
			UserPasswordl:password,
			UserFirstName: firstname,
			UserLastName: lastname
		});

        db.query('INSERT INTO users SET ?',newUser, function(err, result) {
            console.log('created')
        })
    

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('./account/login');
	}
          
 };