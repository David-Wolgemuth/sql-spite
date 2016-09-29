
var Spite = require("./dist/sql-spite");
var spite = new Spite.Spite();

var con = spite.connect("test-database", function (err) {
    console.log("LOGGING", err);
});
