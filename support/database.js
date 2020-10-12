const orm = require("./orm.js");

module.exports = {

//   * Add departments, roles, employees

    addDepartment: function(departmentName, callbackFunction = null) {
        let tableName = "departments";
        let values = {
            name: departmentName
        };
        orm.addQuery(tableName, values, callbackFunction);
    },

    addRole: function(roleTitle, salary, departmentId, callbackFunction = null) {
        let tableName = "roles";
        let values = {
            title: roleTitle,
            salary: salary,
            department_id: departmentId
        };
        orm.addQuery(tableName, values, callbackFunction);
    },

    addEmployee: function(userName, firstName, lastName, roleId, managerId, accessLevel, callbackFunction = null) {
        let tableName = "employees";
        let values = {
            user_name: userName,
            first_name: firstName,
            last_name: lastName,
            role_id: roleId,
            manager_id: managerId,
            access: accessLevel
        };
        orm.addQuery(tableName, values, callbackFunction);
    },

//   * View departments, roles, employees

    reportDepartments: function(callbackFunction = null) {
        let tableName = "departments";
        let fieldNames = ["name AS department"];
        orm.selectQuery(tableName, callbackFunction, fieldNames);
    },

    reportRoles: function(callbackFunction = null) {
        let tableName = "roles";
        let joinData = {
                joinTable: "departments",
                tableField: "department_id",
                joinField: "id"
            };
        let fieldNames = ["title AS role", "salary", "departments.name AS department"];
        orm.selectJoinQuery(tableName, callbackFunction, fieldNames, null, null, true, joinData);
    },

    reportEmployees: function(callbackFunction = null) {
        let tableName = "employees";
        let primaryJoinData = {
                joinTable: "roles",
                tableField: "role_id",
                joinField: "id"
            };
        let secondaryJoinData = {
                joinTable: "employees",
                joinAlias: "managers",
                tableField: "manager_id",
                joinField: "id"
            };
        let fieldNames = ["employees.user_name", "employees.first_name", "employees.last_name", "roles.title AS role", "managers.id AS manager"];
        orm.selectJoinQuery(tableName, callbackFunction, fieldNames, null, null, true, primaryJoinData, secondaryJoinData);
    },

//   * Update employee roles

    updateEmployeeRole: function(employeeId, newRole, callbackFunction = null) {
        let tableName = "employees";
        let setClause = {
            role_id: newRole
        };
        let whereClause = {
            id: employeeId
        };
        orm.updateQuery(tableName, setClause, whereClause, callbackFunction);
    },

// Bonus points if you're able to:

//   * Update employee managers

    updateEmployeeManager: function (employeeId, newManager, callbackFunction = null) {
        let tableName = "employees";
        let setClause = {
            manager_id: newManager
        };
        let whereClause = {
            id: employeeId
        };
        orm.updateQuery(tableName, setClause, whereClause, callbackFunction);
    },

//   * View employees by manager

    reportEmployeesByManager: function(managerId, callbackFunction = null) {
        let tableName = "employees";
        let primaryJoinData = {
                joinTable: "roles",
                tableField: "role_id",
                joinField: "id"
            };
        let secondaryJoinData = {
                joinTable: "employees",
                joinAlias: "managers",
                tableField: "manager_id",
                joinField: "id"
            };
        let fieldNames = ["employees.first_name", "employees.last_name", "roles.title AS role", "Concat(managers.first_name, ' ', managers.last_name) AS manager"];
        let whereClause = {
            "employees.manager_id": managerId
        };
        orm.selectJoinQuery(tableName, callbackFunction, fieldNames, whereClause, null, true, primaryJoinData, secondaryJoinData);
    },

//   * Delete departments, roles, and employees

    deleteDepartment: function(departmentId, callbackFunction = null) {
        let tableName = "departments";
        let whereClause = {
            id: departmentId
        };
        orm.deleteQuery(tableName, whereClause, callbackFunction);
    },

    deleteRole: function(roleId, callbackFunction = null) {
        let tableName = "roles";
        let whereClause = {
            id: roleId
        };
        orm.deleteQuery(tableName, whereClause, callbackFunction);
    },

    deleteEmployee: function(employeeId, callbackFunction = null) {
        let tableName = "employees";
        let whereClause = {
            id: employeeId
        };
        orm.deleteQuery(tableName, whereClause, callbackFunction);
    },

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

    sumSalariesByDepartment: function(departmentId, callbackFunction = null) {
        let tableName = "employees";
        let primaryJoinData = {
                joinTable: "roles",
                tableField: "role_id",
                joinField: "id"
            };
        let fieldNames = ["Count(employees.id) AS 'Employees'", "Sum(roles.salary) AS 'Total Salary'"];
        let whereClause = {
            "roles.department_id": departmentId
        };
        orm.aggregateJoinQuery(tableName, fieldNames, callbackFunction, whereClause, null, null, true, primaryJoinData);
    }
};