var con = require('../db.js');

// ///mysql credential
// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'h2o1992$',
//     database: 'nodeproject'
// });
/* GET users post. */
module.exports.index = function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, result, fields) {
        if (err) throw err;
        res.render('index', {
            "result": result
        });

    })
};

