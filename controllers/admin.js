// var knex = require('knex');
 var db = require('../config/database.js');

/* GET users post. */
module.exports.dashboard = function(req, res, next) {
    db.query("SELECT * FROM  products", function(err, results, fields) {
        if (err) throw err;
        res.render('dashboard', {
            "results": results
        });
    })
};