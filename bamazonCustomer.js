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


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  
  // Your username
  user: "root",
  
  // Your password
  password: "password",
  database: "bamazon"
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
  connection.query(query, function(err, results) {
    
    // instantiate 
    var table = new Table({
      head: ["Item number", "Product", "Price"], 
      colWidths: [15, 30, 15]
    });
    
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, "$" + results[i].price]
      );
    }
    
    console.log(table.toString());
    
  });
}

function start() {
  
  // query the database for all items being auctioned
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
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
            console.log(results[i]);
          }
        }
        var customerQuantity = answer.quantity;
        console.log(customerQuantity);
        console.log(answer);

        var item = answer.choice;
        var query = "SELECT * FROM products WHERE ?"
        
        connection.query(query, [item, customerQuantity], 
          function(error, res) {
            console.log(res.stock_quantity)
            if (customerQuantity <= res.stock_quantity) {
              res.stock_quantity = res.stock_quantity - customerQuantity;
              console.log("Thanks for your order! Your total price is $" + quantity * res.price);
              console.log(res.stock_quantity)
            }
            else {
              console.log("Oh no, looks like our inventory is too low for you to buy the " + item + ". We hope you are interested in buying our other fine aviation products.")
            }
          } 
        )
  });
}

