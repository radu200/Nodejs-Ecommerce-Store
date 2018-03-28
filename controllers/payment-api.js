const stripe = require('stripe')(process.env.STRIPE_SKEY);
const db = require('./../config/database.js');


module.exports.postCharge = function (req,res,next){
    if(!req.session.cart) {
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


module.exports.getPayPal = (req, res, next) => {
  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET
  });

  const paymentDetails = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: process.env.PAYPAL_RETURN_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    },
    transactions: [{
      description: 'Hackathon Starter',
      amount: {
        currency: 'USD',
        total: '1.99'
      }
    }]
  };

  paypal.payment.create(paymentDetails, (err, payment) => {
    if (err) { return next(err); }
    req.session.paymentId = payment.id;
    const links = payment.links;
    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        res.render('api/paypal', {
          approvalUrl: links[i].href
        });
      }
    }
  });
};

/**
 * GET /api/paypal/success
 * PayPal SDK example.
 */
module.exports.getPayPalSuccess = (req, res) => {
  const paymentId = req.session.paymentId;
  const paymentDetails = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, paymentDetails, (err) => {
    res.render('./products/success-payment', {
      result: true,
      success: !err
    });
  });
};

/**
 * GET /api/paypal/cancel
 * PayPal SDK example.
 */
module.exports.getPayPalCancel = (req, res) => {
  req.session.paymentId = null;
  res.render('api/paypal', {
    result: true,
    canceled: true
  });
};
