var express = require('express');
var router = express.Router();

var mysql = require('mysql');

///mysql credential
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'h2o1992$',
    database: 'nodeproject'
});
/* GET users post. */
router.get('/', function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, results, fields) {
        if (err) throw err;
        res.render('index', {
            "results": results
        });
    })
});

module.exports = router;