
let express = require('express');
let db = require('.././config/database.js');

module.exports.getSearch = function (req, res, next) {
    if (req.query.search) {
        let productName = req.query.search;
        db.query(`SELECT * FROM products  WHERE title LIKE '%${productName}%' LIMIT 50`, function (err, result) {
            if (err) throw err
            if (!result.length) {
                req.flash('info_msg', {
                    msg: 'Sorry we did not find any products with this name'
               
                })
                res.redirect('back',)
            } else {
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
                res.render('./search/search',{
                    'result':products,
                    'product':result.length
                })
            }
        })
    } else {
        res.redirect('back')
    }

};


   


module.exports.getProductByCategory = function (req, res, next) {
  let category_name = req.params.category_name;

//   res.status(200).send( category_name)
db.query(`SELECT products.id, products.image, products.description,products.title,products.category_name, products.price,products.date FROM  products WHERE category_name = '${req.params.category_name}'`, function(err, result, fields) {
    if (err) throw err;

  
    if (!result.length) {
        req.flash('info_msg', {
            msg: 'Sorry we did not find any products in this category'
       
        })
        res.redirect('back',)
    }else{
    
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
    console.log(products)
        res.render('./search/category',{
            'result': products,
            'product':result.length
        })
    }

})

}

