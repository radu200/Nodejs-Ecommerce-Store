const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const favicon = require('serve-favicon');
const logger = require('morgan');
const csrf = require('csurf')
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const lusca = require('lusca');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const helmet = require('helmet')
const RateLimit = require('express-rate-limit');
const accessController = require('./middleware/accesscontrol-middleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();

// const csrfProtection = csrf();     

// Load environment variables from .env file
require('dotenv').config({ path: '.env' })


//Passport configuration.
require('./config/passport')(passport);



//view engine setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: [
        'views/partials/',
    ]
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use( helmet.hidePoweredBy() ) ;
app.use(methodOverride('_method'))


const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    //checkExpirationInterval: 9000,
    // expiration: 864
};
const sessionStore = new MySQLStore(options);
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    store: sessionStore,
    resave:false, //session will be saved each time no matter if exist or not
    saveUninitialized: false,  //if it's true session will be stored on server no matter if is something there
    cookie: {  // secure: true, //httpOnly: true,// domain: 'example.com',  //path: 'foo/bar',  expires: expiryDate
},
unset: 'destroy'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.locals.moment = require('moment');
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
 
    next();
});    

///middleware to restrict access in ui in dependece of user
app.use(function(req, res, next) {
    if(req.isAuthenticated() === true){
   res.locals.userCustomer = function(){
       if(req.user.type === 'customer'){
           return true;
           nex()
       }else{
           return false;
           res.redirect('/login');
       }
   }

   res.locals.userBasic = function(){
    if(req.user.type === 'basic'){
        return true;
    }else{
        return false;
        res.redirect('/login');
    }
}
res.locals.userPro = function(){
    if(req.user.type === 'pro'){
        return true;
        next()
    }else{
        return false;
        res.redirect('/login');
    }
};
    }
    next();
  });

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(csrf({cookie:true}))
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// //limit ip request
// // var limiter = new RateLimit({
// //     windowMs: 15*60*1000, // 15 minutes
// //     max: 1, // limit each IP to 100 requests per windowMs
// //     delayMs: 0 // disable delaying - full speed until the max limit is reached
// //   });
   
//   //  apply to all requests
//  app.use(limiter);




//route files
require('./routes/routes.js')(app, passport);
// Production error handler
if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}
if(!module.parent){
    app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
};

module.exports = app;
