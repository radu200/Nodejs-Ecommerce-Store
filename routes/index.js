 var con = require('../db.js');

/* GET users post. */
module.exports.index = function(req, res, next) {
    con.query("SELECT * FROM  products ", function(err, result, fields) {
        if (err) throw err;
        res.render('index', {
            "result": result
        });

    })
};

