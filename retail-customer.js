// add required npm package references
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");
var numeral = require("numeral");
var chalk = require("chalk");

// create the connection information to the MySQL database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "retailDB"
});

// connect to MySQL and run the function to display the store products
connection.connect(function(err) {
  if (err) throw err;
  displayProducts();
});

function getTable() {
  
  // select all in the products table
  var query = "SELECT * FROM products";
  
  connection.query(query, function(error, results) {
    
    //set up the cli-table2 columns and headings
    var table = new Table({
      head: ["Item", "Product", "Department", "In Stock", "Price"], 
      colWidths: [10, 30, 20, 10, 15]
    });
    
    //populate the cli-table2 and use numeral.js to format into currency values
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].department_name, results[i].stock_quantity, numeral(results[i].price).format("$0,0.00")]
      );
    }
    
    console.log("\nHere are our current products.")
    console.log(table.toString());
    console.log("\n");
    return results;
  });
}

// function that displays products as a table and asks if the user wants to buy anything
function displayProducts() {
  
  // show welcome text and the table
  console.log("\n----------------------------------------------------\n");
  console.log(chalk.blue.bold("Welcome to the Parts and Planes Store! \nFollow the prompts to purchase, or press the Q key to leave the store."));
  console.log("\n----------------------------------------------------\n");
  
  var startInput = getTable();
  
  // TODO: change to ajax/promise
  setTimeout(buyProduct, 500);
}

// function to ask the user which product and quantity to buy
function buyProduct(results) {
  
  inquirer
  .prompt([
    {
      name: "choice",
      type: "input",
      message: "What is the item number of the product you want to buy?",
      validate: function(value) {  
        if ((value === "q") || (value === "Q")) {
          quit();
        }
        else if ((value >= 1) && (value <= 10)) {
          return true;
        }
        return "Make sure you entered a valid product number.";
      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many do you want to buy?",
      validate: function(value) {
        if ((value === "q") || (value === "Q")) {
          quit();
        }
        var pass = value.match(/^[0-9]*$/g);
        if (pass) {
          return true;
        }
        return "Make sure you entered a valid quantity as a number.";
      }
    }
  ])
  .then(function(answer) {
    
    // select in the products table where the item_id is a placeholder for the user's item number
    var query = "SELECT * FROM products WHERE item_id = ?";
    var customerProduct = answer.choice;
    var customerQuantity = answer.quantity;
    
    connection.query(query, [customerProduct],
      function(error, results) {
        
        if (error) throw error;
        
        // if the desired quantity is less than the number in stock, reduce the inventory by the desired amount and calculate the user's total price.
        if (customerQuantity <= results[0].stock_quantity) {
          var newStockInventory = results[0].stock_quantity - customerQuantity;
          updateInventoryStock(newStockInventory, customerProduct);
          
          var totalPrice = numeral(customerQuantity * results[0].price).format("$0,0.00");
          console.log("\n----------------------------------------------------\n");
          console.log(chalk.blue.bold("Thanks for your order! Your total price is " + totalPrice));
          console.log("\n----------------------------------------------------\n");
          
          var startInput = getTable();
          
          // ask if the user wants to buy anything else
          setTimeout(buyAnotherProduct, 500);
        }
        
        // if the user wants more than available in stock, then the order cannot be fulfilled.
        else {
          console.log("\n----------------------------------------------------\n");
          console.log(chalk.blue.bold("Oh no, looks like our inventory is too low for you \nto buy that quantity. We hope to have more in stock soon."))
          console.log("\n----------------------------------------------------\n");
          
          var startInput = getTable();
          
          // ask if the user wants to buy anything else
          setTimeout(buyAnotherProduct, 500);
        }
      } 
    )
  });
}

// function to subtract the number of items a customer ordered from the current inventory total in the database
function updateInventoryStock(inventory, product) {
  var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
  connection.query(query, [inventory, product],
    function(error, results) {
      if (error) throw error;
    }
  );
}

// function to determine whether a customer wants to continue buying products
function buyAnotherProduct(results) {
  
  inquirer
  .prompt([
    {
      name: "buyanythingelse",
      type: "confirm",
      message: "Do you want to buy anything else today?",
      validate: function(value) {
        if ((value === "q") || (value === "Q")) {
          quit();
        }
      }            
    }])
  .then(function(answer) {
    if (answer.buyanythingelse) {
      buyProduct(results);
    } 
    else {
      quit();
    }
  });
}

// function to quit the app
function quit() {
    console.log("\n \n----------------------------------------------------\n");
    console.log(chalk.blue.bold("Thanks for visiting the store. Come back again soon!"));
    console.log("\n----------------------------------------------------\n");
    connection.end();
    process.exit();
}  