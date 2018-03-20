 var db = require('../config/database.js');

/* GET users post. */
module.exports.getHomePage = function(req, res, next) {
    db.query("SELECT * FROM  products ", function(err, result, fields) {
        if (err) throw err;

        res.render('./pages/home', {
            
            "result": result
        });
    })
};

