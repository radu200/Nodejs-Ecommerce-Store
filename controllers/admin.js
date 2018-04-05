// var knex = require('knex');
 var db = require('../config/database.js');

/* GET users post. */
module.exports.getAdminDashboard = (req, res, next) => {
    db.query("SELECT * FROM  products", (err, results, fields) => {
        if (err) throw err;
        res.render('./admin/dashboard', {

            "results": results
        });
    })
};



module.exports.getCheckproducts = (req, res, next) => {
    db.query("SELECT products.*, products.id as productId, users.*, users.id as sellerId FROM  products LEFT JOIN users ON products.user_id = users.id WHERE products.product_status = ?", ['unverified'], (err, results, fields) => {
        if (err) throw err;
        let products = [];
        for ( let i = 0; i < results.length; i++){
            let answer = results[i]
            products.push(results[i])
            let DateOptions = {   
                day: 'numeric',
                month: 'long', 
                year: 'numeric',
                hour:'numeric',
                minute:'numeric'
               };
               // answer.productPrice = answer.toFixed(price)
               let dateFormat =  results[i].date.toLocaleDateString('en-ZA', DateOptions)
               answer.date = dateFormat;
            }
        res.render('./admin/check-products',{
            'result':products
           
        })
        
    })
    
}