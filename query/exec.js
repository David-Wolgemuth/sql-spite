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
    // then: function (cb)
    // {
    //     return run.call(this, cb);
    // }
    // catch: function (cb)
    // {
    //     this._catch = cb;
    // },
    row: function (cb)
    {
        console.log("Hit");
        return run.call(this, "get");
    },
    rows: function (cb)
    {
        return run.call(this, "all");
    },
    // each: function (cb)
    // {
    //     return run.call(this, cb, "each");
    // },
    run: function (cb)
    {
        console.log("Hit");
        return run.call(this, "run");
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

function run (verb)
{
    var self = this;
    self._exec();

    // Reset
    self.model.query = new Query(self.model);

    return new Promise(function (resolve, reject) {

        spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
            if (err) {
                reject(err);
            }
            if (verb === "run") {
                // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
                resolve(this.lastID, this.changes);
            } else {
                resolve(data);
            }
        });

    });
}