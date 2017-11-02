var express = require('express');
var router = express.Router();
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
router.get('/', function(req, res, next) {
    // con.query("SELECT * FROM  image ", function(err, results, fields) {
    //     if (err) throw err;
    //     res.render('users', {
    //         "results": results
    // //     });
    // })
});

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
//             console.log('posted')
//         })
//         res.redirect('/users')
//     });

// })
module.exports = router;