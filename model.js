module.exports = makeModel;

var Query = require("./query");

function makeModel (schema)
{
    var query = [];
    function model (callback) 
    {
        var returnSelf;
        var li = query.length - 1;
        var last = query[li];

        for (var key in schema) {
            if (last === key) {
                query[li] = {};
                query[li][key] = arguments[0];
                return new Query(query, this);
            }
        }

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (last === "select" || last === "limit") {
            query.push(args);
            return this;
        }

        query.push(args);
        return new Query(query, this);
    }


    var methods = [
        "find", "create", "update", "delete",
        "by", "where", "all", "not", "desc",
        "select", "limit", "order",
        "first", "last"
    ];

    // find.by.email("cool@aid.com")
    if (typeof schema !== "object") {
        throw TypeError("Model Properties Must Be Defined");
    }
    for (var key in schema) {
        methods.push(key);
    }
    
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        Object.defineProperty(model, method, {
            set: function () {},
            get: new ModelGetter(method, model, query)
        });
    }

    return model;
}

function ModelGetter (method, model, query)
{
    return function ()
    {
        query.push(method);
        return model;
    };
}