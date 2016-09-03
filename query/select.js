
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
                query.where = this.raw[i+1];
                query.limit = 1;
                break;
            case "where":
                query.where = this.raw[i+1];
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
    var str = "SELECT " + query.select + " FROM " + this.model.tableName;
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
    this.query = { string: str + ";", inputs: inputs };
}