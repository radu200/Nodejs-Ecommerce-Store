var db = require('../config/database.js');
var Cart = require('../config/cart.js');
module.exports.postCart = function(req, res, next) {
    // req.session.cart = req.session.cart || {};
    // var cart = req.session.cart;
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    db.query(`SELECT * FROM products WHERE id =${req.params.id}`,function(err,result){
        //    console.log(result[0].name) 
        
        if(err){
            console.log(err)
        }   
        var products = {
            title:result[0].name,
            description:result[0].description,
            price:result[0].price,
            image:result[0].image
        }
        req.session.cart = cart;
        cart.add(products, result[0].id);
        console.log(req.session.cart)
       
        res.redirect('back');
                })
    
                
            };
module.exports.getCart = function(req, res, next) {
    if (!req.session.cart) {
        return res.render('./products/cart', {
            products: null
        });
        }
        var cart = new Cart(req.session.cart);
        res.render('./products/cart', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        });

};