module.exports = function (app, passport,upload){

    const indexController = require('./index');
    const productController = require('./products');
    const usersController = require('./user');
    const adminController = require('./admin');
   // usersController.ensureAuthenticated 
    app.get('/', indexController.index);
    app.get('/admin', adminController.dashboard);
    app.get('/product_stats', productController.products_stats);
    app.get('/login', usersController.getLogin);
    app.post('/login',   usersController.postLogin);
    app.get('/logout',  usersController.getLogout);
    app.get('/signup', usersController.getSignup);
    app.post('/signup',usersController.postSignup);
    app.get('/profile',usersController.getProfile);
    app.get('/products', productController.getProducts);
    app.get('/product/add', productController.getPostForm);
    app.post('/product/add', upload.single('avatar'), productController.postProduct);
    app.get('/product/edit/:id', productController.getProductUpdateForm);
    app.post('/product/edit/:id', upload.single('avatar'), productController.editproduct);
    app.post('/product/delete/:id', productController.deleteProduct);
    app.get('/product/:id', productController.getProductDetailPage);

}