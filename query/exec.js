module.exports = function (Query)
{
    for (var key in proto) {
        var method = proto[key];
        Query.prototype[key] = method;    
    }
};

var spite = require("../sql-spite");

var proto = {
    catch: function (cb)
    {
        this._catch = cb;
    },
    row: function (cb)
    {
        run.call(this, cb, "all", true);
        return this;
    },
    rows: function (cb)
    {
        run.call(this, cb, "all");
        return this;
    },
    each: function (cb)
    {
        run.call(this, cb, "each");
        return this;
    },
    run: function (cb)
    {
        run.call(this, cb, "run");
        return this;
    },
};

function run (cb, verb, single)
{
    var self = this;
    spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
        // console.log("RAN?", err, data);
        if (err) {
            if (typeof self._catch === "function") {
                self._catch(err);
            }
        }
        if (typeof cb === "function") {
            if (single) {
                cb((data[0]) ? data[0] : null);
            } else {
                cb(data);
            }
        }
    });
}