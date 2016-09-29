"use strict";
const make_promise_or_call_1 = require("../util/make-promise-or-call");
const query_1 = require("./query");
const sql_spite_1 = require("../sql-spite");
var execProtos = {
    row: function (cb) {
        return run.call(this, "get", cb);
    },
    rows: function (cb) {
        return run.call(this, "all", cb);
    },
    each: function (cb) {
        return run.call(this, cb, "each", cb);
    },
    run: function (cb) {
        return run.call(this, "run", cb);
    },
};
exports.execProtos = execProtos;
var methods = function () {
    var out = [];
    for (var key in execProtos) {
        out.push(key);
    }
    return out;
};
exports.methods = methods;
function run(verb, cb) {
    var self = this;
    self._exec();
    // Reset
    self.model.query = new query_1.Query(self.model);
    return make_promise_or_call_1.makePromiseOrCall(verb, function () {
        sql_spite_1.default.db[verb](self.query.string, self.query.inputs, function (err, data) {
            if (verb === "run") {
                // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
                cb(err, this.lastID, this.changes);
            }
            else {
                cb(err, data);
            }
        });
    }, cb);
}
