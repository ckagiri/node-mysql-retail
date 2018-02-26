// Create a new Node application called bamazonManager.js. Running this application will:
// 
// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
// If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

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
  console.log("connected");
  promptManagerTask();
});

function promptManagerTask() {
  
  const VIEW_PRODUCTS = "View products for sale";
  const VIEW_INVENTORY = "View low inventory";
  const ADD_INVENTORY = "Add to inventory";
  const ADD_PRODUCT = "Add new product";
  
  inquirer
  .prompt([
    {
      name: "task",
      type: "list",
      message: "What do you want to do?",
      choices: [VIEW_PRODUCTS, VIEW_INVENTORY, ADD_INVENTORY, ADD_PRODUCT]    
    }])
    .then(function(answer) {

      console.log(answer.task);
      switch(answer.task) {
        case VIEW_PRODUCTS:
          viewProducts();
          break;
        case VIEW_INVENTORY:
          viewInventory();
          break;
        case ADD_INVENTORY:
          addInventory();
          break;
        case ADD_PRODUCT:
          addProduct();
          break;
      }
    });
}

function getTable(query) {

  
  connection.query(query, function(error, results) {

    //set up the cli-table2 columns and headings
    var table = new Table({
      head: ["Item number", "Product", "Department", "Number in Stock", "Price"], 
      colWidths: [15, 30, 30, 15, 15]
    });
  
    //populate the cli-table2 and use numeral.js to format into currency values
    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].department_name, results[i].stock_quantity, numeral(results[i].price).format("$0,0.00")]
      );
    }
    console.log(table.toString());

  });
}

function viewProducts() {
  var query = "SELECT * FROM products";
  getTable(query);
  
}

function viewInventory() {
  var query = "SELECT * FROM products WHERE stock_quantity < 5";
  getTable(query);
  
}

function addInventory() {
  // maybe show a list and then a list
  // show prompt to add more of any item

}

function addProduct() {
  // prompt to add new product
}