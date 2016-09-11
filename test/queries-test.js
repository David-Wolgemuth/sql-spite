
var expect = require("chai").expect;
var connect = require("./helpers/connect");
var register = require("./helpers/register");
var populate = require("./helpers/populate");
var spite = require("../sql-spite");
var syncPromises = require("../util/sync-promises");
var User, Group, Membership;

describe("model queries", function () {
    beforeEach(function (done) {
        syncPromises([
            function () { return connect() },
            function () { return register.all() },
            function () { return populate() }
        ]).then(function () {
            User = spite.model("User");
            Group = spite.model("Group");
            Membership = spite.model("Membership");
            done();
        })
        .catch(done);
    });
    describe("#find", function () {
        context("when passed nothing", function () {
            it("gets all in order of id", function (done) {
                User.find().rows()
                .then(function (users) {
                    expect(users.length).to.equal(5);
                    for (var i = 0; i < users.length; i++) {
                        expect(users[i].id).to.equal(i+1);
                    }
                    done();
                }).catch(done);
            });
        });
        context("when passed number", function () {
            it("searches by id if passed num", function (done) {
                Promise.all([
                    User.find(1).row(),
                    User.find(2).row(),
                    User.find(3).row()
                ]).then(function (users) {
                    for (var i = 0; i < users.length; i++) {
                        expect(users[i].id).to.equal(i+1);
                    }
                    done();
                }).catch(done);
            });
        });
        context("when passed '{ where: { property: value } }' preceding #where.property(value) or preceding #where({ property: value })", function () {
            it("finds all results that have property matching value", function (done) {
                Promise.all([
                    User.find.where.firstName("Frank").rows(),
                    User.find.where({ firstName: "Frank" }).rows(),
                    User.find({ where: { firstName: "Frank" } }).rows()
                ])
                .then(function (results) {
                    var users = results[0];
                    expect(users).to.have.lengthOf(2);
                    expect(users[0].id).to.equal(1);
                    expect(users[1].id).to.equal(5);
                    expect(users).to.deep.equal(results[1]);
                    expect(users).to.deep.equal(results[2]);
                    done();
                }).catch(done);
            });
        });
        context("when passed '{ by: { property: value } }' preceding #by.property(value) or preceding #by({ property: value })", function () {
            it("finds first result with property matching value", function (done) {
                Promise.all([
                    User.find.by.lastName("James").rows(),
                    User.find.by({ lastName: "James" }).rows(),
                    User.find({ by: { lastName: "James" } }).rows()
                ])
                .then(function (results) {
                    var users = results[0];
                    expect(users).to.have.lengthOf(1);  // 'by' limits to 1
                    expect(users[0].id).to.equal(3);
                    expect(users).to.deep.equal(results[1]);
                    expect(users).to.deep.equal(results[2]);
                    done();
                }).catch(done);
            });
        });
        context("when preceding #limit(number)", function () {
            it("limits to the number of results", function (done) {
                Promise.all([
                    User.find.limit(1).rows(),
                    User.find.limit(2).rows(),
                    User.find.limit(3).rows(),
                    User.find.limit(4).rows(),
                    User.find.limit(5).rows(),
                ]).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        expect(results[i]).to.have.lengthOf(i+1);
                    }
                    done();
                }).catch(done);
            });
            context("and #where.property(value) or #where({ property: value })", function () {
                it("both filters and limits", function (done) {
                    Promise.all([
                        User.find.where.lastName("James").limit(1).rows(),
                        User.find.where({ lastName: "James" }).limit(1).rows()
                    ])
                    .then(function (results) {
                        var users = results[0];
                        expect(users).to.have.lengthOf(1);
                        expect(users[0].lastName).to.equal("James");
                        expect(users).to.deep.equal(results[1]);
                        done();
                    }).catch(done);
                });
            });
        });
    });
});
