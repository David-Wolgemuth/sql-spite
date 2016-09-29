"use strict";
const parser_1 = require("./parser");
const token_1 = require("./token");
const exec_1 = require("./query/exec");
function Model(schema) {
    this.schema = schema;
    this.parser = new parser_1.Parser();
    this.init();
}
exports.Model = Model;
Model.prototype.init = function () {
    token_1.BuiltIns.forEach((method) => {
        this[method] = getter(method);
    });
    exec_1.methods().forEach((exec) => {
        this[exec] = executable(exec);
    });
    this.schema.attributes.forEach((attr) => {
        this[attr.name] = attrMethod(attr);
    });
};
Model.prototype._proccess = function (method, args) {
    console.log(method, args);
};
Model.prototype._execute = function (exec, cb) {
    console.log(exec, cb);
};
function attrMethod(attr) {
    return function () {
        this._process(attr, arguments);
    };
}
function getter(method) {
    return function () {
        this._process(method, arguments);
    };
}
function executable(exec) {
    return function (cb) {
        this._execute(exec, cb);
    };
}
