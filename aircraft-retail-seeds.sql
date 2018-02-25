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

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("tire", "aircraft parts", 107, 25),
("brake fluid", "aircraft parts", 13.75, 20),
("propeller", "aircraft parts", 4000, 10),
("flashlight", "pilot supplies", 26.75, 30),
("logbook", "pilot supplies", 8.95, 53),
("bomber hat", "apparel", 67.95, 6),
("overhauled engine", "aircraft parts", 23500, 2),
("carburetor", "aircraft parts", 2589.95, 3),
("1976 Cessna 172M", "aircraft", 69990, 1),
("2018 Cessna 172S", "aircraft", 379000, 1),
("white short-sleeved shirt", "apparel", 39.95, 47);


-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("tire", "aircraft parts", 107, 25),
-- ("brake fluid", "aircraft parts", 13.75, 20),
-- ("propeller", "aircraft parts", 4000, 10),
-- ("flashlight", "pilot supplies", 26.75, 30),
-- ("altimeter", "avionics", 5495, 10),
-- ("GPS unit", "avionics", 14965, 2),
-- ("logbook", "pilot supplies", 8.95, 53),
-- ("San Francisco area chart", "charts and maps", 5.25, 123),
-- ("San Francisco airport diagram", "charts and maps", 4.50, 13),
-- ("headset", "pilot supplies", 995.95, 22),
-- ("bomber hat", "clothing", 67.95, 6),
-- ("overhauled engine", "aircraft parts", 23500, 2),
-- ("carburetor", "aircraft parts", 2589.95, 3),
-- ("1976 Cessna 172M", "aircraft", 69990, 1),
-- ("2018 Cessna 172S", "aircraft", 379000, 1),
-- ("white short-sleeved shirt", "apparel", 39.95, 47);