module.exports = Model;

var spite = require("./sql-spite");

function Model (schema, data)
{
    this._schema = schema;
    this._data = data;
    this._stage = null;
    this.init();
}

Model.prototype.init = function()
{
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
                console.log("oneToMany", m);
                self[m.method] = oneToMany(self, m);
                break;
        }
    }
};

Model.prototype.save = function(cb)
{
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
    spite.db.run(str, values, function (err) {
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

function getterSetter (model, key)
{
    return function (set)
    {
        if (set !== undefined) {
            model._stage = model._stage || {};
            model._stage[key] = set;
            return model;
        } else {
            return model._data[key];
        }
    };
}

function manyToOne (model, one)
{
    return function (cb)
    {
        var str = "SELECT * FROM " + one.table + " WHERE id=?";
        var values = [model[one.foreignKey]()];  // Retreive id from obj
        spite.db.get(str, values, cb);
    };
}

function oneToMany (model, many)
{
    return function (cb)
    {
        var str = "SELECT * FROM " + many.table + " WHERE " + many.foreignKey + "=?";
        var values = [model.id()];
        spite.db.all(str, values, cb);
    };
}