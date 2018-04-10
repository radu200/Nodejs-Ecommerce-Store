 const db = require('../config/database.js');
const Cart = require('../models/cart.js');
const paypal = require('paypal-rest-sdk');
module.exports.postCart = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    db.query(`SELECT * FROM products WHERE id =${req.params.id}`,function(err,result){
        console.log(result)
        if(err){
            console.log( "[mysql error]",err)
        } else{

            var products = {  
                sellerId: result[0].user_id,
                id:result[0].id,
                title:result[0].title,
                description:result[0].description,
                price:result[0].price,
                image:result[0].image,
                product_file_id:result[0].product_file
            }
    
          
    
            req.session.cart = cart;
            cart.add(products, result[0].id);
         
            res.redirect('back');
        }
    })
};
module.exports.getCart = function(req, res, next) {
    if (!req.session.cart) {
        
        return res.render('./products/cart', {
            products: null
        })
        }else{
              
        var cart = new Cart(req.session.cart);
        res.render('./products/cart', {
            products: cart.generateArray(),
            totalPrice: cart.totalPrice ,
            stripePrice: cart.stripePrice * 100  ,
            publishableKey: process.env.STRIPE_PKEY,
 
            
        });
       
    }
        
      console.log(req.session.cart.items)
};


module.exports.getCartItem = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
     
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
   
};



