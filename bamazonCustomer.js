// REQUIRE SQL AND INQUIRER PACKAGES
var mysql = require("mysql");
var inquirer = require("inquirer");

// CREATE THE CONNECTION INFORMATION FOR THE SQL DATABASE
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

// CONNECT TO THE MYSQL SERVER AND SQL DATABASE
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected to mySQL with id: " + connection.threadId);

});

function read(){
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
        console.log(res);
    })
};

read();