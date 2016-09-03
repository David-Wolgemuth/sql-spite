
module.exports = function (Query)
{
    Query.prototype._select = SELECT;    
};
function SELECT ()
{
    var query = { 
        select: "*",
        where: null,
        limit: null,
        order: null
    };
    for (var i = 0; i < this.raw.length; i++) {
        switch (this.raw[i]) {
            case "by":
                var obj = {};
                console.log("RAW:", this.raw, "(", this.raw[i+1], ")");
                obj[this.raw[i+1]] = this.raw[i+2];
                query.where = obj;
                query.limit = 1;
                break;
            case "where":
                var obj = {};
                console.log("RAW:", this.raw, "(", this.raw[i+1], ")");
                obj[this.raw[i+1]] = this.raw[i+2];
                query.where = obj;
                break;
            case "limit":
                query.limit = this.raw[i+1];
                break;
            case "select":
                query.select = this.raw[i+1];
                break;
            case "order":
                query.order = { by: this.raw[i+1] };
                break;
            case "asc":
                break;
            case "desc":
                query.order = query.order || {};
                query.order.desc = true;
                break;
        }
    }
    var str = "SELECT " + query.select + " FROM " + this.model.schema.table ;
    var inputs = [];
    if (query.where) {
        // { where: { firstName: "David" } }
        if (typeof query.where === "object") {
            
            str += " WHERE ";
            var first = true;
            console.log("QUERY", query);
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
    this.query = { string: str + ";", inputs: inputs };
}