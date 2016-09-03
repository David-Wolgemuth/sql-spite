module.exports = Query;

var filter = require("./filter");
var spite = require("./sql-spite");

function Query (query, model)
{
    var self = this;
    var verb = filter.one(query, ["find", "create", "new", "update", "upsert", "delete", "destroy"]);
    var idx = query.splice(query.indexOf(verb), 0);

    this.query = null;

    switch (verb) {
        case "find":
            this.query = SELECT(query, model);
            break;
        case "create":
            this.query = CREATE(query, model);
            break;
        default:
            throw SyntaxError("Cannot use \"" + verb + "\" as first method in chain");
    }

    this.catch = function (cb) { this._catch = cb; };

    this.row = function (cb)
    {
        run(cb, "all", true);
        return this;
    };
    this.rows = function (cb)
    {
        run(cb, "all");
        return this;
    };
    this.run = function (cb)
    {
        run(cb, "run");
        return this;
    };

    function run (cb, verb, single)
    {
        query.splice(0);
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
}

function SELECT (queryArr, model)
{
    var query = { 
        select: "*",
        where: null,
        limit: null,
        order: null
    };
    for (var i = 0; i < queryArr.length; i++) {
        switch (queryArr[i]) {
            case "by":
                query.where = queryArr[i+1];
                query.limit = 1;
                break;
            case "where":
                query.where = queryArr[i+1];
                break;
            case "limit":
                query.limit = queryArr[i+1];
                break;
            case "select":
                query.select = queryArr[i+1];
                break;
            case "order":
                query.order = { by: queryArr[i+1] };
                break;
            case "asc":
                break;
            case "desc":
                query.order = query.order || {};
                query.order.desc = true;
                break;
        }
    }
    var str = "SELECT " + query.select + " FROM " + model.tableName;
    var inputs = [];
    if (query.where) {
        str += " WHERE ";
        if (typeof query === "object") {
            var first = true;
            for (var key in query.where) {
                var val = query.where[key];
                if (!first) {
                    str += " AND ";
                }
                first = false;
                str += key + "=?";
                inputs.push(val);
            }
        }
    }
    if (query.order) {
        var o = query.order;
        o.by = o.by || "id";
        var desc = o.desc ? " DESC" : " ASC";
        str += " ORDER BY " + o.by + " " + desc;
    }
    if (query.limit) {
        str += " LIMIT " + query.limit;
    }
    return { string: str + ";", inputs: inputs };
}

function CREATE (query, model)
{
    var obj = query[1][0];
    if (typeof obj !== "object") {
        throw Error("Not Object?");
    }
    var  keys = "";
    var values = "";
    var inputs = [];
    var first = true;
    for (var key in obj) {
        var value = obj[key];
        if (!first) {
            keys += ", ";
            values += ", ";
        }
        first = false;
        keys += key;
        values += "?";
        inputs.push(value);
    }
    var str = "INSERT INTO " + model.tableName + " ( " +  keys + " ) VALUES ( " + values + " );";
    return { string: str, inputs: inputs };
}

