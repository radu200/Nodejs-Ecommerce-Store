 var db = require('../config/database.js');

/* GET users post. */
module.exports.index = function(req, res, next) {
    db.query("SELECT * FROM  products ", function(err, result, fields) {
        if (err) throw err;

        res.render('index', {
            
            "result": result
        });

        

    })
};

