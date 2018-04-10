 const db = require('../config/database.js');
 const fs = require('fs')
 const path = require('path');
 const mime = require('mime')
/* GET users post. */
module.exports.getHomePage = function(req, res, next) {
    db.query("SELECT * FROM  products WHERE product_status = ? ",['verified'],function(err, result, fields) {
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
                // answer.productPrice = answer.toFixed(price)
                let dateFormat =  result[i].date.toLocaleDateString('en-ZA', DateOptions)
                answer.date = dateFormat;
         }
        res.render('./pages/home', {
              "result":products
              
        });
    })
};

module.exports.gettest = function(req,res,next){
    res.render('./products/add-file')
}