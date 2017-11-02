var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var mysql = require('mysql');
var multer = require('multer')
var upload = multer({ dest: 'public/images' })
    ///mysql credential
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'h2o1992$',
    database: 'nodeproject'
});

con.connect();
router.get('/add', function(req, res, next) {
    res.render('add_posts');
});

//seect from database and display on screen
router.get('/', function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, results, fields) {
        if (err) throw err;
        res.render('posts', {
            "results": results
        });
    })
});


router.post('/add', upload.single('avatar'), function(req, res, next) {
    //validation
    req.checkBody('title', 'title field cannot be empty.').notEmpty();
    req.checkBody('description', 'description field cannot be empty.').notEmpty();

    var title = req.body.title;
    var description = req.body.description;

    if (req.file) {
        var avatarName = req.file.filename;
    } else {
        var avatarName = 'noimage.png'
    }
    var errors = req.validationErrors();
    if (errors) {
        res.render('add_posts', {
            errors: errors,
            title: title,
            description: description
        });
    } else {
        var project = {
            title: title,
            description: description,
            image: avatarName
        };
        con.query('INSERT INTO users SET ?', project, function(err, result) {
            console.log('posted')
        })
        req.flash('success', 'Projects Updated')
        res.location('/posts');
        res.redirect('/');
    }
})

//update post
router.get('/edit/:id', function(req, res, next) {
    con.query(`SELECT * FROM  users WHERE id=${req.params.id}`, function(err, result, fields) {
        if (err) throw err;
        res.render('edit_posts', {
            "result": result[0]
        });
    })
});

router.post('/edit/:id', function(req, res, next) {
    //validation
    req.checkBody('title', 'title field cannot be empty.').notEmpty();
    req.checkBody('description', 'description field cannot be empty.').notEmpty();

    var title = req.body.title;
    var description = req.body.description;
    //image
    if (req.file) {
        var avatarName = req.file.filename;
    } else {
        var avatarName = 'noimage.jpg'
    }
    var errors = req.validationErrors();

    if (errors) {
        res.render('index', {
            errors: errors,
            title: title,
            description: description
        });
    } else {
        var project = {
            title: title,
            description: description,
            image: avatarName
        };
        con.query(`UPDATE users SET  ? WHERE id =${req.params.id}`, project, function(err, result) {
            console.log('users update')
        })

        res.redirect('/posts');
    }
});

//delete post
router.delete('/delete/:id', function(req, res) {
    var id = req.params.id;

    con.query(`DELETE FROM users  WHERE id =${id}`, function(err, result) {
        if (err) throw err;
    })

    res.location('/posts')
    res.redirect('/');
});


module.exports = router;