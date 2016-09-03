
var spite = {
    model: model,
    register: register,
    connect: connect,
    db: null
};

module.exports = spite;

var makeModel = require("./model.js");
var sqlite3 = require("sqlite3").verbose();

var registered = {};

function connect (name)
{
    spite.db = new sqlite3.Database(name + ".db");
}

function model (name)
{
    if (registered[name]) {
        return registered[name];
    }
    throw ReferenceError("Model \"" + name + "\" does not exist");
}

function register (name, schema)
{
    if (registered[name]) {
        throw ReferenceError("Model \"" + name + "\" already exists");
    }
    var model = makeModel(schema);
    model.tableName = name.toLowerCase() + "s";
    var str = "CREATE TABLE IF NOT EXISTS " + model.tableName + " (id INTEGER PRIMARY KEY, ";
    var first = true;
    for (var column in schema) {
        if (!first) {
            str += ", ";
        }
        first = false;
        var type = schema[column];
        str += column + " " + type;
    }
    str += ")";
    spite.db.run(str, function (err) {
        if (err) {
            console.log("ERROR", err);
        }
    });
    registered[name] = model;
}