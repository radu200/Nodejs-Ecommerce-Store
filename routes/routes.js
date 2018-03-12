
const csrf = require ('csurf');
const csrfProtection = csrf();
const path = require('path');
const multer = require('multer');
//upload product images

module.exports = function (app, passport){
    
    ///users controllers
    const usersController = require('../controllers/users/user');
    const userProController = require('../controllers/users/userPro');
    const userBasicController = require('../controllers/users/userBasic');
    const customerController = require('../controllers/users/customer');
    //middleware controller
    const accessController = require('../middleware/accesscontrol-middleware');
    
    
    const homeController = require('../controllers/home');
    const contactController = require('../controllers/contact');
    const productController = require('../controllers/products');
    
    const adminController = require('../controllers/admin');
    const cartController = require('../controllers/cart');
    
    
    app.get('/', homeController.getHomePage);
    app.get('/contact',accessController.ensureAuthenticated, contactController.getContact); 
    app.post('/contact',contactController.postContact);    
    
    //routes for all users
    app.get('/delete/account',usersController.getDeleteAccount);    
    app.post('/delete/account',usersController.postDeleteAccount);  
    app.get('/profile',usersController.getProfile);
    app.get('/reset/password',usersController.getResetPassword);
    app.get('/reset/password/email',usersController.getEmailResetPassword);
    
    //sign up and login routes
    app.get('/login', usersController.getLogin,);
    app.post('/login', passport.authenticate('local-login', {
                 //successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }),    
     function(req, res,next) {        
    if(req.user.type =='basic'){
        return res.redirect('/user-basic/profile')
        next();
    }
    if(req.user.type == 'pro'){
        return res.redirect('/user-pro/profile');
        next();
    }
    if(req.user.type == 'customer'){
     return res.redirect('/customer/profile');
     next();
 }
  
            }, usersController.postLogin);
    app.get('/logout',  usersController.getLogout);
    //user basic
    app.get('/user-basic/signup', userBasicController.getSignupUserBasic);
    app.post('/user-basic/signup',userBasicController.postSignupUserBasic);
    app.get('/user-basic/profile',accessController.ensureAuthenticated,accessController.userBasic, userBasicController.getProfileUserBasic );
    app.get('/user-basic/dashboard', userBasicController.getDashboard );
    app.get('/user-basic/settings/profile',accessController.ensureAuthenticated, accessController.userBasic, userBasicController.getSettingsProfile );
    app.post('/user-basic/settings/profile',userBasicImageUpload.single('userBasicAvatar'), userBasicController.postSettingsProfile );
    app.get('/user-basic/settings/email', userBasicController.getSettingsEmail );
    app.get('/user-basic/settings/password', userBasicController.getSettingsPassword);
    app.get('/user-basic/product/add', userBasicController.getProductAdd);
    app.post('/user-basic/product/edit/:id', uploadProductImage.single('productImage'), userBasicController.postProducEdit);
    app.post('/user-basic/product/add', uploadProductImage.single('productImage'),userBasicController.postProductAdd);
    app.get('/user-basic/product/edit/:id', userBasicController.getProductEdit);
    app.get('/user-basic/product/list', userBasicController.getProductList);
    app.delete('/user-basic/product/delete/:id',userBasicController.deleteProductUserBasic);
 
    //user pro
    app.get('/user-pro/signup', userProController.getSignupUserPro);
    app.post('/user-pro/signup',userProController.postSignupUserPro);
    app.get('/user-pro/profile',userProController.getProfileUserPro);
    app.get('/user-pro/dashboard',userProController.getDashboard);
    //customer
    app.get('/customer/signup', customerController.getSignupCustomer);
    app.post('/customer/signup',customerController.postSignupCustomer);
    app.get('/customer/profile',customerController.getProfileCustomer);
    app.get('/customer/settings',customerController.getSettingsCustomer);
    app.post('/customer/settings',customerController.postSettingsCustomer);
    app.get('/customer/password/reset',customerController.getResetPassword); 
    //end
    
    //shopping cart routes
    app.get('/cart', cartController.getCart);
    app.post('/cart/:id', cartController.postCart);
    app.get('/remove/:id', cartController.getCartItem);
    
   //products
    app.get('/product/:id', productController.getProductDetailPage);
    
}
//user bsic product image
const uploadProductImage = multer({
    dest: 'public/userFiles/productImages/',
    //  limits: { fileSize: 1000000000000000000000000000000000},
    
    fileFilter: function(req, file,cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        console.log('file',req.file)
        
        if(req.body.title === ''){
            return cb(null,false)
        }
        if(req.body.description === ''){
            return cb(null,false)
        }
        if(req.body.price === ''){
            return cb(null,false)
        }
        if(req.body.keywords === ''){
            return cb(null,false)
        }
    if (mimetype && extname) {
        console.log(mimetype)
        return cb(null, true);
} else {
    cb(null,false,req.flash('error_msg',{msg:'We only support PNG, GIF, or JPG pictures. '}))
}
}
        
    }); 

  
    
//userBasic avatarimage upload
const userBasicImageUpload = multer({
    dest: 'public/userFiles/userAvatars/',
 //  limits: { fileSize: 1000000000000000000000000000000000},
        fileFilter: function(req, file, cb,res) {
            const filetypes = /jpeg|jpg|png|gif/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            
            if (mimetype && extname) {
                console.log(mimetype)
                return cb(null, true);
        } else {
            
            cb(null,false,req.flash('error_msg',{msg:'We only support PNG, GIF, or JPG pictures. '}))
        }
        }
    }); 
