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
            name: "managerStuff",
            type: "list",
            message: "Hello. Would you like to [VIEW PRODUCTS] for sale, [VIEW LOW] inventory, [REPLENISH] low inventory, [ADD NEW] product, or [EXIT]?",
            choices: ["VIEW PRODUCTS", "VIEW LOW", "REPLENISH", "ADD NEW", "EXIT"]
        }
    )
    // WHICHEVER USER CHOOSES, IT RUNS THE APPROPRIATE FUNCTION
    .then(function(answer){
        if (answer.managerStuff.toUpperCase() === "VIEW PRODUCTS") {
            viewProducts();
        }
        else if (answer.managerStuff.toUpperCase() === "VIEW LOW"){
            checkArray = [];
            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
                if (err) throw err;
                res.forEach(function(product) {
                    checkArray.push({
                        'name': product.product_name,
                        'value': product.item_id
                    });
                });
                if (checkArray === undefined || checkArray.length == 0) {
                    console.log("================================================")
                    console.log("You do not have any items with low enough stock");
                    console.log("================================================")
                    start();
                }
                else {
                    viewLow();
                }
            });    
        }
        else if (answer.managerStuff.toUpperCase() === "REPLENISH") {
            checkArray = [];
            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
                if (err) throw err;
                res.forEach(function(product) {
                    checkArray.push({
                        'name': product.product_name,
                        'value': product.item_id
                    });
                });
                if (checkArray === undefined || checkArray.length == 0) {
                    console.log("================================================")
                    console.log("You do not have any items with low enough stock");
                    console.log("================================================")
                    start();
                }
                else {
                    replenish();
                }
            });    

        }
        else if (answer.managerStuff.toUpperCase() === "ADD NEW") {
            addNew();
        }
        else if (answer.managerStuff.toUpperCase() === "EXIT"){
            console.log("Bye!");
            connection.end();
        }
    });
};

// UPDATE THE STOCK
function update(newStock, id, name) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newStock, id], function(err, res){
        if (err) throw err;
        console.log("You added " + newStock + " to " + name + "'s stock.")
        start();
    })
    
}

// VIEW PRODUCTS FOR SALE
function viewProducts (){
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
        start();
    })
};

// VIEW LOW STOCK
function viewLow(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
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
        start();
    })
}

// REPLENISH LOW STOCK
function replenish (){
    var choiceArray = [];
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if (err) throw err;
        res.forEach(function(product) {
            choiceArray.push({
                'name': product.product_name,
                'value': product.item_id
            });
        });
        inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                message: "Which item's stock would you like to replenish?",
                choices: choiceArray
            },
            {
                name: "amount",
                type: "input",
                message: "How much are you wanting to replenish?"
            }
        ])
        .then(function(answer){
            var chosenItem;
            for (var i = 0; i < res.length; i++){
                if (res[i].item_id === answer.choice) {
                    chosenItem = res[i];
                    var newStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.amount)
                    update(newStock, chosenItem.item_id, chosenItem.product_name);
                }
            }
        })
        
    })
}

// ADD NEW PRODUCT 
function addNew(){
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "What is the new product's name?"
        },
        {
            name: "department",
            type: "input",
            message: "What department would you like to put this in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much does this product cost?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How much of this item would you like to add?"
        }
    ])
    .then(function(answer){
        connection.query("INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: parseInt(answer.price),
          stock_quantity: parseInt(answer.quantity)
        },
        function(err, res){
            console.log("Aded that!")
            start();
        })
    })
}