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
    connection.query('SELECT * FROM ' + viewType, function (err, res) {

        console.table(res);

        nowWhat();

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
                    nowWhat();
                    break;

                default: console.log('Please enter a valid value');
                    delData();
                    break;
            }
        })
}



// This function DELETES the department or role the user chose

function deleteFunc(query) {

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);

        nowWhat();

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
                nowWhat();
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
                    nowWhat();
                    break;
            }
        });
}



// This function ADDS a new Department

function addDept() {
    inquirer
        .prompt([
            {
                message: 'What is the name of the new Department?',
                name: 'deptname'
            }
        ]).then(function (answer) {

            var query = 'INSERT INTO departments (deptname) VALUES (?);';

            connection.query(query, [answer.deptname], function (err, res) {
                if (err) throw err;
                console.table(res);
            });

        })
}



// This function ADDS a new Role

function addRole() {

    const deptQuery = 'SELECT * from departments;'

    connection.query(deptQuery, function (err, res) {
        if (err) throw err;


        const deptArr = res.map(item => item.deptname);

        inquirer
            .prompt([
                {
                    message: 'What is the name of the new Role?',
                    name: 'roletitle'
                },
                {
                    message: 'What is the salary for the new Role?',
                    name: 'salary'
                },
                {
                    name: 'deptid',
                    type: 'list',
                    message: 'Which Department does this role belong in?',
                    choices: deptArr
                }

            ]).then(function (answer) {

                var whichid = res.filter(item => item.deptname === answer.deptid);

                var query = 'INSERT INTO roles (roletitle, salary, deptid) VALUES (?, ?, ?);';

                connection.query(query, [answer.roletitle, answer.salary, whichid[0].id], function (err, res) {
                    if (err) throw err;

                    nowWhat();

                });

            })
    })
}


// This function ADDS a new Employee

function addEmpl() {

    const mgrQuery = 'SELECT * FROM employees WHERE roleid = (SELECT id FROM roles WHERE roletitle = "Manager");';

    connection.query(mgrQuery, function (err, response) {
        if (err) throw err;

        const mgrArr = response.map(item => item.firstname);



        const roleQuery = 'SELECT * FROM roles';

        connection.query(roleQuery, function (err, result) {
            if (err) throw err;

            const roleArr = result.map(item => item.roletitle);

            inquirer
                .prompt([
                    {
                        message: 'What is the employee\'s First Name?',
                        name: 'first'
                    },
                    {
                        message: 'What is the employee\'s Last Name?',
                        name: 'last'
                    },
                    {
                        name: 'roleid',
                        type: 'list',
                        message: 'What is the employee\'s Role?',
                        choices: roleArr
                    },
                    {
                        name: 'managerid',
                        type: 'list',
                        message: 'Who is the employee\'s Manager?',
                        choices: mgrArr
                    }

                ]).then(function (answer) {

                    var whichMgr = response.filter(item => item.firstname === answer.managerid);
                    var whichRole = result.filter(data => data.roletitle === answer.roleid);

                    var query = 'INSERT INTO employees (firstname, lastname, roleid, managerid) VALUES (?, ?, ?, ?);';

                    connection.query(query, [answer.first, answer.last, whichRole[0].id, whichMgr[0].id], function (err, res) {
                        if (err) throw err;

                        console.log('Name is: ' + answer.first + ' ' + answer.last);
                        console.log('Role id is: ' + whichRole[0].id);
                        console.log('Manager id is: ' + whichMgr[0].id);
                    });

                    nowWhat();
                })
        })
    }

    )
}


// This function routes user based on input

function nowWhat() {
    inquirer.prompt({
        name: 'whatToDo',
        type: 'list',
        message: 'What would you like to do now?',
        choices: [
            'Start Over',
            'Quit'
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case 'Start Over':
                    taskPrompt();
                    break;

                case 'Quit':
                    console.log('Quitter.')
                    console.log('----------------------');
                    taskPrompt();

            }
        })
}

