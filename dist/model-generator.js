"use strict";
const sql_spite_1 = require("./sql-spite");
function Model(schema, data) {
    this._schema = schema;
    this._data = data;
    this._stage = null;
    this.init();
}
exports.Model = Model;
Model.prototype.init = function () {
    var self = this;
    for (var key in self._data) {
        self[key] = getterSetter(self, key);
    }
    for (var i = 0; i < self._schema.methods.length; i++) {
        var m = self._schema.methods[i];
        switch (m.type) {
            case "manyToOne":
                self[m.method] = manyToOne(self, m);
                break;
            case "oneToMany":
                self[m.method] = oneToMany(self, m);
                break;
            case "manyToMany":
                self[m.method] = manyToMany(self, m);
                break;
        }
    }
};
Model.prototype.save = function (cb) {
    var self = this;
    if (!self._stage) {
        return cb(false);
    }
    var str = "UPDATE " + self._schema.table + " SET ";
    var first = true;
    var values = [];
    for (var key in self._stage) {
        var value = self._stage[key];
        if (!first) {
            str += ", ";
        }
        first = false;
        str += key + "=?";
        values.push(value);
    }
    str += " WHERE id=" + self._data.id;
    var changes = self._stage;
    self._stage = null;
    sql_spite_1.default.db.run(str, values, function (err) {
        console.log(arguments, this);
        if (!err && this.changes) {
            for (var key in changes) {
                self._data[key] = changes[key];
            }
        }
        // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
        cb(err, this.changes);
    });
};
function getterSetter(model, key) {
    return function (set) {
        if (set !== undefined) {
            model._stage = model._stage || {};
            model._stage[key] = set;
            return model;
        }
        else {
            return model._data[key];
        }
    };
}
function manyToOne(model, other) {
    return function (cb) {
        var str = "SELECT * FROM " + other.table + " WHERE id=?";
        var values = [model[other.foreignKey]()]; // Retreive id from obj
        sql_spite_1.default.db.get(str, values, cb);
    };
}
function oneToMany(model, other) {
    return function (cb) {
        var str = "SELECT * FROM " + other.table + " WHERE " + other.foreignKey + "=?";
        var values = [model.id()];
        sql_spite_1.default.db.all(str, values, cb);
    };
}
function manyToMany(model, many) {
    var through;
    for (var i = 0; i < model._schema.methods.length; i++) {
        if (model._schema.methods[i].method === many.through) {
            through = model._schema.methods[i];
        }
    }
    if (!through) {
        throw "Through Table Not Found";
    }
    var throughSchema;
    var schemas = sql_spite_1.default.schemas();
    for (i = 0; i < schemas.length; i++) {
        if (schemas[i].table === through.table) {
            throughSchema = schemas[i];
        }
    }
    if (!throughSchema) {
        throw "Schema For Through Table Not Found";
    }
    var onOne;
    for (i = 0; i < throughSchema.methods.length; i++) {
        if (throughSchema.methods[i].method === many.onOne) {
            onOne = throughSchema.methods[i];
        }
    }
    if (!onOne) {
        throw "Join Not Found For Through Table";
    }
    return function (cb) {
        var onFk = onOne.foreignKey;
        var onT = onOne.table;
        var tt = through.table;
        var str = "SELECT " + onOne.table + ".* " +
            "FROM " + onOne.table + " " +
            "JOIN " + tt + " ON " + tt + "." + onFk + "=" + onT + ".id " +
            "WHERE " + tt + "." + through.foreignKey + "=?";
        var values = [model.id()];
        sql_spite_1.default.db.all(str, values, cb);
    };
}
