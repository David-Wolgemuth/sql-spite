
export { Query };

import { filter } from "../util/filter";
import { spite } from "../sql-spite";

import { addExecProtos } from "./exec";
import { create } from "./create";
import { select } from "./select";
import { sql } from "./sql";


function Query (model)
{
    this.raw = [];
    this.model = model;
    this.query = null;
}

addExecProtos(Query);
Query.prototype.create = create;
Query.prototype.select = select;
Query.prototype.sql = sql;

Query.prototype.add = function (args)
{
    this.raw.push(args);
};

Query.prototype._exec = function()
{
    var verb = filter.one(this.raw, ["find", "create", "new", "update", "upsert", "delete", "destroy", "sql"]);
    switch (verb) {
        case "find":
            this._select();
            break;
        case "create":
            this._create();
            break;
        case "sql":
            this._sql();
            break;
        default:
            throw SyntaxError("Cannot use \"" + verb + "\" as first method in chain");
    }
};

