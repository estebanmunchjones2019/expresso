# Expresso

A full-stack **SERN** (SQL, [Express](https://www.npmjs.com/package/express), [React](https://github.com/facebook/react) and [Node](https://nodejs.org/en/)) App that allows user to:
- Create, view, update, and delete menus
- Create, view, update, and delete menu items
- Create, view, update, and delete employees
- Create, view, update, and delete employee's timesheets

To view all of this functionality in action, you can download and watch [this video]( https://s3.amazonaws.com/codecademy-content/programs/build-apis/solution-videos/Expresso480.mov).

**The files coded by the author are:** `migration.js` , `server.js`, and all the files located inside `./api` folder; basically, all the **API endpoints**, which interact with the database. **The remaining project files were NOT coded by the author.**


## Table of contents

* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Database Table Properties](#database-table-properties)
* [API Features](#api-features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)



## General info

This project was coded to learn how to write API endpoints with [Express](https://www.npmjs.com/package/express) and interact with a SQL database via [sqlite3](https://www.npmjs.com/package/sqlite3) npm package.



## Screenshots

Image#1: Home screen

![home-screen](./src/assets/1.jpg)



Image#2: Menus screen

![home-screen](./src/assets/2.png)



Image#3: Employees screen

![home-screen](./src/assets/3.png)



## Technologies

* [React](https://github.com/facebook/react) - version 15.6.1,
* [Express](https://www.npmjs.com/package/express) -version 4.17.1,
* [Sqlite3](https://www.npmjs.com/package/sqlite3)  -version 4.1.1,
* [Node](https://nodejs.org/en/) -version 12.16.1



## Setup

* **Clone or download the repo.**

* **Install all the dependencies** listed on the`package.json` , `server.js`, file by running:

  ```bash
  npm install
  ```

* **Serve the app**

  ```bash
  npm start
  ```

* Now the app is served on https://localhost:4000.

* If you want to **pre-populate the database** with some dummy data, run `seed.js` file:

  ````
  node seed
  ````

* To **test the endpoints**:

  ```
  npm test
  ```

   You will see a list of tests that ran with information about whether or not each test passed. After this list, you will see more specific output about why each failing test failed.



## Database Table Properties

* **Employee**
  - id - Integer, primary key, required
  - name - Text, required
  - position - Text, required
  - wage - Integer, required
  - is_current_employee - Integer, defaults to `1`

* **Timesheet**
  - id - Integer, primary key, required
  - hours - Integer, required
  - rate - Integer, required
  - date - Integer, required
  - employee_id - Integer, foreign key, required

* **Menu**
  - id - Integer, primary key, required
  - title - Text, required

* **MenuItem**
  - id - Integer, primary key, required
  - name - Text, required
  - description - Text, optional
  - inventory - Integer, required
  - price - Integer, required
  - menu_id - Integer, foreign key, required



## API Features

**`/api/employees`**

- GET
  - Returns a 200 response containing all saved currently-employed employees (`is_current_employee` is equal to `1`) on the `employees` property of the response body
- POST
  - Creates a new employee with the information from the `employee` property of the request body and saves it to the database. Returns a 201 response with the newly-created employee on the `employee` property of the response body
  - If any required fields are missing, returns a 400 response

**`/api/employees/:employeeId`**

- GET
  - Returns a 200 response containing the employee with the supplied employee ID on the `employee` property of the response body
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- PUT
  - Updates the employee with the specified employee ID using the information from the `employee` property of the request body and saves it to the database. Returns a 200 response with the updated employee on the `employee` property of the response body
  - If any required fields are missing, returns a 400 response
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- DELETE
  - Updates the employee with the specified employee ID to be unemployed (`is_current_employee` equal to `0`). Returns a 200 response.
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response

**`/api/employees/:employeeId/timesheets`**

- GET
  - Returns a 200 response containing all saved timesheets related to the employee with the supplied employee ID on the `timesheets` property of the response body
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- POST
  - Creates a new timesheet, related to the employee with the supplied employee ID, with the information from the `timesheet` property of the request body and saves it to the database. Returns a 201 response with the newly-created timesheet on the `timesheet` property of the response body
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response

**`/api/employees/:employeeId/timesheets/:timesheetId`**

- PUT
  - Updates the timesheet with the specified timesheet ID using the information from the `timesheet` property of the request body and saves it to the database. Returns a 200 response with the updated timesheet on the `timesheet` property of the response body
  - If any required fields are missing, returns a 400 response
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
  - If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the timesheet with the supplied timesheet ID from the database. Returns a 204 response.
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
  - If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response

**`/api/menus`**

- GET
  - Returns a 200 response containing all saved menus on the `menus` property of the response body
- POST
  - Creates a new menu with the information from the `menu` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu on the `menu` property of the response body
  - If any required fields are missing, returns a 400 response

**`/api/menus/:menuId`**

- GET
  - Returns a 200 response containing the menu with the supplied menu ID on the `menu` property of the response body
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- PUT
  - Updates the menu with the specified menu ID using the information from the `menu` property of the request body and saves it to the database. Returns a 200 response with the updated menu on the `menu` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the menu with the supplied menu ID from the database if that menu has no related menu items. Returns a 204 response.
  - If the menu with the supplied menu ID has related menu items, returns a 400 response.
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response

**`/api/menus/:menuId/menu-items`**

- GET
  - Returns a 200 response containing all saved menu items related to the menu with the supplied menu ID on the `menu items` property of the response body
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- POST
  - Creates a new menu item, related to the menu with the supplied menu ID, with the information from the `menuItem` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu item on the `menuItem` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response

**`/api/menus/:menuId/menu-items/:menuItemId`**

- PUT
  - Updates the menu item with the specified menu item ID using the information from the `menuItem` property of the request body and saves it to the database. Returns a 200 response with the updated menu item on the `menuItem` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
  - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the menu item with the supplied menu item ID from the database. Returns a 204 response.
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
  - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response



## Status

Project is _finished_. 



## Inspiration

This project was based on [CodeCademy's Web Development career path](https://www.codecademy.com/learn/paths/web-development)



## Contact

Created by [Esteban Munch Jones](https://www.linkedin.com/in/estebanmunchjones/)- feel free to contact me.
