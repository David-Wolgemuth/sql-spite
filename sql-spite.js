
var spite = {
    model: model,
    register: register,
    connect: connect,
    db: null
};

module.exports = spite;

var ClassModelGenerator = require("./class-model-generator.js");
var sqlite3 = require("sqlite3").verbose();
var Schema = require("./schema");

var registered = {};

function connect (name)
{
    return new Promise(function (resolve, reject) {
        spite.db = new sqlite3.Database(name + ".db", function (err) {
            if (err) {
                console.log("rejecting", err);
                reject(err);
            } else {
                console.log("resolving");
                resolve();
            }
        });
    });
}

function model (name)
{
    if (registered[name]) {
        return registered[name];
    }
    throw ReferenceError("Model \"" + name + "\" does not exist");
}

function register (options, schema)
{
    if (!options || ! schema) {
        throw Error("Schema Required to Register Model");
    }
    if (typeof options.model !== "string" || typeof options.table !== "string") {
        throw Error("model and table name are required to register model");
    }
    if (registered[options.model]) {
        throw ReferenceError("Model \"" + options + "\" already exists");
    }

    schema = new Schema(options, schema);
    var str = "CREATE TABLE IF NOT EXISTS " + schema.table + " ( ";
    var first = true;
    for (var i = 0; i < schema.columns.length; i++) {
        var col = schema.columns[i];
        if (!first) {
            str += ", ";
        }
        first = false;
        str += col.name + " " + col.type;
    }
    str += ")";
    console.log("Registering:", str);
    var model = new ClassModelGenerator(schema).model;

    return new Promise(function (resolve, reject) {
        spite.db.run(str, function (err) {
            if (err) {
                reject(err);
            } else {
                registered[options.model] = model;
                resolve();
            }
        });
    });
}