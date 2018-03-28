 var db = require('../config/database.js');

/* GET users post. */
module.exports.getHomePage = function(req, res, next) {
    db.query("SELECT * FROM  products ", function(err, result, fields) {
        if (err) throw err;
      let products = [];
         for ( let i = 0; i < result.length; i++){
             let answer = result[i]
             products.push(result[i])
             let DateOptions = {   
                 day: 'numeric',
                 month: 'long', 
                 year: 'numeric'
                };
                
                let dateFormat =  result[i].date.toLocaleDateString('en-ZA', DateOptions)
                answer.date = dateFormat;
         }

        res.render('./pages/home', {
              "result":products
              
        });
    })



};

