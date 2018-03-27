const stripe = require('stripe')(process.env.STRIPE_SKEY);
const db = require('./../config/database.js');


module.exports.postCharge = function (req,res,next){
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
      }

   stripe.charges.create({
    amount: req.session.cart.totalPrice * 100,
    currency: 'usd',
    source: req.body.stripeToken,
    description: req.body.stripeEmail,
    // customer: customer.id
  }, (err,charge) => {
    if (err && err.type === 'StripeCardError') {
      req.flash('error_msg', { msg: 'Your card has been declined.' });
      return res.redirect('/cart');
    }
    let order_confirmation_id = charge.id;
    let customerId = req.user.id;
    let products = JSON.stringify(req.session.cart.items);
  
    
    db.query('INSERT INTO orders (product_id,order_confirmation_id,customer_id) VALUES (?,?,?)', [ products,order_confirmation_id ,customerId], function (error, result) {
     
        if (error) {
           console.log(error);
           
       }else{
           console.log('success')
         
       }
    })

    req.flash('success_msg', { msg: 'Your card has been successfully charged.' });
    req.session.cart = null;
    res.render('./products/success-payment');
  });
};
