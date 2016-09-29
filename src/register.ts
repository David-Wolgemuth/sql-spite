
export { register };

import { Schema, Attribute, SchemaOptions } from "./schema";
import { Model } from "./model";

interface SchemaInfo {
    model: string;
    table: string;
}

function register (info: SchemaOptions, cb: (error:any)=>void )
{
    if (!info) {
        throw Error("Schema Required to Register Model");
    }
    if (typeof info.model !== "string" || typeof info.table !== "string") {
        throw Error("model and table name are required to register model");
    }
    if (this.registered[info.model]) {
        throw ReferenceError("Model \"" + info + "\" already exists");
    }

    var schema = new Schema(info);
    var str = "CREATE TABLE IF NOT EXISTS " + schema.table + " ( ";
    var first = true;
    schema.attributes.forEach( (attr: Attribute, idx: Number) => {
        if (attr.type === "relationship") {
            return;
        }
        if (!first) {
            str += ", ";
        }
        first = false;
        str += attr.name + " " + attr.getSQLType();
    });
    str += " )";
    var model = new Model(schema);
    this.db.run(str, (error:Error) => {
        if (!error) {
            this.registered[info.model] = model;
        }
        cb(error);
    });
}