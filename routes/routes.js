
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
    const profileController = require('../controllers/users/profile');


    const userDashboardController = require('../controllers/users/dashboard');
    //middleware controller
    const accessController = require('../middleware/accesscontrol-middleware');
    
    
    const homeController = require('../controllers/home');
    const contactController = require('../controllers/contact');
    const productController = require('../controllers/users/products');
    const adminController = require('../controllers/admin');
    const cartController = require('../controllers/cart');
    
    //routes for all users
    app.get('/', homeController.getHomePage);
    app.get('/contact',accessController.ensureAuthenticated, contactController.getContact);
    app.post('/contact',contactController.postContact);    
    app.get('/delete/account',accessController.ensureAuthenticated,usersController.getDeleteAccount);    
    app.post('/delete/account',accessController.ensureAuthenticated,usersController.postDeleteAccount);  
    app.get('/password/reset',usersController.getResetPassword);
    app.get('password/reset/email',usersController.getEmailResetPassword);
    app.get('/dashboard', accessController.ensureAuthenticated,userDashboardController.getDashboard );
    //profile
    app.get('/profile', accessController.ensureAuthenticated, profileController.getProfile);
    app.get('/profile/settings',accessController.ensureAuthenticated ,profileController.getSettingsProfile );
    app.post('/profile/settings',accessController.ensureAuthenticated ,userAvatar.single('userAvatar'), profileController.postSettingsProfile );
    
    //product
    app.get('/product/add', accessController.ensureAuthenticated,accessController.userBasicAndPro, productController.getProductAdd);
    app.post('/product/add',accessController.ensureAuthenticated, accessController.userBasicAndPro, uploadProductImage.single('productImage'),productController.postProductAdd);
    app.post('/product/edit/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro, uploadProductImage.single('productImage'), productController.postProducEdit);
    app.get('/product/edit/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro, productController.getProductEdit);
    app.get('/product/list',accessController.ensureAuthenticated, accessController.userBasicAndPro, productController.getProductList);
    app.delete('/product/delete/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro,productController.deleteProductUserBasic);
    
    //sign up and login routes
    app.get('/login', usersController.getLogin,);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }), usersController.postLogin);
    app.get('/logout',  usersController.getLogout);

    //user basic
    app.get('/user-basic/signup', userBasicController.getSignupUserBasic);
    app.post('/user-basic/signup',userBasicController.postSignupUserBasic);
 
    //user pro
    app.get('/user-pro/signup', userProController.getSignupUserPro);
    app.post('/user-pro/signup',userProController.postSignupUserPro);
    //customer
    app.get('/customer/signup', customerController.getSignupCustomer);
    app.post('/customer/signup',customerController.postSignupCustomer);

    
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
    
    if (mimetype && extname) {
        console.log(mimetype)
        return cb(null, true);
} else {
    cb(null,false,req.flash('error_msg',{msg:'We only support PNG, GIF, or JPG pictures. '}))
}
}
        
    }); 

  
    
//userBasic avatarimage upload
const userAvatar = multer({
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
