const inquirer = require("inquirer");
const database = require("./database.js");
const connection = require("./connection.js");
// const tracker = require("../employeeTracker.js");

let _currentUser = {};
let _employeeAccess = {};

const _CHOICE_BACK = "Back";
const _CHOICE_LOGOFF = "Logoff";
const _CHOICE_EXIT = "Exit";

module.exports = { startMenu };

//      **      Primary Menu Functions

function startMenu(user = null, employeeAccess = null) {
    const CHOICE_EMPMENU = "Employee Menu";
    const CHOICE_MGRMENU = "Manager Menu";
    const CHOICE_ADMINMENU = "Administrator Menu";

    if (user) {
        _currentUser = user;
    };
    if (employeeAccess) {
        _employeeAccess = employeeAccess;
    }

    let varName = "userChoice";
    let type = "list";
    let prompt = `Hello, ${_currentUser.name},\nWhat would you like to do today?`;
    let choices = [];

    let access = _currentUser.access;
    if (access >= _employeeAccess.USER) {
        choices.push(CHOICE_EMPMENU);
    };
    if (access >= _employeeAccess.MANAGER) {
        choices.push(CHOICE_MGRMENU);
    };
    if (access >= _employeeAccess.ADMINISTRATOR) {
        choices.push(CHOICE_ADMINMENU);
    };

    choices.push(_CHOICE_LOGOFF);
    choices.push(_CHOICE_EXIT);

    let props = new InquirerProps(varName, prompt, type, choices);
    inquirer
        .prompt(props)
        .then(function (res) {
            choices = null;

            switch (res[varName]) {
                case CHOICE_EMPMENU:
                    employeeMenu();
                    break;
                case CHOICE_MGRMENU:
                    managerMenu();
                    break;
                case CHOICE_ADMINMENU:
                    administratorMenu();
                    break;
                case _CHOICE_LOGOFF:
                    logoff();
                    break;
                case _CHOICE_EXIT:
                    exitTracker();
                    break;
                default:
                    console.log("Unrecognized input: '" + res[varName] + "'!");
            };
        })
        .catch(err => { throw err });  
};
    
function employeeMenu() {
    const CHOICE_DEPTREPORT = "Department Report";
    const CHOICE_ROLEREPORT = "Role Report";
    const CHOICE_EMPREPORT = "Employee Report";
    const CHOICE_EMPBYMGRREPORT = "Employee by Manager Report";

    let varName = "userChoice";
    let type = "list";
    let prompt = `Hello, ${_currentUser.name},\nSelect an employee function:`;
    let choices = [];

    let access = _currentUser.access;
    if (access >= _employeeAccess.USER) {
        choices.push(CHOICE_DEPTREPORT);
        choices.push(CHOICE_ROLEREPORT);
        choices.push(CHOICE_EMPREPORT);
    };
    if (access >= _employeeAccess.MANAGER) {
        choices.push(CHOICE_EMPBYMGRREPORT);
    };
    // if (access >= _employeeAccess.ADMINISTRATOR) {
    // }
    choices.push(new inquirer.Separator());
    choices.push(_CHOICE_BACK);
    choices.push(_CHOICE_LOGOFF);
    choices.push(_CHOICE_EXIT);

    let props = new InquirerProps(varName, prompt, type, choices);
    inquirer
        .prompt(props)
        .then(function (res) {
            choices = null;

            switch (res[varName]) {
                case CHOICE_DEPTREPORT:
                    database.reportDepartments(employeeMenu);
                    break;
                case CHOICE_ROLEREPORT:
                    database.reportRoles(employeeMenu);
                    break;
                case CHOICE_EMPREPORT:
                    database.reportEmployees(employeeMenu);
                    break;
                case CHOICE_EMPBYMGRREPORT:
                    uiEmployeeReportByManager(employeeMenu);
                    break;
                case _CHOICE_BACK:
                    startMenu();
                    break;
                case _CHOICE_LOGOFF:
                    logoff();
                    break;
                case _CHOICE_EXIT:
                    exitTracker();
                    break;
                default:
                    console.log("Unrecognized input: '" + res[varName] + "'!");
            };
        })
        .catch(err => { throw err });  
};

function managerMenu() {    
    const CHOICE_UPDATEROLE = "Update Employee Role";


    let varName = "userChoice";
    let type = "list";
    let prompt = `Hello, ${_currentUser.name},\nWhat would you like to do today?`;
    let choices = [];

    let access = _currentUser.access;
    if (access >= _employeeAccess.MANAGER) {
        choices.push(CHOICE_UPDATEROLE);
    };
    // if (access >= _employeeAccess.ADMINISTRATOR) {
    // }

    choices.push(new inquirer.Separator());
    choices.push(_CHOICE_BACK);
    choices.push(_CHOICE_LOGOFF);
    choices.push(_CHOICE_EXIT);

    let props = new InquirerProps(varName, prompt, type, choices);
    inquirer
        .prompt(props)
        .then(function (res) {
            choices = null;

            switch (res[varName]) {
                case CHOICE_UPDATEROLE:
                    uiEmployeeRoleUpdate(managerMenu);
                    break;
                case _CHOICE_BACK:
                    startMenu();
                    break;
                case _CHOICE_LOGOFF:
                    logoff();
                    break;
                case _CHOICE_EXIT:
                    exitTracker();
                    break;
                default:
                    console.log("Unrecognized input: '" + res[varName] + "'!");
            };
        });  
};
function administratorMenu() {    
    const CHOICE_ADDDEPT = "Add Department";
    const CHOICE_ADDROLE = "Add Role";
    const CHOICE_ADDEMPLOYEE = "Add Employee";
    
    let varName = "userChoice";
    let type = "list";
    let prompt = `Hello, ${_currentUser.name},\nWhat would you like to do today?`;
    let choices = [];

    let access = _currentUser.access;
    if (access >= _employeeAccess.ADMINISTRATOR) {
        choices.push(CHOICE_ADDDEPT);
        choices.push(CHOICE_ADDROLE);
        choices.push(CHOICE_ADDEMPLOYEE);
    };

    choices.push(new inquirer.Separator());
    choices.push(_CHOICE_BACK);
    choices.push(_CHOICE_LOGOFF);
    choices.push(_CHOICE_EXIT);

    let props = new InquirerProps(varName, prompt, type, choices);
    inquirer
        .prompt(props)
        .then(function (res) {
            choices = null;

            switch (res[varName]) {
                case CHOICE_ADDDEPT:
                    uiAddDepartment(administratorMenu);
                    break;
                case CHOICE_ADDROLE:
                    uiAddRole(administratorMenu);
                    break;
                case CHOICE_ADDEMPLOYEE:
                    uiAddEmployee(administratorMenu);
                    break;
                case _CHOICE_BACK:
                    startMenu();
                    break;
                case _CHOICE_LOGOFF:
                    logoff();
                    break;
                case _CHOICE_EXIT:
                    exitTracker();
                    break;
                default:
                    console.log("Unrecognized input: '" + res[varName] + "'!");
            };
        });  
};
     
function menuType() {
    let varName = "userChoice";
    let type = "list";
    let prompt = `Hello, ${_currentUser.name},\nWhat would you like to do today?`;
    let choices = [];

    let access = _currentUser.access;
    if (access >= _employeeAccess.USER) {
        choices.push("0");
    };
    if (access >= _employeeAccess.MANAGER) {
        choices.push("1");
    };
    if (access >= _employeeAccess.ADMINISTRATOR) {
        choices.push("2");
    }

    choices.push(_CHOICE_LOGOFF);
    choices.push(_CHOICE_EXIT);

    let props = new InquirerProps(varName, prompt, type, choices);
    inquirer
        .prompt(props)
        .then(function (res) {
            choices = null;

            switch (res[varName]) {
                case "":
                    break;
                case _CHOICE_LOGOFF:
                    logoff();
                    break;
                case _CHOICE_EXIT:
                    exitTracker();
                    break;
                default:
                    console.log("Unrecognized input: '" + res[varName] + "'!");
            };
        });  
};

//      **      Secondary Menu Functions


//     Build a command-line application that at a minimum allows the user to:

//     * Add departments, roles, employees
  
function uiEmployeeReportByManager(callbackFunction) {
    let choices = [];
    let sql = `SELECT employees.manager_id, managers.first_name, managers.last_name 
                FROM employees 
                LEFT JOIN employees AS managers 
                ON employees.manager_id = managers.id 
                GROUP BY employees.manager_id
                HAVING (Count(employees.manager_id) > 0);`;
    connection.query(sql, function (err, data) {
        if (err) throw err;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
            let record = data[i];
            let obj = {
                name: record.first_name + " " + record.last_name,
                value: record.manager_id,
                short: record.first_name
            };
            choices.push(obj);
        };

        if (choices.length == 0) {
            console.log("No managers to report!");
            callbackFunction();

        } else {
            let varName = "userChoice";
            let type = "list";
            let prompt = `Report employees for which manager?`;
            let props = new InquirerProps(varName, prompt, type, choices);
            
            // console.log(props);
            inquirer    
                .prompt(props)
                .then(function (response) {
                    // console.log(response);
                    choices = null;
                    database.reportEmployeesByManager(response.userChoice, callbackFunction);
                })
                .catch(err => { throw err });
        };
    });
};

function uiEmployeeRoleUpdate(callbackFunction) {
    let employeeChoices = [];
    let employeeSQL = `SELECT id, first_name, last_name 
                FROM employees;`
    let roleChoices = [];
    let roleSQL = `SELECT id, title
                FROM roles;`
    
    connection.query(employeeSQL, function (err, employeeData) {
        if (err) throw err;
        // console.log(employeeData);
        for (let i = 0; i < employeeData.length; i++) {
            let employeeRecord = employeeData[i];
            let empObj = {
                name: employeeRecord.first_name + " " + employeeRecord.last_name,
                value: employeeRecord.id,
                short: employeeRecord.first_name
            };
            employeeChoices.push(empObj);
        };

        if (employeeChoices.length == 0) {
            console.log("DB Error: No employees to report!");
            callbackFunction();

        } else {
            connection.query(roleSQL, function (err, roleData) {
                // console.log(roleData);
                for (let j = 0; j < roleData.length; j++) {
                    let roleRecord = roleData[j];
                    let roleObj = {
                        name: roleRecord.title,
                        value: roleRecord.id
                    };
                    roleChoices.push(roleObj);
                };

                if (roleChoices.length == 0) {
                    console.log("DB Error: No roles to assign!");
                    callbackFunction();

                } else {
                    let empVar = "employeeToUpdate";
                    let empPrompt = "Select employee to update:"
                    let roleVar = "roleToAssign";
                    let rolePrompt = "Select new role:";
                    let empProps = new InquirerProps(empVar, empPrompt, "list", employeeChoices);
                    let roleProps = new InquirerProps(roleVar, rolePrompt, "list", roleChoices);

                    inquirer
                        .prompt([empProps, roleProps])
                        .then(function (response) {
                            const { employeeToUpdate, roleToAssign } = response;
                            if (!employeeToUpdate) {
                                console.log("Cancelled by user!");
                                callbackFunction();
                            } else {
                                database.updateEmployeeRole(employeeToUpdate, roleToAssign, callbackFunction);
                            };
                        })
                        .catch(err => { throw err });
                };
            });
        };
    });
};

function uiAddDepartment(callbackFunction) {
    let varName = "userInput";
    let type = "input";
    let prompt = `Please enter new department name`;

    let props = new InquirerProps(varName, prompt, type);
    inquirer
        .prompt(props)
        .then(function (res) {
            database.addDepartment(res.userInput, callbackFunction);
        })
        .catch(err => { 
            console.log("Couldn't add department '" + res.userInput + "'.");
        });  
};

function uiAddRole(callbackFunction) {
    let deptChoices = [];
    let deptSQL = `SELECT id, name
                FROM departments;`
    
    connection.query(deptSQL, function (err, data) {
        if (err) throw err;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
            let record = data[i];
            let obj = {
                name: record.name,
                value: record.id
            };
            deptChoices.push(obj);
        };

        if (deptChoices.length == 0) {
            console.log("DB Error: No departments to report!");
            callbackFunction();

        } else {
            let roleVar = "roleInput";
            let roleType = "input";
            let rolePrompt = `Please enter new role name`;
            let salaryVar = "salaryInput";
            let salaryType = "number";
            let salaryPrompt = `Please enter role salary`;
            let deptVar = "deptChoice";
            let deptType = "list";
            let deptPrompt = `Choose to which department the role belongs`

            let roleProps = new InquirerProps(roleVar, rolePrompt, roleType);
            let salaryProps = new InquirerProps(salaryVar, salaryPrompt, salaryType);
            let deptProps = new InquirerProps(deptVar, deptPrompt, deptType, deptChoices);

            inquirer
                .prompt([roleProps, salaryProps, deptProps])
                .then(function (res) {
                    const { roleInput, salaryInput, deptChoice } = res;
                    if (!roleInput) {
                        console.log("Cancelled by user!");
                        callbackFunction();
                    } else {
                        database.addRole(roleInput, salaryInput, deptChoice, callbackFunction);
                    };
                })
                .catch(err => { 
                    console.log("Couldn't add role '" + res.userInput + "'.");
                });  
        };
    });
};

function uiAddEmployee(callbackFunction) {
    let roleChoices = [];
    let roleSQL = `SELECT id, title
                FROM roles;`
    let mgrChoices = [];
    let usernames = [];
    let mgrSQL = `SELECT id, first_name, last_name, user_name
                FROM employees;`
    let accessChoices = [];            

    connection.query(roleSQL, function (err, roleData) {
        if (err) throw err;
        // console.log(roleData);
        for (let i = 0; i < roleData.length; i++) {
            let roleRecord = roleData[i];
            let roleObj = {
                name: roleRecord.title,
                value: roleRecord.id
            };
            roleChoices.push(roleObj);
        };

        if (roleChoices.length == 0) {
            console.log("DB Error: No roles to report!");
            callbackFunction();

        } else {
            connection.query(mgrSQL, function (err, mgrData) {
                if (err) throw err;
                // console.log(mgrData);
                for (let j = 0; j < mgrData.length; j++) {
                    let mgrRecord = mgrData[j];
                    let mgrObj = {
                        name: mgrRecord.first_name + " " + mgrRecord.last_name,
                        value: mgrRecord.id
                    };
                    mgrChoices.push(mgrObj);
                    usernames.push(mgrRecord.user_name);
                };
        
                if (mgrChoices.length == 0) {
                    console.log("DB Error: No managers to report!");
                    callbackFunction();
        
                } else {
                    let accessKeys = Object.keys(_employeeAccess);
                    let accessValues = Object.values(_employeeAccess);

                    for (let k = 0; k < accessKeys.length; k++) {
                        let obj = {
                            name: accessKeys[k],
                            value: accessValues[k]
                        };
                        accessChoices.push(obj);
                    };

                    uiAddEmployee_Prompt(roleChoices, mgrChoices, accessChoices, usernames, callbackFunction);
                };
            });
        };
    });
}   

function uiAddEmployee_Prompt(roles, managers, accessLevels, usernames, callbackFunction) {
    let usernameVar = "userName";
    let usernameType = "input";
    let usernamePrompt = "Please enter unique login id:";
    
    let firstVar = "firstName";
    let firstType = "input";
    let firstPrompt = "First Name:";

    let lastVar = "lastName";
    let lastType = "input";
    let lastPrompt = "Last Name:";

    let accessVar = "accessLevel";
    let accessType = "list";
    let accessPrompt = "Please select the employee's DB access level:";

    let roleVar = "roleId";
    let roleType = "list";
    let rolePrompt = "Please select the employee's new role:";

    let mgrVar = "mgrId";
    let mgrType = "list";
    let mgrPrompt = "Please select the employee's manager:";
    managers.push(" ");

    let usernameProps = new InquirerProps(usernameVar, usernamePrompt, usernameType);
    let firstProps = new InquirerProps(firstVar, firstPrompt, firstType);
    let lastProps = new InquirerProps(lastVar, lastPrompt, lastType);
    let accessProps = new InquirerProps(accessVar, accessPrompt, accessType, accessLevels);
    let roleProps = new InquirerProps(roleVar, rolePrompt, roleType, roles);
    let mgrProps = new InquirerProps(mgrVar, mgrPrompt, mgrType, managers);

    inquirer
        .prompt(usernameProps)
        .then(function (userNameResponse) {
            const userName = userNameResponse.userName;

            let isInArray = false;
            for (var i = 0; i < usernames.length; i++) {
                let item = usernames[i].toLowerCase();
                if (item == userName.toLowerCase()) {
                    isInArray = true;
                    break;
                };
            };

            if (isInArray) {
                console.log("user_name '" + userName + "' already exists!");
                uiAddEmployee_Prompt(roles, managers, usernames, callbackFunction);

            } else {
                inquirer
                    .prompt([
                        firstProps,
                        lastProps,
                        accessProps,
                        roleProps,
                        mgrProps
                    ])
                    .then(function (response) {
                        const { firstName, lastName, accessLevel, roleId } = response;
                        let mgrId = null;
                        if (response.mgrId != " ") {
                            mgrId = response.mgrId;
                        };
                        database.addEmployee(userName, firstName, lastName, roleId, mgrId, accessLevel, callbackFunction);
                    })
                    .catch(err => { throw err })
            };
        })
        .catch(err => { throw err })
};

//     * View departments, roles, employees

//     * Update employee roles
  
//   Bonus points if you're able to:
  
//     * Update employee managers
  
//     * View employees by manager
  
//     * Delete departments, roles, and employees
  
//     * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
  


function logoff() {
    console.log("Logging out...");
    _currentUser = null;
    // tracker.getUserName();
    connection.end();
};

function exitTracker() {
    console.log("Have a nice day!");
    connection.end();
};


//      **      Utility Functions

function InquirerProps(variableName, promptMessage, promptType = "input", promptChoices = null, promptDefault = null) {
    return {
        name: variableName,
        type: promptType,
        message: promptMessage,
        choices: promptChoices,
        default: promptDefault,
    }
}


//      **      Logic