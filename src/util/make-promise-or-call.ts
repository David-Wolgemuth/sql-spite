
import * as Promise from "bluebird";
export { makePromiseOrCall };

function makePromiseOrCall (func, args, cb)
{
    if (typeof cb === "function") {
        return func(args, cb);
    } else {
        return new Promise<any> (function(resolve: any, reject: any): void {
            func(args, function (err) {
                if (err){
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    }
}