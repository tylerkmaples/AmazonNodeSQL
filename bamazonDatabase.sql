CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name TEXT NOT NULL,
    department_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Isopure Zero Carb Protein Powder",
    "Health",
    25,
    100
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Playstation 4",
    "Entertainment",
    333,
    70
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Hydroflask 64oz Black",
    "Sports",
    57,
    24
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Stance Socks",
    "Clothing",
    15,
    90
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Shoyoroll Jiujitsu Gi",
    "Sports",
    250,
    40
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "FYRE Festival VIP Tickets",
    "Music",
    15000,
    10
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Siracha",
    "Food",
    10,
    150
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "AirPods",
    "Electronics",
    180,
    5
    );
INSERT INTO products (
	product_name, 
    department_name, 
    price, 
    stock_quantity) VALUES (
    "Kitten Mittens",
    "Pets",
    20,
    75
    );
INSERT INTO products (
	product_name,
    department_name,
    price,
    stock_quantity) VALUES (
    "Futurama Box Set",
    "Entertainment",
    100,
    65
    );


SELECT * FROM products






