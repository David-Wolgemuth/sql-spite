
export { Model };

import { Attribute, Method } from "./schema";
import { Parser } from "./parser";
import { TokenType, BuiltIns } from "./token"
import { Query } from "./query/query";
import { methods as executables } from "./query/exec"

function Model (schema)
{
    this.schema = schema;
    this.parser = new Parser();
    this.init();
}

Model.prototype.init = function ()
{
    BuiltIns.forEach( (method: string): void => {
        this[method] = getter(method);
    });
    executables().forEach( (exec: string): void => {
        this[exec] = executable(exec);
    });
    this.schema.attributes.forEach( (attr: Attribute): void => {
        this[attr.name] = attrMethod(attr);
    });
}

Model.prototype._proccess = function (method, args)
{
    console.log(method, args);
}
Model.prototype._execute = function (exec, cb)
{
    console.log(exec, cb);
}

function attrMethod (attr: Attribute)
{
    return function () {
        this._process(attr, arguments);
    }
}

function getter (method)
{
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
