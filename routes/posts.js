var expressValidator = require('express-validator');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodeproject'
});

con.connect();


//seect from database and display on screen
module.exports.postsGet = function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, results, fields) {
        if (err) throw err;
        res.render('posts', {
            "results": results
        });
    })
};

//display add posts form
module.exports.GetFormPosts = function(req, res, next) {
    res.render('add_posts');
};

module.exports.AddPost = function(req, res, next) {

    var title = req.body.title;
    var description = req.body.description;
        //validation
        req.checkBody('title', 'title field cannot be empty.').notEmpty();
        req.checkBody('description', 'description field cannot be empty.').notEmpty();

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
        req.flash('success', { msg: 'Projects Updated' });
        res.redirect('/');
    }
}

//update post
module.exports.editPostGet = function(req, res, next) {
    con.query(`SELECT * FROM  users WHERE id=${req.params.id}`, function(err, result, fields) {
        if (err) throw err;
        res.render('edit_posts', {
            "result": result[0]
        });
    })
};

module.exports.editPostUpdate = function(req, res, next) {
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
        req.flash('success', { msg: "post updated" });
        res.redirect('/posts');
    }
};

//delete post
module.exports.deletePost = function(req, res) {
    var id = req.params.id;

    con.query(`DELETE FROM users  WHERE id =${id}`, function(err, result) {
        if (err) throw err;
    })

    req.flash('success', { msg: "post deleted" });
    res.redirect('/posts');
};
