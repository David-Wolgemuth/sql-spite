"use strict";
function sql() {
    var q = this.raw[1];
    if (typeof q[0] !== "string") {
        throw SyntaxError("Model#sql requires string as first argument");
    }
    this.query = { string: q[0], inputs: q[1] };
}
exports.sql = sql;
