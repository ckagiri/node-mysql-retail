// The app should then prompt users with two messages.
// 
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");
var numeral = require("numeral");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  
  // Your username
  user: "root",
  
  // Your password
  password: "password",
  database: "retailDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  displayProducts();
});

// function which prompts the user for what action they should take
function displayProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function(error, results) {
    
    // instantiate 
    var table = new Table({
      head: ["Item number", "Product", "Price"], 
      colWidths: [15, 30, 15]
    });
    
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, numeral(results[i].price).format("$0,0.00")]
      );
    }
    console.log("Here are the current products available");
    console.log(table.toString());
    
    inquirer
    .prompt([
      {
        name: "asktobuy",
        type: "confirm",
        message: "Do you want to buy anything today?",            
      }])
      .then(function(answer) {
        if (!answer.asktobuy) {
          console.log("Thanks for visiting the store. Come back again soon!");
          connection.end();
          return;
        }
        else {
          buyProduct(results);
        }    
      });
    })
  }
  
  function buyProduct(results) {
    
    // query the database for all items
    inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name);
          }
          return choiceArray;
        },
        message: "What is the ID of the product you want to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you want to buy?",
        validate: function(value) {
          var pass = value.match(/^[0-9]*$/g);
          if (pass) {
            return true;
          }
          return 'Please enter a valid quantity as a numeral';
        }
      }
    ])
    .then(function(answer) {
      
      var customerQuantity = answer.quantity;
      var customerProduct = answer.choice;
      
      var query = "SELECT * FROM products WHERE product_name = ?";
      connection.query(query, [customerProduct],
        function(error, results) {
          if (error) throw error;
          
          if (customerQuantity <= results[0].stock_quantity) {
            var newStockInventory = results[0].stock_quantity - customerQuantity;
            updateInventoryStock(newStockInventory, customerProduct);
            
            var totalPrice = numeral(customerQuantity * results[0].price).format("$0,0.00");
            console.log("Thanks for your order! Your total price is " + totalPrice);
          }
          else {
            //TODO: this is not working if you say Yes to buy something else. It hangs.
            console.log("Oh no, looks like our inventory is too low for you to buy the " + customerProduct + ". We hope you are interested in our other fine aviation products.")
            
          }
        } 
      )
      // var anythingElse = buyAnotherProduct();
      // if (anythingElse) {
      //   console.log("hello");
      //   buyProduct(results);
      // } 
      // else {
      //   console.log("Thanks for visiting the store. Come back again soon!");
      //   connection.end();
      // }
    });
  }
  
  // function to subtract the number of items a customer ordered from the current inventory total in the database
  function updateInventoryStock(inventory, product) {
    var query = "UPDATE products SET stock_quantity = ? WHERE product_name = ?";
    connection.query(query, [inventory, product],
      function(error, results) {
        if (error) throw error;
        console.log(results.affectedRows + " updated!\n");
      }
    );
  }
  
  // function to determine whether a customer wants to continue buying products
  function buyAnotherProduct() {
    
    inquirer
    .prompt([
      {
        name: "buyanythingelse",
        type: "confirm",
        message: "Do you want to buy anything else today?",            
      }])
      .then(function(answer) {
        if (answer.buyanythingelse) {
          return true;
        } 
      });
    }
    