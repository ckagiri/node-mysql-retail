DROP DATABASE IF EXISTS retailDB;
CREATE DATABASE retailDB;

USE retailDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100),
  price DECIMAL(10,2),
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, stock_quantity, price)
VALUES 
("brake fluid", "aircraft parts", 20, 13.75),
("propeller", "aircraft parts", 10, 4000),
("flashlight", "pilot supplies", 30, 26.75),
("white short-sleeved shirt", "apparel", 47, 39.95),
("logbook", "pilot supplies", 53, 8.95),
("GPS unit", "avionics", 2, 14965),
("overhauled engine", "aircraft parts", 2, 23500),
("carburetor", "aircraft parts", 3, 2589.95),
("1976 Cessna 172M", "aircraft", 1, 69990),
("2018 Cessna 172S", "aircraft", 1, 379000);