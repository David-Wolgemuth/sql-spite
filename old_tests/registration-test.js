
var expect = require("chai").expect;
var connect = require("./helpers/connect");
var register = require("./helpers/register");
var fs = require("fs");
var spite = require("./sql-spite");

describe("spite#connect(dbName, cb)", function () {
    it("creates / connects to a database", function (done) {
        connect(function (err) {
            expect(err).to.be.a("null");
            fs.exists("test_database.sqlite3", function (exists) {
                expect(exists).to.equal(true);
                done();
            });
        });
    });
    it("can register tables", function (done) {
        register.all(function (err) {
            expect(err).to.be.a("null");
            done();
        });
    });
    it("gives access to models from sql-spite file", function () {
         var User = spite.model("User");
         var Group = spite.model("Group");
         var Membership = spite.model("Membership");
    });
});