"use strict";
const query_1 = require("./query");
const sql_spite_1 = require("../sql-spite");
// import {Promise} from 'es6-promise';
var proto = {
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
var methods = function () {
    var methods = [];
    for (var key in proto) {
        methods.push(key);
    }
    return methods;
};
exports.methods = methods;
function addExecProtos(Query) {
    for (var key in proto) {
        var method = proto[key];
        console.log("The Query?", Query.prototype);
        Query.prototype[key] = method;
    }
}
exports.addExecProtos = addExecProtos;
function run(verb, cb) {
    var self = this;
    self._exec();
    // Reset
    self.model.query = new query_1.Query(self.model);
    if (typeof cb === "function") {
        sql_spite_1.spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
            if (verb === "run") {
                // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
                cb(err, this.lastID, this.changes);
            }
            else {
                cb(err, data);
            }
        });
    }
    else {
        const p = new Promise((resolve, reject) => {
            sql_spite_1.spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
                if (err) {
                    return reject(err);
                }
                if (verb === "run") {
                    // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
                    resolve(this.lastID, this.changes);
                }
                else {
                    resolve(data);
                }
            });
        });
        return p;
    }
}
