
;
const RateLimit = require('express-rate-limit');
const csrf = require('csurf')






module.exports = function (app, passport){
    //site controller
    const aboutUsController = require('../controllers/about-us');
    ///user controllers
    const userController = require('../controllers/users/user');
    const userProController = require('../controllers/users/userPro');
    const userBasicController = require('../controllers/users/userBasic');
    const customerController = require('../controllers/users/customer');
    const profileController = require('../controllers/users/profile');
    const paymentController = require('../controllers/payment-api');
    const membershipController = require ('../controllers/users/membership');
    const userDashboardController = require('../controllers/users/dashboard');

    const fileController = require('../controllers/users/files-api')

    //middleware controller
    const accessController = require('../middleware/accesscontrol-middleware');
    const homeController = require('../controllers/home');
    const contactController = require('../controllers/contact');
    const productController = require('../controllers/users/products');
    const adminController = require('../controllers/admin');
    const cartController = require('../controllers/cart');
    const searchController = require('../controllers/search');
    


   ///admin
   app.get('/admin', adminController.getAdminDashboard)
   app.get('/admin/products/check', adminController.getCheckproducts)
   app.post('/admin/product/approve', adminController.postproductApprove);
   app.get('/admin/user/orders/:id', adminController.getUserOrders);
   app.get('/admin/user/dashboard/:id', adminController.getSellerDashboard);
   app.delete('/admin/user/delete/:id', adminController.deleteUserAccount );



    app.get('/about-us', aboutUsController.getaboutUsPage);
    //routes for all user
    app.get('/', homeController.getHomePage);
    app.get('/contact',accessController.ensureAuthenticated, contactController.getContact);
    app.post('/contact',accessController.ensureAuthenticated, contactController.postContact);    
    app.get('/delete/account' , accessController.ensureAuthenticated,userController.getDeleteAccount);    
    app.post('/delete/account',accessController.ensureAuthenticated,userController.postDeleteAccount);
    app.get('/category/:category_name',searchController. getProductByCategory);    
    app.get('/search',searchController.getSearch);    
    app.get('/user/:id',userController.userProfileView)
    app.get('/password/reset',accessController.ensureAuthenticated, userController.getChangePassword)
    app.post('/password/reset',userController.postChangePassword)
    app.get('/email/change',accessController.ensureAuthenticated, userController.getChangeEmail)
    app.post('/email/change',userController.postChangeEmail)

   
   
   
   // forgot password
    app.get('/password/reset/:token',userController.getResetPassword);
    app.post('/password/reset/:token',userController.postResetPassword);
    //check email
    app.get('/account/verify/:token',userController.getVerifyEmail);
    app.get('/email/change/:token',userController.checkEmailToken);

    app.get('/forgot',userController.getForgot);
    app.post('/forgot',userController.postForgot);
    app.get('/dashboard', accessController.ensureAuthenticated,userDashboardController.getDashboard );
    app.get('/orders',accessController.ensureAuthenticated ,userController.getUserOrders );

    //profile
    app.get('/profile', accessController.ensureAuthenticated, profileController.getProfile);
    app.get('/profile/settings',accessController.ensureAuthenticated , profileController.getSettingsProfile );
    app.post('/profile/settings',accessController.ensureAuthenticated , profileController.postSettingsProfile );
    app.get('/profile/settings/avatar' ,fileController.getUploadProfileAvatar)
    app.post('/profile/settings/avatar' , fileController.postUploadProfileAvatar)
  
  
    //product
    app.get('/product/add', accessController.ensureAuthenticated,accessController.userBasicAndPro, productController.getProductAdd);
    app.post('/product/add' ,accessController.ensureAuthenticated, accessController.userBasicAndPro,productController.postProductAdd);
    app.post('/product/edit/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro, productController.postProducEdit);
    app.get('/product/edit/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro, productController.getProductEdit);
    app.get('/product/list',accessController.ensureAuthenticated, accessController.userBasicAndPro, productController.getProductList);
    app.delete('/product/delete/:id',accessController.ensureAuthenticated, accessController.userBasicAndPro,productController.deleteProductUser);
    app.get('/product/:id', productController.getProductDetailPage);
    app.post('/upload/product/image',  fileController.postProductImage )
    app.post('/upload/product/file',  fileController.postProductFile)
  
   app.get('/download/:id', fileController.getDownload )
    //sign up and login routes
    app.get('/login',userController.getLogin,);
    app.post('/login',  userController.postLogin);
    app.get('/logout',  userController.getLogout);
   
    //user basic
    app.get('/user-basic/signup', userBasicController.getSignupUserBasic);
    app.post('/user-basic/signup',userBasicController.postSignupUserBasic);
 
    //user pro
    app.get('/user-pro/signup', userProController.getSignupUserPro);
    app.post('/user-pro/signup',userProController.postSignupUserPro);
    //customer
    app.get('/customer/signup' ,customerController.getSignupCustomer);
    app.post('/customer/signup' ,customerController.postSignupCustomer);

    
    //shopping cart routes
    app.get('/cart', cartController.getCart);
    app.post('/cart/:id', cartController.postCart);
    app.get('/remove/:id', cartController.getCartItem);
    app.post('/charge', accessController.ensureAuthenticated, paymentController.postCharge);
    app.post('/paypal', accessController.ensureAuthenticated, paymentController.postPayPal)
    app.get('/paypal/success', accessController.ensureAuthenticated, paymentController.getPayPalSuccess)
    app.post('/paypal/cancel', accessController.ensureAuthenticated,  paymentController.getPayPalCancel)
   
    app.post('/membership/charge', accessController.ensureAuthenticated, membershipController.postUserProPayment)
    app.get('/membership/charge', accessController.ensureAuthenticated, membershipController.getUserProPayment)
    app.post('/membership/cancel', accessController.ensureAuthenticated,  membershipController.postCancelMembership)
    app.post('/membership/paypal',  accessController.ensureAuthenticated, membershipController.postPaypalMembership)
    app.get('/memebership/paypal/success', membershipController.getPayPaypalMemebershipSuccess)

}





