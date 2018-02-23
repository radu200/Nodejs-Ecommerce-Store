const csrf = require ('csurf');
 
const csrfProtection = csrf();
module.exports = function (app, passport,upload){
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
    app.get('/admin',accessController.ensureAuthenticated,accessController.userPro, adminController.dashboard);
    app.get('/contact',accessController.ensureAuthenticated, contactController.getContact); 
    app.post('/contact',contactController.postContact);    
    
    

    //sign up and login routes
    app.get('/login', usersController.getLogin);
    app.post('/login', usersController.postLogin);
    app.get('/logout',  usersController.getLogout);

    app.get('/signup/user_basic', userBasicController.getSignupUserBasic);
    app.post('/signup/user_basic',userBasicController.postSignupUserBasic);
    app.get('/signup/user_pro', userProController.getSignupUserPro);
    app.post('/signup/user_pro',userProController.postSignupUserPro);
    app.get('/signup/customer', customerController.getSignupCustomer);
    app.post('/signup/customer',customerController.postSignupCustomer);
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
    app.post('/product/add', upload.single('avatar'), productController.postProduct);
    app.get('/product/edit/:id', productController.getProductUpdateForm);
    app.post('/product/edit/:id', upload.single('avatar'), productController.editproduct);
    app.post('/product/delete/:id', productController.deleteProduct);
    app.get('/product/:id', productController.getProductDetailPage);
    
}