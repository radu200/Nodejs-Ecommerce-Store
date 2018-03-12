
const db = require('../config/database.js');

//get product details page
module.exports.getProductDetailPage = function(req, res, next) {
    db.query(`SELECT * FROM  products WHERE id=${req.params.id}`, function(err, rows, fields) {
        if (err) throw err;
        res.render('./products/product_detail', {
            "rows": rows
        });
    })
};

