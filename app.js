const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const favicon = require('serve-favicon');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
var methodOverride = require('method-override')


const app = express();

// Load environment variables from .env file
require('dotenv').config()


//Passport configuration.
require('./config/passport')(passport);


// multer img upload
const upload = multer({
    dest: 'public/images',
   // limits: { fileSize: 1000000000000000000000000000000000},
        fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
        }
    });
    
    // Check image type
    function checkFileType(file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
    } else {
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes))
    }
    
}
//view engine setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: [
        'views/dashboard/partials-dashboard/',
        'views/partials/'
    ]
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(session({ secret: 'cat', store: sessionStore,resave: true, saveUninitialized: true, /*cookie: { secure: true } */}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.locals.moment = require('moment');
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.success_msg = req.flash('success_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});    



//route files
require('./controllers/routes.js')(app, passport,upload);
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
