var con = require('../db.js');

/* GET users post. */
module.exports.dashboard = function(req, res, next) {
    con.query("SELECT * FROM  users ", function(err, results, fields) {
        if (err) throw err;
        res.render('dashboard', {
            "results": results
        });
    })
};