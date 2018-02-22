const csrf = require ('csurf');
 
const csrfProtection = csrf();
module.exports = function (app, passport,upload){


    const indexController = require('../controllers/index');
    const contactController = require('../controllers/contact');
    const productController = require('../controllers/products');
    const usersController = require('../controllers/user');
    const adminController = require('../controllers/admin');
    const cartController = require('../controllers/cart');
   // usersController.ensureAuthenticated
    app.get('/', indexController.index);
    app.get('/admin',usersController.userBasic, adminController.dashboard);
    app.get('/contact',usersController.customer,contactController.getContact); 
    app.post('/contact',contactController.postContact);                                                                          
    app.get('/login', usersController.getLogin);
    app.post('/login' , usersController.postLogin);
    app.get('/logout',  usersController.getLogout);
    app.get('/signup', usersController.getSignup);
    app.post('/signup',usersController.postSignup);
    app.get('/profile',usersController.getProfile);
    app.get('/cart', cartController.getCart);
    app.post('/cart/:id', cartController.postCart);
    app.get('/remove/:id', cartController.getCartItem);
    app.get('/product_stats', productController.products_stats);
    app.get('/products',usersController.userAdvanced, productController.getProducts);
    app.get('/product/add', productController.getPostForm);
    app.post('/product/add', upload.single('avatar'), productController.postProduct);
    app.get('/product/edit/:id', productController.getProductUpdateForm);
    app.post('/product/edit/:id', upload.single('avatar'), productController.editproduct);
    app.post('/product/delete/:id', productController.deleteProduct);
    app.get('/product/:id', productController.getProductDetailPage);
    
}