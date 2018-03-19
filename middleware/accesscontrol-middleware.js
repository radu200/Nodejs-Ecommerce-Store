

//Login required middleware
module.exports.ensureAuthenticated = function  (req, res, next) {  
    if (req.isAuthenticated()) {
        next();
    }else{
        
        res.redirect('/login')
    }
    
};

/// middleware for user access controll
module.exports.userBasic = function (req,res,next){
    if(req.user.type === 'basic'){
        return next();
    }else{
        res.redirect('/login')
    }
}

module.exports.userPro = function (req,res,next){
    if(req.user.type === 'pro'){
        return next();
    }else{
        res.redirect('/login')
    }
}
module.exports.customer = function (req,res,next){
    if(req.user.type === 'customer'){
        return next();
    }else{
        res.redirect('/login')
    }
}

module.exports.userBasicAndPro = function (req,res,next){
    if(req.user.type === 'basic'){
        return next();
    }else if (req.user.type === 'pro'){
        return next();
    }else {
        res.redirect('/login')
    }
}
