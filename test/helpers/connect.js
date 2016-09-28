
var spite = require("../sql-spite");
var fs = require("fs");

module.exports = function (done) {
    if (typeof done === "function") {
        connect(done);
    } else {
        return new Promise(function (resolve, reject) {
            connect(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    }
};
function connect (done) {
    spite.disconnect();
    var dbName = "test_database";
    fs.exists(dbName + ".sqlite3", function (exists) {
        if (exists) {
            fs.unlink(dbName + ".sqlite3", function (err) {
                if (err) { 
                    return done(err);
                }
                return spite.connect(dbName, done);
            });
        } else {
            return spite.connect(dbName, done);
        }
    });
};