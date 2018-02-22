const LocalStrategy   = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require('./database');
const saltRounds = 10;


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('seriliaze',user)
        done(null, user);
        });
        
        passport.deserializeUser(function(user, done) {
            console.log('deseriliza',user)
            done(null, user);
        
       });

    
    passport.use(new LocalStrategy({
        passReqToCallback : true
    },  function(req,username, password, done) {
            db.query('SELECT id,type FROM users WHERE email = ?', [username],function(error,results,fileds){
                if(error) {done(error)};
                //check if email is correct
                if(!results.length ){
                   return done(null, false, req.flash('error_msg' ,{msg:'Your email or password is incorrect. Please try again '}));
                    
                }else{
                    const hash = results[0].password
                    //check if password is correct 
                    bcrypt.compare(password,hash,function (error ,response){
                        if(response === true){
                            //all went fine, user is found
                            return done(null, {user:results[0]});
                        }else{
    
                            return done(null, false,req.flash('error_msg' ,{msg:'Your email or password is incorrect. Please try again '}));
                            
                        }
                    })
                }
            });
        }
    ));
    
}