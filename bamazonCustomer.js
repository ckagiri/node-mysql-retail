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
      head: ["Item number", "Product", "Price", "Inventory"], 
      colWidths: [15, 30, 15, 15]
    });
    
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, "$" + results[i].price, results[i].stock_quantity]
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
      // var item;
      // // get the information of the chosen item
      // for (var i = 0; i < results.length; i++) {
      //   if (results[i].item_name === answer.choice) {
      //   item = results[i];
      //     console.log("hello " + results[i]);
      //             console.log("item variable is " + item);
      //   }
      // }
      var customerQuantity = answer.quantity;
      
      
      var query = "SELECT * FROM products WHERE item_id = ?";
      // console.log(results.stock_quantity);
      
      connection.query(query, [answer.choice],
        function(error, results) {
          if (error) throw error;
          console.log(results.stock_quantity)
          if (customerQuantity <= results.stock_quantity) {
            results.stock_quantity = results.stock_quantity - customerQuantity;
            console.log("Thanks for your order! Your total price is $" + customerQuantity * results.price);
            console.log(results.stock_quantity)
          }
          else {
            console.log("Oh no, looks like our inventory is too low for you to buy the " + answer.choice + ". We hope you are interested in buying our other fine aviation products.")
          }
        } 
      )
      
    });
  }
  
  // function endShopping(answer) {
  //   if (!answer.asktobuy) {
  //     console.log("Thanks for visiting the store. Come back again soon!");
  //     return;
  //   }
  // }
