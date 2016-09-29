"use strict";
class Schema {
    constructor(options) {
        this.attributes = [];
        const attributes = options.attributes || [];
        attributes.forEach((attr) => {
            this.attributes.push(new Attribute(attr.name, attr.type, attr.opts));
        });
        this.table = options.table;
        // Defaults to True
        if (options.pk !== false) {
            this.attributes.push(new Attribute("id", "pk", null));
        }
        if (options.timestamps === true) {
            this.attributes.push(new Attribute("createdAt", "date", null));
            this.attributes.push(new Attribute("updatedAt", "date", null));
        }
    }
}
exports.Schema = Schema;
class Attribute {
    constructor(name, type, opts) {
        this.opts = null;
        this.name = name;
        this.type = type;
        this.opts = opts;
    }
    getSQLType() {
        if (this.type === "pk") {
            return "INTEGER PRIMARY KEY";
        }
        if (["int", "date", "bool", "boolean"].indexOf(this.type) >= 0) {
            return "INTEGER";
        }
        if (["string", "text", "varchar"].indexOf(this.type) >= 0) {
            return "TEXT";
        }
        if (["data", "blob"].indexOf(this.type) >= 0) {
            return "BLOB";
        }
        if (["double", "decimal", "float", "real"].indexOf(this.type) >= 0) {
            return "REAL";
        }
        return this.type;
    }
}
exports.Attribute = Attribute;
