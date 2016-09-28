
export { Model };

import { Query } from "./query/query";
import { methods as executables } from "./query/exec"

function Model (schema)
{
    this.schema = schema;
}

Model.prototype.init ()
{
    [
        "find", "create", "update", "delete",
        "by", "where", "all", "not", "desc",
        "select", "limit", "order",
        "first", "last",
        "sql"
    ].forEach(function (method) {
        this[method] = getter(method);
    });

    executables().forEach(function (exec) {
        this[exec] = executable(exec);
    })
}

Model.prototype._proccess = function (method, args)
{
    console.log(method, args);
}

function getter (method) {
    return function () {
        this._process(method, arguments);
    }
}

function executable (exec)
{
    return function (cb)
    {
        this._execute(exec, cb);
    };
}
