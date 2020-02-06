const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3000,
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
            message: 'What would you like to do?',
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
                    addNew();
                    break;

                case 'Change an Existing Department, Role or Employee':
                    changeData();
                    break;

                case 'Delete a Department, Role or Employee':
                    deleteData();
                    break;

                case 'Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }
        });
}




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
                'Go Back a Step',
                'Quit'
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case 'View All Departments':
                    viewDepts();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'View All Employees':
                    viewEmpls();
                    break;

                case 'Go Back a Step':
                    taskPrompt();
                    break;

                case 'Quit':
                    console.log('Quitter.');
                    taskPrompt();
                    break;
            }
        });
}
