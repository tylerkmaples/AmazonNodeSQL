// REQUIRE SQL, INQUIRER, and CLI-TABLE PACKAGES
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// CREATE THE CONNECTION INFORMATION FOR THE SQL DATABASE
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

// CONNECT TO THE MYSQL SERVER AND SQL DATABASE
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to mySQL with id: " + connection.threadId);

});

function read() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var response = res;
        var table = new Table({
            head: ["item id", "product name", "department name", "price ($)", "stock quantity"]
        });
        for (var i = 0; i < response.length; i++){
            table.push(
                // {"item_id" : response[i].item_id},
                // {"product_name" : response[i].product_name}
                [response[i].item_id ,response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
            )
        }

        // table.push(
        //     [res.]
        // ); 
        console.log(table.toString());
        // console.log(response)
    })
};

read();