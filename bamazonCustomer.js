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
    start();

});

// STARTS BAMAZON BY ASKING IF USER WANTS TO SHOP OR EXIT
function start (){
    inquirer
    .prompt (
        { 
            name: "shopOrExit",
            type: "rawlist",
            message: "Welcome to Bamazon! Would you like to [SHOP] the store or [EXIT]?",
            choices: ["SHOP", "EXIT"]
        }
    )
    .then(function(answer){
        if (answer.shopOrExit.toUpperCase() === "SHOP") {
            shop();
        }
        else {
            connection.end();
        }
    });
};

// GATHERS DATA FROM DATABASE, STORES IT IN VAR RESPONSE, CREATES NEW TABLE THAT LOOPS THROUGH THE RESPONSE AND
// PUSHES THE DATA TO THE TABLE
function read() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var response = res;
        var table = new Table({
            head: ["item id", "product name", "department name", "price ($)", "stock quantity"]
        });
        for (var i = 0; i < response.length; i++){
            table.push(
                [response[i].item_id ,response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
            )
        }
        console.log(table.toString());
    })
};


// UPDATE THE DATABASE
function update (newQuant, id){
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, id], function(err, res){
        console.log("that shit be updated");
        
    })
};


// SHOP ALLOWS USERS TO SEE THE STORE, CHOOSE WHICH ITEM TO BUY, AND BUY IT (IF ENOUGH STOCK_QUANTITY)
function shop () {
    read();
    var choiceArray = [];
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        res.forEach(function(product) {
            choiceArray.push({
                'name': product.product_name,
                'value': product.item_id
            });
        });
        inquirer
        .prompt([{
                name: "choice",
                type: "list",
                message: "Which item would you like to buy?",
                choices: choiceArray
            },
            {
                name: "amount",
                type: "input",
                message: "How many would you like to buy?"
            }
        ])
        .then(function(answer) {
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === answer.choice) {
                    chosenItem = res[i];
                }
            }
            if (chosenItem.stock_quantity < parseInt(answer.amount)) {
                console.log("Sorry, that item is out of stock. Please choose a different item.")
                shop();
            }
            else {
                console.log("================================================================")
                console.log("================================================================")
                console.log("You bought: " + chosenItem.product_name);
                console.log("================================================================")
                console.log("Your total for this purchase is: $" + (chosenItem.price * answer.amount));
                console.log("=================================================================")
                console.log("================================================================")
                var newQuant = parseInt(chosenItem.stock_quantity) - parseInt(answer.amount);
                update(newQuant, chosenItem.item_id);
                
                inquirer
                .prompt ([
                    {
                        name: "action",
                        message: "Would you like to buy another item?",
                        type: "rawlist",
                        choices: ["Yes", "No"]
                    }
                ])
                .then(function(answer){
                    if(answer.action === "Yes") {
                        shop();
                        
                        
                    }
                    else {
                        console.log("Thank you! Come again!")
                        connection.end(); 
                    }
                });
            };
        })
    })
};
