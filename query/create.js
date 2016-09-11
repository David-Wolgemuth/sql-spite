
module.exports = function (Query)
{
    Query.prototype._create = CREATE;    
};

function CREATE ()
{
    var obj = this.raw[1];
    if (typeof obj !== "object") {
        throw Error("Not Object?");
    }

    var schema = this.model.schema;

    if (schema.timestamps) {
        var t = new Date().getTime();
        obj.createdAt = t;
        obj.updatedAt = t;
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
    var str = "INSERT INTO " + this.model.schema.table + " ( " +  keys + " ) VALUES ( " + values + " );";
    this.query = { string: str, inputs: inputs };
}