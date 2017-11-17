var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var knex = require('knex');
var methodOverride = require('method-override')
    // Load environment variables from .env file
    
    var app = express();
    require('dotenv').config()

//img upload
var upload = multer({
    dest: 'public/images',
    limits: { fileSize: 10000000},
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
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');





app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'cat', resave: true, saveUninitialized: true }));
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.locals.moment = require('moment');
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//route files
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

app.get('/', indexRouter.index);
app.get('/admin', adminRouter.dashboard);
app.get('/users', usersRouter.users);
app.get('/posts/add', postsRouter.GetFormPosts);
app.post('/posts/add', upload.single('avatar'), postsRouter.AddPost);
app.get('/posts', postsRouter.postsGet);
app.get('/posts/edit/:id', postsRouter.editPostGet);
app.post('/posts/edit/:id', upload.single('avatar'), postsRouter.editPostUpdate);
app.delete('/posts/delete/:id', postsRouter.deletePost);
app.get('/posts/:id', postsRouter.getSinglePost);


// Production error handler
if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
