var db = require('../config/database.js');
var Cart = require('../models/cart.js');
module.exports.postCart = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    db.query(`SELECT * FROM products RIGHT JOIN users ON users.id = products.user_id WHERE products.id =${req.params.id}`,function(err,result){
        console.log('user',result)
        if(err){
            console.log(err)
        }   
        var products = {
            username:result[0].username,
            sellerId: result[0].user_id,
            id:result[0].id,
            title:result[0].title,
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
        totalPrice: cart.totalPrice * 100,
        publishableKey: process.env.STRIPE_PKEY
        });
       
       console.log('sessins')
};


module.exports.getCartItem = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
     
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
   
};



