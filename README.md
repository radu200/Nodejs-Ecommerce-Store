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



```
