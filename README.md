# OnlineStore with Node.js 
OnlineStore with Node.js,Mysql,HandleBars

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
| **public/images                    | Here goes products images processed by multer                |
| **src/assests                      | assests for images                                           |
| **src/app.js                       | Main file where all the js,scss are imported                 |
| **src/scss                         | Contains all scss files                                      |
| **src/scss/main.scss               | Main file where all the scss partials are imported           |
| **test/                            | In this folder goes all application tests                    |
| **views/account**/                 | Templates for *login,signup,contact, profile*.               |
| **views/dashboard**/               | Templates for dashboard.                                     |
| **views/products**/                | Templates for product .                                      |
| **views/layout/main.hbs            | Base template.                                               |
| **views/partials/                  | Partials template.                                           |
| **views**/layout.pug               | Base template.                                               |
| **views**/home.pug                 | Home page template.                                          |
| .env.example                       | example for your API keys,tokens, passwords and database URI.|
| app.js                             | The main application file.                                   |
| package.json                       | NPM dependencies.                                            |
| npm-shrinkwrap.json,yarn-lock      | Contains exact versions of NPM dependencies in package.json. |
| webpack.config.js,postcss.config.js| Webpack Configuration                                        |

------------------------------------------------



List of Packages
----------------

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| async                           | Utility library that provides asynchronous control flow.              |
| bcrypt-nodejs                   | Library for hashing and salting user passwords.                       |
| cheerio                         | Scrape web pages using jQuery-style syntax.                           |
| clockwork                       | Clockwork SMS API library.                                            |
| connect-mongo                   | MongoDB session store for Express.                                    |
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
| fbgraph                         | Facebook Graph API library.                                           |
| github                          | GitHub API library.                                                   |
| pug (jade)                      | Template engine for Express.                                          |
| lastfm                          | Last.fm API library.                                                  |
| instagram-node                  | Instagram API library.                                                |
| lob                             | Lob API library                                                       |
| lusca                           | CSRF middleware.                                                      |
| mongoose                        | MongoDB ODM.                                                          |
| node-foursquare                 | Foursquare API library.                                               |
| node-linkedin                   | LinkedIn API library.                                                 |
| node-sass-middleware            | Sass middleware compiler.                                                 |
| nodemailer                      | Node.js library for sending emails.                                   |
| passport                        | Simple and elegant authentication library for node.js                 |
| passport-facebook               | Sign-in with Facebook plugin.                                         |
| passport-github                 | Sign-in with GitHub plugin.                                           |
| passport-google-oauth           | Sign-in with Google plugin.                                           |
| passport-twitter                | Sign-in with Twitter plugin.                                          |
| passport-instagram              | Sign-in with Instagram plugin.                                        |
| passport-local                  | Sign-in with Username and Password plugin.                            |
| passport-linkedin-oauth2        | Sign-in with LinkedIn plugin.                                         |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies.    |
| paypal-rest-sdk                 | PayPal APIs library.                                                  |
| request                         | Simplified HTTP request library.                                      |
| stripe                          | Offical Stripe API library.                                           |
| tumblr.js                       | Tumblr API library.                                                   |
| twilio                          | Twilio API library.                                                   |
| twit                            | Twitter API library.                                                  |
| lodash                          | Handy JavaScript utlities library.                                    |
| validator                       | Used in conjunction with express-validator in **controllers/api.js**. |
| mocha                           | Test framework.                                                       |
| chai                            | BDD/TDD assertion library.                                            |
| supertest                       | HTTP assertion library.                                               |

Useful Tools and Resources
--------------------------
