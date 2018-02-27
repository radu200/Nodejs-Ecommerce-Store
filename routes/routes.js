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
    
    
    //sign up and login routes
    app.get('/login', usersController.getLogin);
    app.post('/login', usersController.postLogin);
    app.get('/logout',  usersController.getLogout);
    //user basic
    app.get('/signup/user_basic', userBasicController.getSignupUserBasic);
    app.post('/signup/user_basic',userBasicController.postSignupUserBasic);
    app.get('/profile/user_basic', userBasicController.getProfileUserBasic );
    app.get('/dashboard/user_basic', userBasicController.getDashboard );
    app.get('/settings/profile/user_basic', userBasicController.getSettingsProfile );
    app.get('/settings/email/user_basic', userBasicController.getSettingsEmail );
    app.get('/settings/password/user_basic', userBasicController.getSettingsPassword);
    //user pro
    app.get('/signup/user_pro', userProController.getSignupUserPro);
    app.post('/signup/user_pro',userProController.postSignupUserPro);
    app.get('/profile/user_pro',userProController.getProfileUserPro);
    app.get('/dashboard/user_pro',userProController.getDashboard);
    //customer
    app.get('/signup/customer', customerController.getSignupCustomer);
    app.post('/signup/customer',customerController.postSignupCustomer);
    app.get('/profile/customer',customerController.getProfileCustomer);
    app.get('/settings/customer',customerController.getSettingsCustomer);
    app.post('/settings/customer',customerImageUpload.single('avatarCustomer'),customerController.postSettingsCustomer);
    //end
    
    app.get('/profile',usersController.getProfile);
    
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

//customer avatarimage upload
const customerImageUpload = multer({
    dest: 'public/customer',
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
