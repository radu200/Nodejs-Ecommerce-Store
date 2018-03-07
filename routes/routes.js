

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
    
    
    const indexController = require('../controllers/index');
    const contactController = require('../controllers/contact');
    const productController = require('../controllers/products');
    
    const adminController = require('../controllers/admin');
    const cartController = require('../controllers/cart');
    
    
    app.get('/', indexController.index);
    app.get('/admin', adminController.dashboard);
    app.get('/contact',accessController.ensureAuthenticated, contactController.getContact); 
    app.post('/contact',contactController.postContact);    
    
    //routes for all users
    app.get('/delete/account',usersController.getDeleteAccount);    
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
    app.post('/user-basic/settings/profile',userBsicImageUpload.single('userBasicAvatar'), userBasicController.postSettingsProfile );
    app.get('/user-basic/settings/email', userBasicController.getSettingsEmail );
    app.get('/user-basic/settings/password', userBasicController.getSettingsPassword);
    app.get('/user-basic/product/add', userBasicController.getProductAdd);
    app.post('/user-basic/product/add', userBasicController.postProductAdd);
    app.get('/user-basic/product/edit', userBasicController.getProductEdit);
    app.get('/user-basic/product/list', userBasicController.getProductList);
    app.get('/user-basic/product/thumbnails', userBasicController.getProductThumbnails);
 
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
    
    //Products routes
    app.get('/product_stats', productController.products_stats);
    app.get('/products', productController.getProducts);
    app.get('/product/add', productController.getPostForm);
    app.post('/product/add',uploadProductImage .single('avatar'), productController.postProduct);
    app.get('/product/edit/:id', productController.getProductUpdateForm);
    app.post('/product/edit/:id',uploadProductImage.single('avatar'), productController.editproduct);
    app.post('/product/delete/:id', productController.deleteProduct);
    app.get('/product/:id', productController.getProductDetailPage);
    
}

const uploadProductImage = multer({
    dest: 'public/images',
 //  limits: { fileSize: 1000000000000000000000000000000000},
        fileFilter: function(req, file, cb) {
            const filetypes = /jpeg|jpg|png|gif/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            
            if (mimetype && extname) {
                console.log(mimetype)
                return cb(null, true);
        } else {
            cb(new Error("Error: File upload only supports the following filetypes - " + filetypes))
        }
        }
    }); 

//userBasic avatarimage upload
const userBsicImageUpload = multer({
    dest: 'public/user',
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
