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
  start();
});

// function which prompts the user for what action they should take
function start() {
  
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
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
        
        connection.query(
          "SELECT ? FROM products WHERE ?", 
          [
            {
              product_name: answer.choice
            },
            {
              stock_quantity: customerQuantity
            }
          ],
          function(error) {
            if (error) throw err;
            if (customerQuantity >= stock_quantity) {
              stock_quantity = stock_quantity - customerQuantity;
            }
            else {
              console.log("Oh no, looks like our inventory is too low for you to buy " + chosenItem + ". We hope you are interested in buying our other fine aviation products.")
            }
          } 
        )
      // 
      //   // determine if bid was high enough
      //   if (chosenItem.highest_bid < parseInt(answer.bid)) {
      //     // bid was high enough, so update db, let the user know, and start over
      //     connection.query(
      //       "UPDATE auctions SET ? WHERE ?",
      //       [
      //         {
      //           highest_bid: answer.bid
      //         },
      //         {
      //           id: chosenItem.id
      //         }
      //       ],
      //       function(error) {
      //         if (error) throw err;
      //         console.log("Bid placed successfully!");
      //         start();
      //       }
      //     );
      //   }
      //   else {
      //     // bid wasn't high enough, so apologize and start over
      //     console.log("Your bid was too low. Try again...");
      //     start();
      //   }
      // });
  });
});
}


