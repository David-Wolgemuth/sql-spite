
import { makePromiseOrCall } from "../util/make-promise-or-call";
import { Query } from "./query";
import spite from "../sql-spite";

export { execProtos, methods };

var execProtos = {
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

var methods = function ()
{
    var out = [];
    for (var key in execProtos) {
        out.push(key);
    }
    return out;
};

function run (verb, cb)
{
    var self = this;
    self._exec();

    // Reset
    self.model.query = new Query(self.model);
    return makePromiseOrCall(verb, function () {
        spite.db[verb](self.query.string, self.query.inputs, function (err, data) {
            if (verb === "run") {
                // These values are hidden in the `this` context, I don't like that, I might want to try to get the actual object?
                cb(err, this.lastID, this.changes);
            } else {
                cb(err, data);
            }
        });
    }, cb);
}