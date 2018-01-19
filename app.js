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

 // Load environment variables from .env file
    const app = express();
    require('dotenv').config()

//img upload
const upload = multer({
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
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    //checkExpirationInterval: 9000,
   // expiration: 864
  };
 var sessionStore = new MySQLStore(options);
app.use(session({ secret: 'cat', store: sessionStore,resave:false, saveUninitialized:false, /*cookie: { secure: true } */}));
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
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

passport.use(new LocalStrategy(
    function(username, password, done) {
     const db = require('./db.js')
     db.query('SELECT password FROM users WHERE email = ?', [username],function(error,results,fileds){
            if(error) {done(error)};
            if(results.length === 0){
                done(null,false)
            }else{
                const hash = results[0].password.toString();
                
                bcrypt.compare(password,hash,function (error ,response){
                    if(response === true){
                        return done(null, {user_id:results[0].id});
                    }else{
    
                        return done(null, 'false');
                    }
                })
            }
     });
    }
  ));


app.get('/', indexRouter.index);
app.get('/admin', userRouter.ensureAuthenticated, adminRouter.dashboard);
app.get('/login', userRouter.getLogin);
app.get('/logout',  userRouter.getLogout);
app.post('/login',   passport.authenticate('local',{ successRedirect:'/profile',failureRedirect:'/login'}), userRouter.postLogin);
app.get('/signup', userRouter.signup);
app.post('/signup', userRouter.signuppost);
app.get('/profile', userRouter.ensureAuthenticated ,userRouter.profile);
app.get('/posts/add', postsRouter.GetFormPosts);
app.post('/posts/add', upload.single('avatar'), postsRouter.AddPost);
app.get('/posts', postsRouter.postsGet);
app.get('/posts/edit/:id', postsRouter.editPostGet);
app.post('/posts/edit/:id', upload.single('avatar'), postsRouter.editPostUpdate);
app.post('/posts/delete/:id', postsRouter.deletePost);
app.get('/posts/:id', postsRouter.getSinglePost);
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
