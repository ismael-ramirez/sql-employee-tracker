const bcrypt = require("bcrypt");
const connection = require("./connection.js");
const orm = require("./orm.js");

const saltRounds = 13;

module.exports = { encryptPassword, validatePassword }

/**
 * Hash password and store it in the given employee's record
 * @param {Number} employeeId employee ID
 * @param {Text} stringToEncrypt password to encrypt
 */
function encryptPassword(employeeId, stringToEncrypt) {
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(stringToEncrypt, salt))
        .then(hash => {
            let tableName = "employees";
            let setClause = {
                password: hash
            };
            let whereClause = {
                id: employeeId
            };
            orm.updateQuery(tableName, setClause, whereClause);
        });
};

/**
 * Check entered password; run one function on a pass or a different one on a fail
 * @param {Number} employeeId employee ID
 * @param {Text} userPassword entered password to compare
 * @param {Function} callbackFunction two-parameter function (error, response) to return upon completion
 */
function validatePassword(employeeId, userPassword, callbackFunction) {
    let sql = `SELECT password FROM employees WHERE id = '${employeeId}';`
    connection.query(sql, (err, res) => {
        if (err) throw err;
        if (!res[0]) {
            //      Just in case we're testing against an invalid user here...
            callbackFunction(err, false);
        };
        bcrypt
            .compare(userPassword, res[0].password, (err, res) => {
                callbackFunction(err, res);
            });
    });
};


//  Example code from "Hashing in Action: Understanding bcrypt" on auth0.com
//      https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

// app.js

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const plainTextPassword1 = "DFGh5546*%^__90";

// bcrypt
//   .genSalt(saltRounds)
//   .then(salt => {
//     console.log(`Salt: ${salt}`);

//     return bcrypt.hash(plainTextPassword1, salt);
//   })
//   .then(hash => {
//     console.log(`Hash: ${hash}`);

//     // Store hash in your password DB.
//   })
//   .catch(err => console.error(err.message));


// app.js

// const bcrypt = require("bcrypt");
// const plainTextPassword1 = "DFGh5546*%^__90";

// const hash = "$2b$10$69SrwAoAUNC5F.gtLEvrNON6VQ5EX89vNqLEqU655Oy9PeT/HRM/a";

// bcrypt
//   .compare(plainTextPassword1, hash)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.error(err.message));
