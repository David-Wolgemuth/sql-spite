var Query = require("./query"); 
module.exports = execProto;
function execProto (Query)
{
    for (var key in proto) {
        var method = proto[key];
        Query.prototype[key] = method;    
    }
}
var spite = require("../sql-spite");

var proto = {
    catch: function (cb)
    {
        this._catch = cb;
    },
    row: function (cb)
    {
        return run.call(this, cb, "all", true);
    },
    rows: function (cb)
    {
        return run.call(this, cb, "all");
    },
    each: function (cb)
    {
        return run.call(this, cb, "each");
    },
    run: function (cb)
    {
        return run.call(this, cb, "run");
    },
};
execProto.methods = function ()
{
    var methods = [];
    for (var key in proto) {
        methods.push(key);
    }
    return methods;
};

function run (cb, verb, single)
{
    var self = this;
    self._exec();
    self.model.query = new Query(self.model);
    console.log("EXECUTING:", self.query);
    spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
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
    return self;
}