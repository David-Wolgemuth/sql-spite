module.exports = makeModel;

var Query = require("./query/query");

function makeModel (schema)
{
    function model (callback) 
    {
        var returnSelf;
        var li = this.chain.length - 1;
        var last = this.chain[li];

        for (var key in schema) {
            if (last === key) {
                this.chain[li] = {};
                this.chain[li][key] = arguments[0];
                return new Query(this.chain, this);
            }
        }

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (last === "select" || last === "limit") {
            this.chain.push(args);
            return this;
        }

        this.chain.push(args);
        console.log("BEFORE CLEARED:", this.chain);
        var q = new Query(this.chain, this);
        this.chain = [];
        console.log("CLEARED", this.chain);
        return q;
    }

    model.chain = [];
    
    var methods = [
        "find", "create", "update", "delete",
        "by", "where", "all", "not", "desc",
        "select", "limit", "order",
        "first", "last",
        "sql"
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
            get: new ModelGetter(method, model)
        });
    }

    return model;
}

function ModelGetter (method, model)
{
    return function ()
    {
        console.log("CHAIN", method, model.chain);
        model.chain.push(method);
        return model;
    };
}