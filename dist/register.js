"use strict";
const schema_1 = require("./schema");
const model_1 = require("./model");
function register(info, cb) {
    if (!info) {
        throw Error("Schema Required to Register Model");
    }
    if (typeof info.model !== "string" || typeof info.table !== "string") {
        throw Error("model and table name are required to register model");
    }
    if (this.registered[info.model]) {
        throw ReferenceError("Model \"" + info + "\" already exists");
    }
    var schema = new schema_1.Schema(info);
    var str = "CREATE TABLE IF NOT EXISTS " + schema.table + " ( ";
    var first = true;
    schema.attributes.forEach((attr, idx) => {
        if (attr.type === "relationship") {
            return;
        }
        if (!first) {
            str += ", ";
        }
        first = false;
        str += attr.name + " " + attr.getSQLType();
    });
    str += " )";
    var model = new model_1.Model(schema);
    this.db.run(str, (error) => {
        if (!error) {
            this.registered[info.model] = model;
        }
        cb(error);
    });
}
exports.register = register;
