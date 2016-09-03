
function Model (properties)
{
    var query = [];
    function model () 
    {
        console.log("Query:", query, "\nArguments:", arguments);
        if (query[query.length - 1] === "select") {
            query.push(Object.keys(arguments));
            return this;
        }
    }


    var methods = [
        "find", "create", "update", "delete",
        "by", "where", "all", "not",
        "select", "limit", "order",
        "first", "last"
    ];

    // find.by.email("cool@aid.com")
    if (typeof properties !== "object") {
        throw TypeError("Model Properties Must Be Defined");
    }
    for (var key in properties) {
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
        console.log(method);
        return model;
    };
}

function Query () {}

var User = Model({ id: "integer", email: "string" });

console.log(User);

var x = User.select("email").find.by.email("a@b.com");

console.log(x);

