var mysql = require('mysql');

///mysql credential
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodeproject'
});
/* GET users post. */
module.exports.dashboard = function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, results, fields) {
        if (err) throw err;
        res.render('dashboard', {
            "results": results
        });
    })
};
