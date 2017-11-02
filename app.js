var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')
var multer = require('multer');
var session = require('express-session');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var methodOverride = require('method-override')


var app = express();
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');


///express sessions
app.use(session({
    secret: 'kaosjdjfpjajfo090935',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
}));

//connect-flash
app.use(flash());


//global vars
app.locals.moment = require('moment');
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//route files
var index = require('./routes/index');
var posts = require('./routes/posts');
var users = require('./routes/users');
app.use('/', index);
app.use('/posts', posts);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;