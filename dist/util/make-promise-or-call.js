"use strict";
function makePromiseOrCall(func, args, cb) {
    if (typeof cb === "function") {
        return func(args, cb);
    }
    else {
        return new Promise(function (resolve, reject) {
            func(args, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(err);
                }
            });
        });
    }
}
exports.makePromiseOrCall = makePromiseOrCall;
