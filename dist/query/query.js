"use strict";
const filter_1 = require("../util/filter");
const exec_1 = require("./exec");
const create_1 = require("./create");
const select_1 = require("./select");
const sql_1 = require("./sql");
function Query(model) {
    this.raw = [];
    this.model = model;
    this.query = null;
}
exports.Query = Query;
for (var key in exec_1.execProtos) {
    var method = exec_1.execProtos[key];
    Query.prototype[key] = method;
}
Query.prototype.create = create_1.create;
Query.prototype.select = select_1.select;
Query.prototype.sql = sql_1.sql;
Query.prototype.add = function (args) {
    this.raw.push(args);
};
Query.prototype._exec = function () {
    var verb = filter_1.filter.one(this.raw, ["find", "create", "new", "update", "upsert", "delete", "destroy", "sql"]);
    switch (verb) {
        case "find":
            this._select();
            break;
        case "create":
            this._create();
            break;
        case "sql":
            this._sql();
            break;
        default:
            throw SyntaxError("Cannot use \"" + verb + "\" as first method in chain");
    }
};
