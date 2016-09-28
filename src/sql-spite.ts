
export { spite };

import { ClassModelGenerator } from "./class-model-generator";
import * as sqlite3 from "sqlite3";
import { Schema } from "./schema";
import { makePromiseOrCall } from "./util/make-promise-or-call";

var spite = {
    model: model,
    register: register,
    connect: connect,
    schemas: schemas,
    disconnect: disconnect,
    db: null
};

export default spite;
var registered = {};

function connect (name, cb)
{
    return makePromiseOrCall(_connect, { name: name }, cb);
}
function _connect (args, cb)
{
    spite.db = new sqlite3.Database(args.name + ".sqlite3", function (err) {
        cb(err);
    });
}

function disconnect ()
{
    registered = {};
    spite.db = null;
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
    return makePromiseOrCall(_register, { options: options, schema: schema }, cb);
}

function _register (args, cb)
{
    var options = args.options;
    var schema = args.schema;
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