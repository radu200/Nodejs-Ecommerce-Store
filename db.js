// var config      = require('./knexfile.js');  
// var env         = 'development';  
// var knex        = require('knex')(config[env]);

// module.exports = knex;

// knex.migrate.latest([config]);
// var config = require('./knexfile');
// var knex = require('knex')(config);
// var bookshelf = require('bookshelf')(knex);

// bookshelf.plugin('virtuals');
// bookshelf.plugin('visibility');

// knex.migrate.latest();

// module.exports = bookshelf;

// var knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host     : 'localhost',
//       user     : 'root',
//       password : '',
//       database : 'nodeproject',
//     }
//   });
  
//   var bookshelf = require('bookshelf')(knex);
  
//   var User = bookshelf.Model.extend({
//     tableName: 'users',
//     hasTimestamps: true,
    
//   });
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
})

connection.connect()

module.exports = connection;