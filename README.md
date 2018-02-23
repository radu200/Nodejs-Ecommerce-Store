
 ##                                JOIN ME.A PROJECT FOR JUNIOR BY JUNIOR

#                                       OnlineStore with Node.js 
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
Create database and insert nodeproject.sql

#create .env file and put your credential

# start your app
 node app.js or with nodemon
 ```
 
 Features
--------
- **Local Authentication** using Email and Password
- Flash notifications
- MVC Project Structure
- Sass stylesheets,js files,fonts (auto-compiled via webpack)
- Bootstrap 3.3.7
- Contact Form (powered by Mailgun )
- **Account Management**
- Dashboard
- Shopping Cart
- Product Managment
- Acess controll middleware

 Our Goals
 ------------
 - Three types of users Basic,UserPro,Customer for each user dashboard and profile
 - Profile Details
 - Change Password
 - Forgot Password
 - Reset Password
  -Delete Account
  -Search Bar Functionality
 - CSRF protection
 - Recaptcha implementation for login and signup 
 - Product managment.UserBasic and UserPro have to be able manage their product add,edit delete.
 - Stripe and Paypal implementation
 - Docker implimentations
 
 Rules
 ---------------------------------
- Comment Your Code
- Desirable to use ECMAScript 6 syntax,promises and tests
- Please write your code as readable and maintainable as possible
- Ask if you are stack.
 
Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **config**/passport.js             | Passport Local strategies  login middleware.                 |
| **config**/database.js             | Database Config                                              |
| **controllers**/admin.js           | Controller for dashboard.                                    |
| **controllers**/contact.js         | Controller for contact form.                                 |
| **controllers**/cart.js            | Controller for  cart.                                        |
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
| **views/dashboard**/               | Templates for dashboard.                                     |
| **views/products**/                | Templates for product .                                      |
| **views/layout**/main.hbs          | Base template.                                               |
| **views/partials**/                | Partials template.                                           |
| **views/layout**/main.hbs          | Base template.                                               |
| **views**/index.hbs                | Home page template.                                          |
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

  app.get('/profile', usersController.ensureAuthenticated,usersController.getProfile);
```

It always goes from left to right. A user visits `/profile` page. Then `usersController.ensureAuthenticated` middleware
checks if you are authenticated:

``middleware is created in controllers/user.js
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
a page that lists all books from database.

**Step 1.** Start by defining a route.
```js
app.get('/product', productController.getProduct);
```

---

**Note:** As of Express 4.x you can define you routes like so:

```js
app.route('/product')
  .get(bookController.getProduct)
  .post(bookController.postProsuct)
  .put(bookController.updateProduct)
  .delete(bookController.delete.Product)
```
**Step 3.** Create `product.hbs inside /products folder` .
```/** <h1> Hello World</h1> **/
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
### Recommended Resources
**hackathon-starter**
https://github.com/sahat/hackathon-starter
**Brad Traversy**
https://github.com/bradtraversy


