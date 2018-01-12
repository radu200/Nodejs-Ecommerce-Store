var mysql = require('mysql')

var connection= mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
})
connection.connect(
  function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = 'CREATE TABLE IF NOT EXISTS users('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'title VARCHAR(255),'
            + 'description VARCHAR(255),'
            + 'image VARCHAR(255),'
            + 'UserEmail VARCHAR(100),'
            + "UserPassword VARCHAR(500),"
            + 'UserFirstName VARCHAR(50),'
            + 'UserLastName VARCHAR(50)'
            +  ')';
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });
  });


module.exports = connection;
