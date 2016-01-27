var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'paul',
  password : 'password',
  database : 'zoo_db'
});

connection.connect(function(err) {
  if(err) {
    console.error("err connection " + err.stack);
    return;
  }
});

prompt.start();
prompt.message = "";