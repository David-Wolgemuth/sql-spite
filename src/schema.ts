
export { Schema, Attribute, SchemaOptions };

interface SchemaOptions {
    model: string;
    table: string;
    pk?: boolean;
    timestamps?: boolean;
    attributes: Array<AttributeInterface>;
}

class Schema
{
    attributes: Array<Attribute> = [];
    table: string;

    constructor (options: SchemaOptions)
    {
        const attributes = options.attributes || [];
        attributes.forEach( (attr: AttributeInterface) => {
            this.attributes.push(new Attribute(attr.name, attr.type, attr.opts));
        })
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

interface AttributeInterface
{
    name: string;
    type: string;
    opts?: Object;
}

class Attribute implements AttributeInterface
{
    name: string;
    type: string;
    opts: Object = null;

    constructor (name, type, opts)
    {
        this.name = name;
        this.type = type;
        this.opts = opts;
    }
    getSQLType ():string
    {
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

interface Relationship {

}
