

const db = require('../../config/database.js');
//get dashboard
module.exports.getDashboard = function(req, res, next) {
    if(req.user.type === 'basic'){
        userDashboard(req,res,next);
    } else if(req.user.type === 'pro' && req.user.membership_aproved_date < Date.now()){
       res.render('/account/all-users/profile');
    }else if (req.user.type === 'pro' && req.user.membership_aproved_date >= Date.now()){
        userDashboard(req,res,next);     
    }
    
};
 
 
 

function userDashboard (req, res,next){
    let userId = req.user.id;
    db.query("SELECT orders.*, order_details.*, users.id as customerID,users.username FROM  order_details LEFT JOIN orders ON  order_details.order_id = orders.id LEFT JOIN users ON orders.customer_id = users.id WHERE order_details.seller_id = ?" ,[userId] ,function(err, results, fields) {
        if (err) {
            console.log("[mysql error", err)
        }
        
       //sum total orice
       var price = results.map( (price) => {
           return parseInt(price.product_price,10)
       })
         var totalRevenue = price.reduce((previous, current) => {
             return previous + current
         }, 0)


         //count how many customers
         var customers = results.map((customer) => {
             return customer.customer_id
         })
         
         
         var dupplicate = [];
         
         var removeDuplicateId = customers.filter( (customer) => {
             
             if(dupplicate.indexOf(customer) === -1){
                dupplicate.push(customer)
                 return true;
                }
                
                return false;
            })
        var  customerTotal = removeDuplicateId.length;
  

        //style date 
        let products = [];
        for ( let i = 0; i < results.length; i++){
            let answer = results[i]
            results[i].totalPrice = results[i].product_qty * results[i].product_price;
            products.push(results[i])
            let DateOptions = {   
                day: 'numeric',
                month: 'long', 
                year: 'numeric',
                hour:'numeric',
                minute:'numeric'
               };
               
               let dateFormat =  results[i].date.toLocaleDateString('en-ZA', DateOptions)
               answer.date = dateFormat;
        }

        res.render('./account/all-users/dashboard', {
            "results": products,
            'totalRevenue':totalRevenue,
             'productsSold':results.length,
              'totalCustomers':customerTotal
        });

    })
}

