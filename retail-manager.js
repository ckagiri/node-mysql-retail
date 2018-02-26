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

// connect to MySQL and run the function to choose the manager function
connection.connect(function(err) {
  if (err) throw err;
  
  console.log("\n----------------------------------------------------\n");
  console.log(chalk.blue.bold("Welcome to the Manager View of the Parts and Planes Store! \nUse the arrow keys to choose an administrative function."));
  console.log("\n----------------------------------------------------\n");
  
  promptManagerTask();
});

// function for manager to choose a task related to store inventory
function promptManagerTask() {
  
  // set constants for the user interface text
  const VIEW_PRODUCTS = "View products for sale";
  const VIEW_INVENTORY = "View products with low inventory";
  const ADD_INVENTORY = "Update a product's inventory quantity";
  const ADD_PRODUCT = "Add a new product";
  const QUIT = "Quit"
  
  inquirer
  .prompt([
    {
      name: "task",
      type: "list",
      message: "What do you want to do?",
      choices: [VIEW_PRODUCTS, VIEW_INVENTORY, ADD_INVENTORY, ADD_PRODUCT, QUIT]    
    }])
  .then(function(answer) {
    
    // call functions for the chosen task
    switch(answer.task) {
      case VIEW_PRODUCTS:
        viewProducts();
        break;
      case VIEW_INVENTORY:
        viewInventory();
        break;
      case ADD_INVENTORY:
        // need to show the table first to know the item number
        console.log("\n");
        getTable("SELECT * FROM products");
        // TODO: change to ajax/promise
        setTimeout(addInventory, 500);
        break;
      case ADD_PRODUCT:
        addProduct();
        break;
      case QUIT:
        console.log("\n----------------------------------------------------\n");
        console.log(chalk.blue.bold("Thanks for updating the inventory. Enjoy your day!"));
        console.log("\n----------------------------------------------------\n");
        connection.end();
        break;
    }
  });
}
  
  // connect to MySQL and run the function to display the store products
function getTable(query) {
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
    console.log(table.toString());
    console.log("\n");
  });
}

// function to view all the current products
function viewProducts() {
  var query = "SELECT * FROM products";
  getTable(query);
  setTimeout(promptManagerTask, 500);
  console.log("\n");
}
  
// function to view products with low inventory (less than 5 items in stock)
function viewInventory() {
  var query = "SELECT * FROM products WHERE stock_quantity < 5";
  getTable(query);
  setTimeout(promptManagerTask, 500);
  console.log("\n");
}

// function to update the quantity of a particular item
function addInventory() {
  inquirer
  .prompt([
    {
      name: "choice",
      type: "input",
      message: "What is the item number of the product you want to restock?",
      validate: function(value) {
        if ((value >= 1) && (value <= 13)) {
          return true;
        }
        return "Make sure you entered a valid product number.";  
      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many items do you want to add?",
      validate: function(value) {
        var pass = value.match(/^[0-9]*$/g);
        if (pass) {
          return true;
        }
        return "Make sure you entered a valid quantity as a number.";
      }
    }
  ])
  .then(function(answer) {
    
    // query for the ID of the chosen item
    var query = "SELECT * FROM products WHERE item_id = ?";
    var restockProduct = answer.choice;
    
    // need to parse the input string to a number so the value does not just concatenate strings
    var restockQuantity = parseInt(answer.quantity);
    
  connection.query(query,[restockProduct],
    function(error, results) {
      if (error) throw error;
      
      var newQuantity = results[0].stock_quantity + restockQuantity;
      
      // run another query to update the quantity for the chosen item
      var updateQuery = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
      
      connection.query(updateQuery, [newQuantity, restockProduct],
        function(error, results) {
          if (error) throw error;
          console.log("\n----------------------------------------------------\n");
          console.log(chalk.blue.bold("The inventory has been updated. The current quantity is " + newQuantity + "."))
          console.log("\n----------------------------------------------------\n");
        })
        
        getTable("SELECT * FROM products");
      })
      
      setTimeout(promptManagerTask, 500);
      console.log("\n");
    }
  )
}
    
// function to add a completely new product to the database
function addProduct() {
  inquirer
  .prompt([
    {
      name: "name",
      type: "input",
      message: "What is the name of the new product?"
    },
    {
      name: "department",
      type: "list",
      message: "Which department is the product in?",
      choices: ["aircraft", "aircraft parts", "apparel", "avionics", "pilot supplies"] 
    },
    {
      name: "price",
      type: "input",
      message: "What is the price? (Example: Enter $5.69 as 5.69)"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many do we have?",
      validate: function(value) {
        var pass = value.match(/^[0-9]*$/g);
        if (pass) {
          return true;
        }
        return "Make sure you entered a valid quantity as a number.";
      }
    }
  ])
  .then(function(answer) {
    
    // add the new product based on the answers given
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.name,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.quantity
      },
      function(error, results) {
        if (error) throw error;
        console.log("\n----------------------------------------------------\n");
        console.log(chalk.blue.bold("New product " + answer.name + " added."));
        console.log("\n----------------------------------------------------\n");
      }
    );
    
    getTable("SELECT * FROM products");
    setTimeout(promptManagerTask, 500);
    console.log("\n");
  });
  
}