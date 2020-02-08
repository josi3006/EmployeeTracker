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


// This function displays data the user requested

function viewQuery(viewType) {
    // var query = "SELECT * FROM ?";
    connection.query('SELECT * FROM ' + viewType, function (err, res) {

        console.log('Here are all the Things!');
        console.table(res);

        taskPrompt();

        // return process.exit(22);

    })
}





// This function prompts the user for data to ADD

// function addData() {
//     inquirer
//         .prompt({
//             name: 'action',
//             type: 'rawlist',
//             message: 'Would you like to ADD a Department, Role or Employee?',
//             choices: [
//                 'Add a new Department',
//                 'Add a new Role',
//                 'Add a new Employee',
//                 'Quit'
//             ]
//         })
//         .then(function (answer) {
//             switch (answer.action) {
//                 case 'Add a new Department':
//                     var viewType = 'departments';
//                     viewQuery(viewType);
//                     break;

//                 case 'Add a new Role':
//                     var viewType = 'roles';
//                     viewQuery(viewType);
//                     break;

//                 case 'Add a new Employee':
//                     var viewType = 'employees';
//                     viewQuery(viewType);
//                     break;

//                 case 'Quit':
//                     console.log('Quitter.');
//                     taskPrompt();
//                     break;
//             }
//         });
// }





// function viewQuery(viewType) {
//     // var query = "SELECT * FROM ?";
//     connection.query('SELECT * FROM ' + viewType, function (err, res) {

//         console.log('Here are all the Things!');
//         console.table(res);

//         taskPrompt();

//         // return process.exit(22);

//     })   
// }


// This function prompts user for data to DELETE

function delData() {
    inquirer
        .prompt([{
            name: 'bucket',
            type: 'list',
            message: 'What would you like to DELETE?',
            choices: [
                'Department',
                'Role',
                'Employee',
                'I\'d like to Quit'
            ]
        },
        {
            name: 'drop',
            type: 'input',
            message: 'Which one would you like to delete?'
        }])
        .then(function (answer) {

            switch (answer.bucket) {
                case 'Department':
                    var drop = answer.drop
                    deleteFunc(answer.bucket, drop);
                    break;

                case 'Role':
                    var query = 'SET SQL_SAFE_UPDATES=0;' +
                        'DELETE FROM roles WHERE roletitle = ' + answer.drop +
                        '; SET SQL_SAFE_UPDATES=1;';

                    deleteFunc(query);
                    break;

                case 'Employee':
                    var query = 'SET SQL_SAFE_UPDATES=0;' +
                        'DELETE FROM employees WHERE lastname = ' + answer.drop +
                        '; SET SQL_SAFE_UPDATES=1;';

                    deleteFunc(query);
                    break;

                case 'I\'d like to Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }

            function deleteFunc(query) {
                connection.query(query, function (err, res) {
                    if (err) throw err;
                });
            }
        })
}


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


