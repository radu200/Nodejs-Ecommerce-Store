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
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var methodOverride = require('method-override')


var app = express();
//init upload
var upload = multer({
    dest: 'public/images',
    limits: { fileSize: 10000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('errors: Images Only!');
    }
}
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




app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect-flash
app.use(flash());
//global vars
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.locals.moment = require('moment');
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
// override method
app.use(methodOverride('_method'))

//route files
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

app.get('/', indexRouter.index);
app.get('/users', usersRouter.users);
app.get('/posts', postsRouter.postsGet);
app.post('/posts/add', upload.single('avatar'),postsRouter.AddPost );
app.get('/posts/add', postsRouter.GetFormPosts);
app.get('/posts/edit/:id', postsRouter.editPostGet);
app.post('/posts/edit/:id',upload.single('avatar'), postsRouter.editPostUpdate);
app.delete('/posts/delete/:id', postsRouter.deletePost);



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
