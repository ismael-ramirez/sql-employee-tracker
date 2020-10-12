const consoleTable = require("console.table");          //  Usage is console.table, so it doesn't use the var
const connection = require("./connection.js");

module.exports = { addQuery, selectQuery, updateQuery, deleteQuery, selectJoinQuery, aggregateQuery, aggregateJoinQuery };

/**
 * Query Connection to add a record
 * @param {Text} tableName Table to update
 * @param {Object} values fieldName: value pairs
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 */
function addQuery(tableName, values, callbackFunction = null) {
    let sql = `INSERT INTO ${tableName} SET ?`;
    connection.query(sql, values, (err, res) => {
        if (err) throw err;
        // console.log(res);
        if (callbackFunction) {
            callbackFunction();
        };
    });
};

/**
 * Query Connection to select records
 * @param {Text} tableName Table to query
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 * @param {Array} fieldNames Field Names to query (or null for *)
 * @param {Object} whereClause Conditions as {fieldName: value}
 * @param {Text} orderBy Order By Field (or null for none)
 * @param {Boolean} orderAsc Order Ascending
 */
function selectQuery(tableName, callbackFunction = null, fieldNames = null, whereClause = null, orderBy = null, orderAsc = true) {
    let sql = `SELECT `;
    if (!fieldNames) {
        sql += "*";
    } else {
        sql += fieldNames.join(", ");
    };
    sql += ` FROM ${tableName}`;
    if (whereClause) {
        sql += " WHERE ?";
    };
    if (orderBy !== null) {
        sql += " ORDER BY " + orderBy + " " + (orderAsc ? "ASC" : "DESC")
    };
    sql += ";";

    console.clear();
    if (!whereClause) {
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);

            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (whereClause) {
        connection.query(sql, whereClause, (err, res) => {
            if (err) throw err;
            console.table(res);

            if (callbackFunction) {
                callbackFunction();
            };
        });
    };
};


/**
 * Query Connection to update records
 * @param {Text} tableName Table to query
 * @param {Object} setClause Values to set as { fieldName: value }
 * @param {Object} whereClause Conditions as { fieldName: value }
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 */
function updateQuery(tableName, setClause, whereClause, callbackFunction = null) {
    let sql = `UPDATE ${tableName} SET ?`;
    if (whereClause) {
        sql += " WHERE ?"
    };
    sql += ";";
    
    // console.log(sql, setClause, whereClause);

    if (whereClause) {
        connection.query(sql, [setClause, whereClause], (err, res) => {
            if (err) throw err;
            // console.log("updated " + res.length + " row(s).");
            if (callbackFunction) {
                callbackFunction();
            };

        });
    } else {
        connection.query(sql, setClause, (err, res) => {
            if (err) throw err;
            // console.log("updated " + res.length + " row(s).");
            if (callbackFunction) {
                callbackFunction();
            };

        });
    };
};

/**
 * Query connection to delete rows
 * @param {Text} tableName Table to query
 * @param {Object} whereClause { fieldName: value } conditions
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 */
function deleteQuery(tableName, whereClause, callbackFunction = null) {
    let sql = `DELETE FROM ${tableName}`;
    if (whereClause) {
        sql += " WHERE ?";
    };
    sql += ";";

    if (!whereClause) {
        connection.query(sql, (err, res) => {
            if (err) throw err;
            // console.log("removed " + res.length + " row(s).");
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else {
        connection.query(sql, whereClause, (err, res) => {
            if (err) throw err;
            // console.log("removed " + res.length + " row(s).");
            if (callbackFunction) {
                callbackFunction();
            };
        });
    };
};


/**
 * Query Connection to select records
 * @param {Text} tableName Table to query
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 * @param {Array} fieldNames Field Names to query (or null for *)
 * @param {Object} whereClause Conditions as {fieldName: value}
 * @param {Text} orderBy Order By Field (or null for none)
 * @param {Boolean} orderAsc Order Ascending
 * @param {Object} joinData Join details in the form of { joinTable: x, joinAlias: x', tableField: y, joinField: z }
 */
function selectJoinQuery(tableName, callbackFunction = null, fieldNames = null, whereClause = null, orderBy = null, orderAsc = true, ...joinData) {
    let sql = `SELECT `;
    if (!fieldNames) {
        sql += "*";
    } else {
        sql += fieldNames.join(", ");
    };
    sql += ` FROM ${tableName}`;
    joinData.forEach(item => {
        let { joinTable, joinAlias, tableField, joinField } = item;
        if (!joinAlias) {
            sql += ` LEFT JOIN ${joinTable} ON ${tableName}.${tableField} = ${joinTable}.${joinField}`;
        } else {
            sql += ` LEFT JOIN ${joinTable} AS ${joinAlias} ON ${tableName}.${tableField} = ${joinAlias}.${joinField}`;
        };        
    });
    if (whereClause) {
        sql += " WHERE ?";
    };
    if (orderBy) {
        sql += " ORDER BY " + orderBy + " " + (orderAsc ? "ASC" : "DESC")
    };
    sql += ";";

    console.clear();
    // console.log(sql);
    // console.log(whereClause);
    if (!whereClause) {
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (whereClause) {
        connection.query(sql, whereClause, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    };
};

/**
 * 
 * @param {Text} tableName Table to query
 * @param {Array} fieldNames Field Names and functions to query
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 * @param {Object} whereClause Conditions as { fieldName: value }
 * @param {Object} havingClause Aggregate Conditions as { fieldName: value }
 * @param {Text} orderBy Order By field (or null for none)
 * @param {Boolean} orderAsc Order Ascending
 */
function aggregateQuery(tableName, fieldNames, callbackFunction = null, whereClause = null, havingClause = null, orderBy = null, orderAsc = true) {
    let sql = `SELECT `;
    if (!fieldNames) {
        sql += "*";
    } else {
        sql += fieldNames.join(", ");
    };
    sql += ` FROM ${tableName}`;
    if (whereClause) {
        sql += " WHERE ?";
    };
    if (havingClause) {
        sql += " HAVING ?";
    };
    if (orderBy) {
        sql += " ORDER BY " + orderBy + " " + (orderAsc ? "ASC" : "DESC")
    };
    sql += ";";

    console.clear();
    if (!whereClause && !havingClause) {
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (whereClause && !havingClause) {
        connection.query(sql, whereClause, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (!whereClause && havingClause) {
        connection.query(sql, havingClause, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else {
        connection.query(sql, [whereClause, havingClause], (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    };
}



/**
 * 
 * @param {Text} tableName Table to query
 * @param {Array} fieldNames Field Names and functions to query
 * @param {Function} callbackFunction Function to call after the query is resolved, or NULL if none.
 * @param {Object} whereClause Conditions as { fieldName: value }
 * @param {Object} havingClause Aggregate Conditions as { fieldName: value }
 * @param {Text} orderBy Order By field (or null for none)
 * @param {Boolean} orderAsc Order Ascending
 * @param {Object} joinData Join details in the form of { joinTable: x, joinAlias: x', tableField: y, joinField: z }
 */
function aggregateJoinQuery(tableName, fieldNames, callbackFunction = null, whereClause = null, havingClause = null, orderBy = null, orderAsc = true, ...joinData) {
    let sql = `SELECT `;
    if (!fieldNames) {
        sql += "*";
    } else {
        sql += fieldNames.join(", ");
    };
    sql += ` FROM ${tableName}`;
    joinData.forEach(item => {
        let { joinTable, joinAlias, tableField, joinField } = item;
        if (!joinAlias) {
            sql += ` LEFT JOIN ${joinTable} ON ${tableName}.${tableField} = ${joinTable}.${joinField}`;
        } else {
            sql += ` LEFT JOIN ${joinTable} AS ${joinAlias} ON ${tableName}.${tableField} = ${joinAlias}.${joinField}`;
        };        
    });
    if (whereClause) {
        sql += " WHERE ?";
    };
    if (havingClause) {
        sql += " HAVING ?";
    };
    if (orderBy) {
        sql += " ORDER BY " + orderBy + " " + (orderAsc ? "ASC" : "DESC")
    };
    sql += ";";

    console.clear();
    if (!whereClause && !havingClause) {
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (whereClause && !havingClause) {
        connection.query(sql, whereClause, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else if (!whereClause && havingClause) {
        connection.query(sql, havingClause, (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    } else {
        connection.query(sql, [whereClause, havingClause], (err, res) => {
            if (err) throw err;
            console.table(res);
            if (callbackFunction) {
                callbackFunction();
            };
        });
    };
};

