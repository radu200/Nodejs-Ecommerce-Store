const stripe = require('stripe')(process.env.STRIPE_SKEY);
const db = require('./../config/database.js');
const paypal = require('paypal-rest-sdk');


module.exports.postCharge = function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/');
  }

   stripe.charges.create({
    amount: req.session.cart.stripePrice * 100,
    currency: 'usd',
    source: req.body.stripeToken,
    description: req.body.stripeEmail,
        // customer: customer.id
    }, (err, charge) => {
        if (err && err.type === 'StripeCardError') {
            req.flash('error_msg', {
                msg: 'Sorry.Your card has been declined.'
            });
            return res.redirect('back');
          }

    let order_confirmation_id = charge.id;
    let customerId = req.user.id;
    let products = JSON.stringify(req.session.cart.items);
    let customer_country = charge.source.country;
    let amount_paid = charge.amount;
    console.log('card1', charge)


    db.query('INSERT INTO orders (customer_country,order_confirmation_id,customer_id,amount_paid,provider) VALUES (?,?,?,?,?)', [customer_country, order_confirmation_id, customerId, amount_paid, 'stripe'], function (error, result) {
      if (error) throw error;
      db.query('SELECT LAST_INSERT_ID() as order_id', function (err, result, fileds) {
        if (err) throw err;
        console.log('order id', result[0])
        let cartItems = req.session.cart.items;


        console.log('cartITems ', cartItems)
        for (let key in cartItems) {
          if (cartItems.hasOwnProperty(key)) {
            let product_id = cartItems[key].item.id
            let order_id = result[0].order_id;
            let seller_id = cartItems[key].item.sellerId;
            let product_price = cartItems[key].item.price;
            let product_title = cartItems[key].item.title;
            let product_description = cartItems[key].item.description;
            let product_image = cartItems[key].item.image;
            let product_qty = cartItems[key].qty;

            let product = {
              product_id: product_id,
              order_id: order_id,
              seller_id: seller_id,
              product_price: product_price,
              product_title: product_title,
              product_description: product_description,
              product_image: product_image,
              product_qty: product_qty

            }

            db.query('INSERT INTO order_details SET ?', product, function (error, result) {
              console.log("[mysql error]", error);

            })
          }
        }

        console.log('success')
        req.flash('success_msg', {
          msg: 'Payment was successful proceed.Thank you for choosing our product!.'
        });
        req.session.cart = null;
        res.render('./pages/success-payment');
      })
    })
  });
};


module.exports.postPayPal = (req, res, next) => {
  paypal.configure({
    mode: 'sandbox',
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET

  });



  const paymentDetails = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      return_url: process.env.PAYPAL_RETURN_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL
    },
    "transactions": [{
      "item_list": {
        "items": [{

          "price": req.session.cart.totalPrice,
          "currency": "USD",
          "quantity": "1"
        }]
      },
      "amount": {
        "currency": "USD",
        "total": req.session.cart.totalPrice,

      }
    }]
  };

  paypal.payment.create(paymentDetails, (err, payment) => {
    if (err) {
      throw err;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  })
};


module.exports.getPayPalSuccess = (req, res) => {


  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const paymentDetails = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": req.session.cart.totalPrice
      }
    }]
  };

  paypal.payment.execute(paymentId, paymentDetails, function (error, payment) {
    if (error) {
      console.log(error);
      throw error;
    } else {


      let order_confirmation_id = payment.id;
      let customerId = req.user.id;
      let products = JSON.stringify(req.session.cart.items);
      let customer_country = payment.payer.payer_info.country_code;
  
      let amount_paid = req.session.cart.totalPrice;
    
     // req.session.cart = null;

      db.query('INSERT INTO orders (customer_country,order_confirmation_id,customer_id,amount_paid,provider) VALUES (?,?,?,?,?)', [customer_country, order_confirmation_id, customerId, amount_paid, 'paypal'], function (error, result) {
        if (error) throw error;
        db.query('SELECT LAST_INSERT_ID() as order_id', function (err, result, fileds) {
          if (err) throw err;
           let cartItems = req.session.cart.items

         
          for (let key in cartItems) {
            if (cartItems.hasOwnProperty(key)) {
              let product_id = cartItems[key].item.id
              let order_id = result[0].order_id;
              let seller_id = cartItems[key].item.sellerId;
              let product_price = cartItems[key].item.price;
              let product_title = cartItems[key].item.title;
              let product_description = cartItems[key].item.description;
              let product_image = cartItems[key].item.image;
              let product_qty = cartItems[key].qty;

              let product = {
                product_id: product_id,
                order_id: order_id,
                seller_id: seller_id,
                product_price: product_price,
                product_title: product_title,
                product_description: product_description,
                product_image: product_image,
                product_qty: product_qty

              }

              db.query('INSERT INTO order_details SET ?', product, function (error, result) {
                console.log("[mysql error]", error);

              })
            }
          }

          console.log('success')
          req.session.cart = null;
            req.flash('success_msg', {
              msg: 'Payment was successful proceed.Thank you for choosing our product!'
            });

          res.redirect('/')
      
        })
      })
     }
  });
}


module.exports.getPayPalCancel = (req, res) => {
  req.session.paymentId = null;
  res.render('./pages/paypal', {
    result: true,
    canceled: true
  });
 
}