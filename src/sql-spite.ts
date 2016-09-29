
export { Spite, sharedInstance as spite };
export default sharedInstance;

import { Model } from "./model";
import * as sqlite3 from "sqlite3";
import { makePromiseOrCall } from "./util/make-promise-or-call";
import { register } from "./register";

var sharedInstance: Spite = null;

class Spite {

    registered = {};
    db = null;

    constructor ()
    {
        if (!sharedInstance) {
            sharedInstance = this;
        } else {
            return sharedInstance;
        }
    }
    public connect (name: string, callback?: (error: any) => void): void
    {
        this.db = new sqlite3.Database(name + ".sqlite3", function (err) {
            callback(err);
        });
    }
    public disconnect ()
    {
        this.registered = {};
        this.db.close();
        this.db = null;
    }
    public model (name)
    {
        if (this.registered[name]) {
            return this.registered[name];
        }
        throw ReferenceError("Model \"" + name + "\" does not exist");
    }
    public register (options, schema, cb)
    {
        register.call(this, options, schema, cb);
    }
    public schemas ()
    {
        var output = [];
        for (var key in this.registered) {
            output.push(this.registered[key].schema);
        }
        return output;
    }
}
