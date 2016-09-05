
var spite = {
    model: model,
    register: register,
    connect: connect,
    schemas: schemas,
    db: null
};

module.exports = spite;

var ClassModelGenerator = require("./class-model-generator.js");
var sqlite3 = require("sqlite3").verbose();
var Schema = require("./schema");

var registered = {};

function connect (name, cb)
{
    spite.db = new sqlite3.Database(name + ".db", function (err) {
        cb(err);
    });
}

function schemas ()
{
    var schemas_ = [];
    for (var key in registered) {
        schemas_.push(registered[key].schema);
    }
    return schemas_;
}

function model (name)
{
    if (registered[name]) {
        return registered[name];
    }
    throw ReferenceError("Model \"" + name + "\" does not exist");
}

function register (options, schema, cb)
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
    var model = new ClassModelGenerator(schema).model;

    spite.db.run(str, function (err) {
        if (!err) {
            registered[options.model] = model;
        }
        cb(err);
    });
}