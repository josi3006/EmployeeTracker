const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');



const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'EmployeeData_DB'
});



connection.connect(function (err) {
    if (err) throw err;
    taskPrompt();
});



// This function prompts the user for what they want to do

function taskPrompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'Would you like to View, Add, Change or Delete data?',
            choices: [
                'View Employee/Department Data',
                'Add a New Employee, Department or Role',
                'Change an Existing Department, Role or Employee',
                'Delete a Department, Role or Employee',
                'Quit'
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case 'View Employee/Department Data':
                    viewData();
                    break;

                case 'Add a New Employee, Department or Role':
                    addData();
                    break;

                case 'Change an Existing Department, Role or Employee':
                    changeData();
                    break;

                case 'Delete a Department, Role or Employee':
                    delData();
                    break;

                case 'Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }
        });
}



// This function prompts user for data to VIEW

function viewData() {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Quit'
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case 'View All Departments':
                    var viewType = 'departments';
                    viewQuery(viewType);
                    break;

                case 'View All Roles':
                    var viewType = 'roles';
                    viewQuery(viewType);
                    break;

                case 'View All Employees':
                    var viewType = 'employees';
                    viewQuery(viewType);
                    break;

                case 'Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }
        });
}


// This function displays data the user requested to VIEW

function viewQuery(viewType) {
    // var query = "SELECT * FROM ?";
    connection.query('SELECT * FROM ' + viewType, function (err, res) {

        console.log('Here are all the Things!');
        console.table(res);

        taskPrompt();

        // return process.exit(22);

    })
}



// This function prompts the user for data to DELETE

function delData() {
    inquirer
        .prompt([{
            name: 'table',
            type: 'list',
            message: 'What would you like to DELETE?',
            choices: [
                'Department',
                'Role',
                'Employee',
                'I\'d like to Quit'
            ]
        }])
        .then(function (answer) {

            switch (answer.table) {
                case 'Department':
                    var query = 'DELETE FROM departments WHERE deptname = "' + answer.row + '";';
                    deleteFunc(query);
                    break;

                case 'Role':
                    var query = 'DELETE FROM roles WHERE roletitle = "' + answer.row + '";';
                    deleteFunc(query);
                    break;

                case 'Employee':
                    var query = 'DELETE FROM employees WHERE lastname = "' + answer.row + '";';
                    deleteEmpl(query);
                    break;

                case 'I\'d like to Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;

                default: console.log('Please enter a valid value');
                    delData();
                    break;
            }
        })
}





// This function DELETES the department or role the user chose

function deleteFunc(query) {

    console.log('in delete role or dept function: ' + query);


    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}



// This function DELETES the employee the user chose

function deleteEmpl(query) {
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is the employee\'s First name??'
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is the employee\'s Last name??'
            }
        ])
        .then(function (answer) {

            var first = answer.first;
            var last = answer.last;

            var query = 'DELETE FROM employees WHERE firstname = "' + first + '" AND lastname = "' + last + '";';

            connection.query(query, function (err, res) {
                if (err) throw err;
                console.table(res);
            });

        })
}





// This function prompts the user for data to ADD

function addData() {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'Would you like to ADD a Department, Role or Employee?',
            choices: [
                'Add a new Department',
                'Add a new Role',
                'Add a new Employee',
                'Quit'
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case 'Add a new Department':
                    var addType = 'departments';
                    addDept(addType);
                    break;

                case 'Add a new Role':
                    var addType = 'roles';
                    addRole(addType);
                    break;

                case 'Add a new Employee':
                    var addType = 'employees';
                    addEmpl(addType);
                    break;

                case 'Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }
        });
}





function addDept() {
    inquirer
        .prompt([
            {
                message: 'What is the name of the new Department?',
                name: 'deptname'
            }
        ]).then(function (answer) {

            var query = 'INSERT INTO departments (deptname) VALUES (?);';

            // INSERT INTO departments (deptname) VALUES ('Marketing');

            connection.query(query, [answer.deptname], function (err, res) {
                if (err) throw err;
                console.table(res);
            });

            taskPrompt();

        })
}


// This function prompts user for data to DELETE



// // This function displays data the user requested

// function delQuery(delTable, delName) {
//     console.log('at top: ' + delTable);
//     console.log('at top: ' + delName);


//     inquirer
//         .prompt({
//             name: 'drop',
//             type: 'input',
//             message: 'Which ' + delName + ' do you want to DELETE from ' + delTable + '?'
//         })
//         .then(function (answer, delTable, delName) {

//             console.log('at query ' + delTable);
//             console.log('at query ' + delName);
//             console.log('at query ' + answer.drop);

//             const delData = 'SET SQL_SAFE_UPDATES=0;' +
//                 'DELETE FROM ' + delTable + ' WHERE ' + delName + ' = ' + answer.drop +
//                 '; SET SQL_SAFE_UPDATES=1;';

//             connection.query(delData, function (err, res) {
//                 if (err) throw err;


//                 console.log('Successfully deleted ' + answer.drop);

//                 taskPrompt();

//                 // return process.exit(22);

//             })
//         })
// }


