

# OnlineStore with Node.js 
OnlineStore with Node.js,Mysql,HandleBars

- [Features](#features)
- [Getting Started](#getting-started)
- [Our Goals](#our-goals)
- [Project Structure](#project-structure)
- [Rules](#rules)
- [Some  of the main Packages](#some-of-the-main-packages)
- [How do I create a new page?](#how-do-i-create-a-new-page)
- [Recommended Resources](#recommended-resources)

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/radu200/Nodejs-Ecommerce-Store.git

# Change directory
 cd myproject

# Install NPM dependencies
npm install or yarn install

#create .env file
Create .env file and copy example from .env.example 

#insert sql
Create database and insert ecommerce-store.sql file


# start your app
 node app.js or with nodemon
 
# Run webpack to watch scss and js files
  webpack --watch
  
# For testing run 
   npm test
 ```
 
 Features
--------
- **Local Authentication** using Email and Password
- 3 types of users, customer,user-basic,user-pro
- product details page,
- searh product by name and category,
- payment options with paypal and stripe,
- membership for user-pro 1 month,
- download product,
- Recaptcha implementation
- xss protection
- Flash notifications
- MVC Project Structure
- Sass stylesheets,js files,fonts (auto-compiled via webpack)
- Bootstrap 3.3.7
- Contact Form (powered by Mailgun)
- Email validation on authentication
- **Account Management**
- Seller Dashboard
- Shopping Cart
- Product Managment
- Account Management
- Acess controll middleware
- Change Password
- Forgot Password
- Change email
- Delete Account
- Resposive layout on all devices,
- **Seller Dashboard**
- **Admin Dashboard**


 

Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **config**/passport.js             | Passport Local strategies  login middleware.                 |
| **config**/database.js             | Database Config                                              |
| **controllers**/                   | folder for all controllers                                   |
| **controllers**/contact.js         | Controller for contact form.                                 |
| **controllers**/cart.js            | Controller for  cart.                                        |
| **controllers/users**/             | In this folder are  controllers for all users                |
| **controllers**/products.js        | Controller for product management.                           |
| **middleware**/                    | Folder for  creating middleware                              |
| **controllers**/user.js            | Controller for user account management.                      |
| **controllers**/products.js        | Controller for product management.                           |
| **models**/cart.js                 | Model for cart managment.                                    |
| **public**/                        | Static assets (fonts, css, js, img).                         |
| **public**/dist                    | Static assets (fonts, css, js, img) bundled by webpack       |                    
| **public**/images                  | Here goes products images processed by multer                |
| **src**/assests                    | assests for images                                           |
| **src**/app.js                     | Main file where all the js,scss are imported                 |
| **src**/scss                       | Contains all scss files                                      |
| **src/scss**/main.scss             | Main file where all the scss partials are imported           |
| **test**/                          | In this folder goes all application tests                    |
| **views/account**/                 | Templates for *login,signup,contact, profile*.               |
| **views/products**/                | Templates for product .                                      |
| **views/layout**/main.hbs          | Base template.                                               |
| **views/partials**/                | Partials template.                                           |
| **views/layout**/main.hbs          | Base template.                                               |
| **views**/home.hbs                | Home page template.                                          |
| .env.example                       | example for your API keys,tokens, passwords and database URI.|
| app.js                             | The main application file.                                   |
| package.json                       | NPM dependencies.                                            |
| npm-shrinkwrap.json,yarn-lock      | Contains exact versions of NPM dependencies in package.json. |
| webpack.config.js,postcss.config.js| Webpack Configuration                                        |


------------------------------------------------

Some of the main Packages
----------------

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| multer                          | Multer is a node.js middleware for handling multipart/form-data       |
| passport                        | Passport is authentication middleware for Node.js                     |
| Webpack                         | Webpack is an open-source JavaScript module bundler
| bcrypt-nodejs                   | Library for hashing and salting user passwords.                       |
| dotenv                          | Loads environment variables from .env file.                           |
| express                         | Node.js web framework.                                                |
| body-parser                     | Express 4 middleware.                                                 |
| express-session                 | Express 4 middleware.                                                 |
| morgan                          | Express 4 middleware.                                                 |
| compression                     | Express 4 middleware.                                                 |
| errorhandler                    | Express 4 middleware.                                                 |
| serve-favicon                   | Express 4 middleware offering favicon serving and caching.            |
| express-flash                   | Provides flash messages for Express.                                  |
| express-status-monitor          | Reports real-time server metrics for Express.                         |
| express-validator               | Easy form validation for Express.                                     |
| mocha                           | Test framework.                                                       |
| chai                            | BDD/TDD assertion library.                                            |
| supertest                       | HTTP assertion library.                                               |


<hr>

### How do I create a new page?

A more correct way to be to say "How do I create a new route". The main file `is in routes/routes.js` contains all the routes.
Each route has a callback function associated with it. Sometimes you will see 3 or more arguments
to routes. In cases like that, the first argument is still a URL string, while middle arguments
are what's called middleware. Think of middleware as a door. If this door prevents you from
continuing forward, you won't get to your callback function. One such example:


```
  app.get('/profile', usersController.ensureAuthenticated,usersController.getProfile);
```

It always goes from left to right. A user visits `/profile` page. Then `usersController.ensureAuthenticated` middleware
checks if you are authenticated:

```
middleware is created in controllers/user.js
module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
```

If you are authenticated, you let this visitor pass through your "door" by calling `return next();`. It then proceeds to the
next middleware until it reaches the last argument, which is a callback function that typically renders a template on `GET` requests or redirects on `POST` requests. In this case, if you are authenticated, you will be redirected to *Profile Management* page, otherwise you will be redirected to *Login* page.


```js
module.exports.getProfile = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};
```


Express.js has `app.get`, `app.post`, `app.put`, `app.delete`, but for the most part you will only use the first two HTTP verbs, unless you are building a RESTful API.
If you just want to display a page, then use `GET`, if you are submitting a form, sending a file then use `POST`.

Here is a typical workflow for adding new routes to your application. Let's say we are building
a page that lists all products from database.

**Step 1.** Start by defining a route.
```js
app.get('/product', productController.getProduct);
```

---

**Note:** As of Express 4.x you can define you routes like so:

```js
app.route('/product')
  .get(productController.getProduct)
  .post(productController.postProsuct)
  .put(productController.updateProduct)
  .delete(productController.delete.Product)
```
**Step 3.** Create `product.hbs inside /products folder` .
```html
    <h1> Hello World</h1> 
```

**Step 4.** Create a new controller file called `product.js` inside the *controllers* directory.
```js
/** GET /product**/
 

module.exports.getProduct = (req, res) => {
   res.render('./products/product', {
    title: 'My Product'
  });
};
```

**Step 5.** Import that controller in `routes/routes.js`.
```js
const productController = require('./controllers/product');
```




