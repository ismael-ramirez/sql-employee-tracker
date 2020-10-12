const inquirer = require("inquirer");

const support = require("./support/");

//          Access levels for administrative menus
const EmployeeAccess = {
        UNAUTHORIZED: -1,
        UNDEFINED: 0,
        USER: 1,
        SUPERUSER: 2,
        MANAGER: 3,
        ADMINISTRATOR: 4
};
Object.freeze(EmployeeAccess);

//          Current login information
const User = function() {
    this.id = -1;
    this.access = -1;
    this.name = "";
    this.init = function() {
        this.id = -1;
        this.access = -1;
        this.name = "";
    }
};

const _user = new User();

//          Program settings
const _INFORM_ONINVALIDUSER = true;
const _PASSWORD_MINLENGTH = 8;
const _PASSWORD_MAXLENGTH = 32;
const _PASSWORD_REQUIRESLOWERCASE = true;
const _PASSWORD_REQUIRESUPPERCASE = true;
const _PASSWORD_REQUIRESNUMBER = true;
const _PASSWORD_REQUIRESSPECIAL = true;

/**
 * Initial user prompt. Gets Username and stats from DB.
 *   On a blank entry, uses a guest login.
 */
function getUserName() {
    console.clear();
    _user.init();

    let props = {
        type: "input",
        name: "userName",
        message: "Please enter username (or leave blank to login as guest):"
    };

    inquirer
        .prompt(props)
        .then(function (res) {
            if (!res.userName) {
                _user.id = -1;
                _user.access = 1;
                _user.name = "guest";
                support.ux.startMenu(_user, EmployeeAccess);

            } else {
                support.connection.query(`SELECT id, password, access, first_name FROM employees WHERE user_name = '${res.userName}'`, function (err, data) {
                    if (err) throw err;
                    // console.log(res);
                    
                    if (!data[0]) {
                        //  username doesn't exist in DB. For security reasons, it would be better to go ahead to the password as if everything were fine.
                        if (_INFORM_ONINVALIDUSER) {
                            console.log("Invalid user name!");
                            getUserName();
                        } else {
                            validatePassword();
                        };
                    };

                    _user.id = data[0].id;
                    _user.access = data[0].access;
                    _user.name = data[0].first_name;

                    if (!data[0].password) {
                        setNewPassword();
                    } else {
                        validatePassword();
                    };
                });
            };
        })
        .catch(function (err) {
            throw err;
        });
};

/**
 * If no password exists in the DB, prompts user for a new password.
 *   If password confirms and meets security requirements, updates the DB, and moves ahead with UX.
 *   Otherwise, loops the request.
 */
function setNewPassword() {
    let props0 = {
        type: "password",
        name: "userPass0",
        message: `This looks like your first login. Please create a password:`
    };
    let props1 = {
        type: "password",
        name: "userPass1",
        message: `Confirm password:`
    };

    inquirer
        .prompt([props0, props1])
        .then(function (res) {
            if (res.userPass0 != res.userPass1) {
                console.log("Passwords must match!");
                setNewPassword();
            } else {
                const isSecure = () => {   
                    let returnValue = false;

                    // console.log(res.userPass0);
                    // console.log(res.userPass0.split("").filter(letter => letter.match(/[0-9]/)).length);
                    // console.log(res.userPass0.split("").filter(letter => letter.match(/[a-z]/)).length);
                    // console.log(res.userPass0.split("").filter(letter => letter.match(/[A-Z]/)).length);
                    // console.log(res.userPass0.split("").filter(letter => letter.match(/[!@#$%^&*-+=]/)).length);

                    if (res.userPass0.length < _PASSWORD_MINLENGTH) {
                        console.log("Password must have " + _PASSWORD_MINLENGTH + " characters!");
                    } else if ((_PASSWORD_MAXLENGTH > _PASSWORD_MINLENGTH) && (res.userPass0.length > _PASSWORD_MAXLENGTH)) {
                        console.log("Password cannot be more than " + _PASSWORD_MAXLENGTH + " characters!");
                    } else if (_PASSWORD_REQUIRESNUMBER && !(res.userPass0.split("").filter(letter => letter.match(/[0-9]/)).length > 0)) {
                        console.log("Password must have one or more numbers (0-9)!");
                    } else if (_PASSWORD_REQUIRESLOWERCASE && !(res.userPass0.split("").filter(letter => letter.match(/[a-z]/)).length > 0)) {
                        console.log("Password requires lowercase letters!");
                    } else if (_PASSWORD_REQUIRESUPPERCASE && !(res.userPass0.split("").filter(letter => letter.match(/[A-Z]/)).length > 0)) {
                        console.log("Password requires uppercase letters!");
                    } else if (_PASSWORD_REQUIRESSPECIAL && !(res.userPass0.split("").filter(letter => letter.match(/[!@#$%^&*-+=]/)).length > 0)) {
                        console.log("Password requires one or more special characters (!@#$%^&*-+=)!");
                    } else {
                        returnValue = true;
                    };

                    return returnValue;
                };

                if (!isSecure()) {
                    setNewPassword();
                } else {
                    let hash = support.encryption.encryptPassword(_user.id, res.userPass0);
                    console.log("Password updated!");
                    support.ux.startMenu(_user, EmployeeAccess);
                };
            }
        })
};

/**
 * If the DB contains a password, asks the user to enter it.
 *   If successful, freezes user data and moves ahead with UX.
 *   If failed, returns to getUsername().
 */
function validatePassword() {
    let props = {
        type: "password",
        name: "userPass",
        message: `Please enter password:`
    };

    inquirer
        .prompt(props)
        .then(function (res) {
            let userId = -1;
            if (_user) {
                userId = _user.id;
            }; 
            support.encryption.validatePassword(userId, res.userPass, (err, res) => {
                if (err) throw err;
                if (!res) {
                    if (!_INFORM_ONINVALIDUSER) {
                        console.log("Invalid username or password!");
                    } else {
                        console.log("Invalid password!");
                    };

                    _user.id = -1;
                    _user.name = "";
                    _user.access = -1;

                    getUserName();

                } else {
                    support.ux.startMenu(_user, EmployeeAccess);
                };
            });
        });
};

module.exports = { getUserName };

getUserName();