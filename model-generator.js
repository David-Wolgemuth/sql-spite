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
        self[key] = getterSetter(key);
    }
    function getterSetter (key)
    {
        return function (set)
        {
            if (set !== undefined) {
                self._stage = self._stage || {};
                self._stage[key] = set;
                return self;
            } else {
                return self._data[key];
            }
        };
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
