const db = require('../../config/database.js');
//get dashboard
module.exports.getDashboard = function(req, res, next) {
    if(req.user.type === 'basic'){
        userDashboard(req,res,next);
    } else if (req.user.type === 'pro'){
        userDashboard(req,res,next);
    } else if (req.user.type === 'customer'){
        res.render('./account/customer/profile');
    }else{
        res.redirect('/login');
     }
  
};


function userDashboard (req, res,next){
    let userId = req.user.id;
    db.query("SELECT * FROM  users where id = ?" ,[userId] ,function(err, results, fields) {
        if (err) throw err;
        res.render('./account/all-users/dashboard', {
            "results": results[0]
        });

    })
}

