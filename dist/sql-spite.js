"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sharedInstance;
const sqlite3 = require("sqlite3");
const register_1 = require("./register");
var sharedInstance = null;
exports.spite = sharedInstance;
class Spite {
    constructor() {
        this.registered = {};
        this.db = null;
        if (!sharedInstance) {
            exports.spite = sharedInstance = this;
        }
        else {
            return sharedInstance;
        }
    }
    connect(name, callback) {
        this.db = new sqlite3.Database(name + ".sqlite3", function (err) {
            callback(err);
        });
    }
    disconnect() {
        this.registered = {};
        this.db.close();
        this.db = null;
    }
    model(name) {
        if (this.registered[name]) {
            return this.registered[name];
        }
        throw ReferenceError("Model \"" + name + "\" does not exist");
    }
    register(options, schema, cb) {
        register_1.register.call(this, options, schema, cb);
    }
    schemas() {
        var output = [];
        for (var key in this.registered) {
            output.push(this.registered[key].schema);
        }
        return output;
    }
}
exports.Spite = Spite;
