# Command-line retail inventory

This is a command-line Node.js and MySQL app for buying and tracking retail inventory for an aircraft parts and supplies store. 

## Set up and installation

These must be installed to access the store:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)
- [MySQL](https://www.mysql.com/)

You need to make your own copy of the MySQL database to run this app. Use `retail-seeds.sql` to create an initial database. Then, in `retail-customer.js` and `retail-manager.js`, enter the connection information and credentials to your database.

## Customer and manager database views

This app provides a view into the store database from the perspective of both customers and store managers.

_Note: You may need to widen your terminal window to see the entire table properly formatted._

### Enter the store as a customer

As a customer, you can view information about available products and purchase items in stock.

In a terminal window, navigate into the folder where you downloaded this app, and type `npm install`. Then, type `node retail-customer.js`.

![Screen recording of buying products](customer-view.gif)

You will see a table of the current products available for purchase, which represents the data stored in a MySQL database. Following the prompts, type the item number of the product you want to buy and the quantity. 

If there is enough inventory available in the store, you can buy the product and see your total cost. The quantity in the database is updated to reflect your purchase.

Unfortunately, if the store does not have enough of the item to fill your order, your purchase will be declined. 

You can type `Q` to leave the store at any prompt.

### Update product information as a manager

As a manager, you can view the current inventory, see which products are low in stock, and add new products to the store database.

In a terminal window, navigate into the folder where you downloaded this app and type `node retail-manager.js`.

Use the arrow keys to navigate the menu of administrative options.

![Screen recording of managing products](manager-view.gif)

## Technology

- JavaScript
- Node.js
- npm, including [inquirer](https://www.npmjs.com/package/inquirer), [node-mysql](https://www.npmjs.com/package/node-mysql), [cli-table2](https://www.npmjs.com/package/cli-table2) and [chalk](https://www.npmjs.com/package/chalk) packages