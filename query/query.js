module.exports = Query;

var filter = require("../util/filter");
var spite = require("../sql-spite");


function Query (model)
{
    this.raw = [];
    this.model = model;
    this.query = null;
    // this.init();
}

Query.prototype.add = function (args)
{
    this.raw.push(args);
};

Query.prototype._exec = function()
{
    console.log("EXEC");
    this.raw.forEach(function (piece) {
        console.log(">>", piece);
    });
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

require("./exec")(Query);
require("./create")(Query);
require("./select")(Query);
require("./sql")(Query);
