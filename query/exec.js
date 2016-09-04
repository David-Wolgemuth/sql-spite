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
    row: function (cb)
    {
        return run.call(this, "get", cb);
    },
    rows: function (cb)
    {
        return run.call(this, "all", cb);
    },
    each: function (cb)
    {
        return run.call(this, cb, "each", cb);
    },
    run: function (cb)
    {
        return run.call(this, "run", cb);
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

function run (verb, cb)
{
    var self = this;
    self._exec();

    // Reset
    self.model.query = new Query(self.model);

    spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
        if (verb === "run") {
            // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
            cb(err, this.lastID, this.changes);
        } else {
            cb(err, data);
        }
    });
}