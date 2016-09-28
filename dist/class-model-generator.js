"use strict";
const query_1 = require("./query/query");
const exec_1 = require("./query/exec");
function ClassModelGenerator(schema) {
    // Not to be used with "new"
    var self = this;
    self.model = model;
    function model(args) {
        self.model.process(args);
        return self.model;
    }
    model.process = process;
    model.schema = schema;
    model.name = schema.name;
    model.table = schema.table;
    model.query = new query_1.Query(model);
    addGettersToModel(model);
}
exports.ClassModelGenerator = ClassModelGenerator;
function process(args) {
    this.query.add(args);
    return this;
}
function addGettersToModel(model) {
    [
        "find", "create", "update", "delete",
        "by", "where", "all", "not", "desc",
        "select", "limit", "order",
        "first", "last",
        "sql"
    ].forEach(function (method) {
        // User.find.`by`
        Object.defineProperty(model, method, {
            set: function () { console.log("ACCESSING", method); },
            get: function () {
                model(method);
                return model;
            }
        });
    });
    // User.find.by.`email("cool@aid.com")`
    for (var i = 0; i < model.schema.columns.length; i++) {
        var method = model.schema.columns[i].name;
        model[method] = methodable(method);
    }
    function methodable(method) {
        return function (args) {
            model(method);
            if (args) {
                model(args);
            }
            return model;
        };
    }
    // User.find.where.name("Joe").desc.`rows(function (){})`
    for (i = 0; i < exec_1.methods.length; i++) {
        var exec = exec_1.methods[i];
        model[exec] = executable(exec);
    }
    function executable(exec) {
        return function (cb) {
            return model.query[exec](cb);
        };
    }
}
