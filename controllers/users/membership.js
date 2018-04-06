const stripe = require('stripe')(process.env.STRIPE_SKEY);
const db = require('../../config/database.js');
const paypal = require('paypal-rest-sdk');

module.exports.getUserProPayment = (req, res, next) => {

db.query(`SELECT membership_aproved_date , type FROM users WHERE id =${req.user.id}`, function (err, rows) {
   if(rows[0].type === 'pro' && rows[0].membership_aproved_date < Date.now()){
       res.render('./account/user-pro/membership-payment',{
        publishableKey: process.env.STRIPE_PKEY
       })
   }else if(rows[0].type === 'pro' && rows[0].membership_aproved_date > Date.now()){
      res.redirect('/dashboard')
   } else{
    res.render('./account/user-pro/membership-payment', {
        publishableKey: process.env.STRIPE_PKEY
    })
   }
 })
}
module.exports.postUserProPayment = (req, res, next) => {
    stripe.charges.create({
        amount: 1500,
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
        } else {
            console.log('charge', charge)
            db.query('UPDATE users SET membership = ?, type = ?,membership_aproved_date = TIMESTAMPADD(MONTH, 1, NOW()) WHERE id = ? ', ['approved', 'pro', req.user.id], function (err, result) {
                if (err) {
                    console.log("[mysql}", err)
                }
                db.query('SELECT  id , password, username, email,user_status,type FROM users WHERE id = ?', [req.user.id], function (err, result) {
                    if (err) {
                        console.log("[mysql}", err)
                    }

                    req.login(result[0], function (err) {
                        req.flash('success_msg', {
                                msg: "Your membership for 1 month has been aproved"
                            }),
                            res.redirect('/profile')

                    })
                })
            })

        }
    });


};


module.exports.postPaypalMembership = (req,res,next) =>{
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
          return_url: process.env.PAYPAL_RETURN_URL_MEMBERSHIP,
          cancel_url: process.env.PAYPAL_CANCEL_URL_MEMBERSHIP
        },
        "transactions": [{
          "item_list": {
            "items": [{
    
              "price": 15,
              "currency": "USD",
              "quantity": "1"
            }]
          },
          "amount": {
            "currency": "USD",
            "total": 15,
    
          },
         'description':'Membership User Pro'
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
}



module.exports.getPayPaypalMemebershipSuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const paymentDetails = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": 15
        }
      }]
    };
  
    paypal.payment.execute(paymentId, paymentDetails, function (error, payment) {
      if (error) {
        console.log(error);
        throw error;
      } else{
        db.query('UPDATE users SET membership = ?, type = ?, membership_aproved_date = TIMESTAMPADD(MONTH, 1, NOW()) WHERE id = ? ', ['approved', 'pro', req.user.id], function (err, result) {
            if (err) {
                console.log("[mysql}", err)
            }
            db.query('SELECT  id , password, username, email,user_status,type FROM users WHERE id = ?', [req.user.id], function (err, result) {
                if (err) {
                    console.log("[mysql}", err)
                }


                req.login(result[0], function (err) {
                    req.flash('success_msg', {
                            msg: "Your membership for 1 month has been aproved"
                        }),
                        res.redirect('/profile')
                   
                })
            })
        })
      }
  })
}
  
  module.exports.getPayPalMemeberhipCancel = (req, res) => {
    res.render('./pages/paypal', {
      result: true,
      canceled: true
    });
    
  }








///cancel membership
module.exports.postCancelMembership = (req, res, next) => {

    db.query('UPDATE users SET membership = ? WHERE id = ? ', [null, req.user.id], function (err, result) {
        if (err) {
            console.log("[mysql error]", err)
        }

        db.query('SELECT id, username,password, user_status,type,membership FROM users WHERE id = ?', [req.user.id], (err, result) => {

            if (err) {
                console.log("[mysql error]", err)
            }
            req.login(result[0], (err) => {
                req.flash('info_msg', {
                    msg: "You canceled to proceed to check out for upgrading to Pro Account"
                })
                res.redirect('/profile')

            })
        })
    })

}