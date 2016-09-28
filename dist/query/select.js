"use strict";
function select() {
    var query = {
        select: "*",
        where: null,
        limit: null,
        order: null
    };
    if (typeof this.raw[1] === "number") {
        this.raw.splice(1, 0, "by", "id");
    }
    if (typeof this.raw[1] === "object") {
        var opts = this.raw[1];
        for (var key in opts) {
            if (key in query) {
                query[key] = opts[key];
            }
            if (key === "by") {
                query.where = opts[key];
                query.limit = 1;
            }
        }
    }
    for (var i = 0; i < this.raw.length; i++) {
        var obj;
        switch (this.raw[i]) {
            case "by":
                query.where = parseWhere(this.raw, i);
                query.limit = 1;
                break;
            case "where":
                query.where = parseWhere(this.raw, i);
                break;
            case "limit":
                query.limit = this.raw[i + 1];
                break;
            case "select":
                query.select = this.raw[i + 1];
                break;
            case "order":
                query.order = { by: this.raw[i + 1] };
                break;
            case "asc":
                break;
            case "desc":
                query.order = query.order || {};
                query.order.desc = true;
                break;
        }
    }
    var str = "SELECT " + query.select + " FROM " + this.model.schema.table;
    var inputs = [];
    if (query.where) {
        // { where: { firstName: "David" } }
        if (typeof query.where === "object") {
            str += " WHERE ";
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
exports.select = select;
function parseWhere(raw, i) {
    if (typeof raw[i + 1] === "string") {
        var obj = {};
        obj[raw[i + 1]] = raw[i + 2];
        return obj;
    }
    if (typeof raw[i + 1] === "object") {
        return raw[i + 1];
    }
    return null;
}
