// let knex = require('knex');
const db = require('../config/database.js');
const fs = require('fs')
/* GET users post. */
module.exports.getAdminDashboard = (req, res, next) => {
    db.query("SELECT *  FROM users ", (err, results, fields) => {
        if (err) throw err;
             let user = [];
        for ( let i = 0; i < results.length; i++){
            let answer = results[i]
            user.push(results[i])
            let DateOptions = {   
                day: 'numeric',
                month: 'long', 
                year: 'numeric',
                hour:'numeric',
                minute:'numeric'
               };
               let dateFormat =  results[i].registration_date.toLocaleDateString('en-ZA', DateOptions)
               answer.date = dateFormat;
            }
        console.log(user)
        res.render('./admin/dashboard',{
            'results':user
            
           
        })
        
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


//post product approve
module.exports.postproductApprove = (req,res,next) => {
    db.query("SELECT  products.id as productId,  users.id as sellerId FROM  products LEFT JOIN users ON products.user_id = users.id WHERE products.product_status = ?", ['unverified'], (err, results, fields) => {
         if (err){
            console.log('[mysql]', err)
        }

        db.query("UPDATE products SET product_status = ? WHERE id = ?", ['verified',results[0].productId], (err, results, fields) => {
             if (err){
               console.log('[mysql]', err)
             }
         })
        req.flash('success_msg', {msg:"Product approved"})
        res.redirect('back')
    })
}






module.exports.getUserOrders = (req,res,next) => {
    let userId = req.params.id;
    db.query('SELECT orders.id, orders.date, orders.customer_id, order_details.*, users.id, users.username FROM orders LEFT JOIN order_details ON orders.id = order_details.order_id LEFT JOIN users ON users.id = order_details.seller_id WHERE orders.customer_id = ?', [userId], function (err, result) {
        if (err) {
            console.log("[mysql error]", err)
        }
        let products = [];
        for (let i = 0; i < result.length; i++) {
            let answer = result[i]
            result[i].totalPrice = result[i].product_qty * result[i].product_price;
            products.push(result[i])
            let DateOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };

            let dateFormat = result[i].date.toLocaleDateString('en-ZA', DateOptions)
            answer.date = dateFormat;
        }

        console.log('result', result)
        res.render('./products/orders', {
            'result': products


        })
    })
}


module.exports.getSellerDashboard = (req,res,next) => {
    let userId = req.params.id;
    db.query("SELECT orders.*, order_details.*, users.id as customerID,users.username FROM  order_details LEFT JOIN orders ON  order_details.order_id = orders.id LEFT JOIN users ON orders.customer_id = users.id WHERE order_details.seller_id = ?", [userId], function (err, results, fields) {
        if (err) {
            console.log("[mysql error", err)
        }

        //sum total orice
        let price = results.map((price) =>  parseInt(price.product_price, 10))

        
        let totalRevenue = price.reduce((previous, current) => {
            return previous + current
        }, 0)


        //count how many customers
        let customers = results.map((customer) =>  customer.customer_id)
    


        let dupplicate = [];

        let removeDuplicateId = customers.filter((customer) => {

            if (dupplicate.indexOf(customer) === -1) {
                dupplicate.push(customer)
                return true;
            }

            return false;
        })
        let customerTotal = removeDuplicateId.length;


        //style date 
        let products = [];
        for (let i = 0; i < results.length; i++) {
            let answer = results[i]
            results[i].totalPrice = results[i].product_qty * results[i].product_price;
            products.push(results[i])
            let DateOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };

            let dateFormat = results[i].date.toLocaleDateString('en-ZA', DateOptions)
            answer.date = dateFormat;
        }
  
        res.render('./account/all-users/dashboard', {
            "results": products,
            'totalRevenue': totalRevenue,
            'productsSold': results.length,
            'totalCustomers': customerTotal
        });

    })
}



///delete user account from admin dashboard
module.exports.deleteUserAccount = (req,res,next) => {
    let userId = req.params.id;
    //select query avatar from users
    db.query('SELECT users.avatar ,products.user_id,products.image,products.product_file FROM users  LEFT JOIN products ON users.id = products.user_id WHERE users.id = ?', [userId], function (err, results) {
        if (results[0].avatar) {
            fs.unlink('./public/userFiles/userAvatars/' + results[0].avatar, function (err) {
                if (err) {
                    console.log('there a error to delete user avatar ' + err)
                } else {
                    console.log('  user avatart successfully deleted ');
                }
            })
        }
        if (results[0].image) {
            fs.unlink('./public/userFiles/productIMages/' + results[0].image, function (err) {
                if (err) {
                    console.log('there a error to delete user avatar ' + err)
                } else {
                    console.log('  user avatart successfully deleted ');
                }
            })
        }


        if (results[0].product_file) {
            fs.unlink('./public/userFiles/productFile/' + results[0].product_file, function (err) {
                if (err) {
                    console.log('there a error to delete user avatar ' + err)
                } else {
                    console.log('  user avatart successfully deleted ');
                }
            })
        }
        //delete users table               
        db.query("DELETE FROM users where id =  ?", [userId], function (err, result) {
            if (err) throw err;
            console.log('account deleted')

            // delete products table                   
            db.query("DELETE FROM products where products.user_id = ?", [userId], function (err, result) {
                if (err) throw err;
                console.log('account deleted')

            }) // delete products table ends

            // }) //select query products image from users  ends

        }) //delete users table ends

        req.flash('success_msg', {
            msg: ' User Account has been deleted'
        });
        res.redirect('back');
    }) //select query avatar from users  ends

}
