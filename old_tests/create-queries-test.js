
require("./registration-test");  // Ensure this test runs first
var expect = require("chai").expect;
var connect = require("./helpers/connect");
var register = require("./helpers/register");
var spite = require("./sql-spite");
var populate = require("./helpers/populate");

describe("model#create", function () {
    var User, Group, Membership;
    beforeEach(function (done) {
        connect(function (err) {
            expect(err).to.be.a("null");
            register.all(function (err) {
                expect(err).to.be.a("null");
                User = spite.model("User");
                Group = spite.model("Group");
                Membership = spite.model("Membership");
                done();
            });
        });
    });
    it("runs callback with id after successful insertion", function (done) {
        User.create({ firstName: "James", lastName: "Frank" }).run(function (err, uId) {
            expect(err).to.be.a("null");
            expect(uId).to.equal(1);
            Group.create({ name: "The Groups" }).run(function (err, gId) {
                expect(err).to.be.a("null");
                expect(gId).to.equal(1);
                Membership.create({ groupId: gId, userId: uId }).run(function (err, mId) {
                    expect(err).to.be.a("null");
                    expect(mId).to.equal(1);
                    done();
                });
            });
        });
    });
    it("returns a promise on #run if not passed a callback", function () {
        User.create({ firstName: "James", lastName: "Frank" }).run()
        .then(function (uId) {
            expect(uId).to.equal(1);
            Group.create({ name: "The Groups" }).run()
            .then(function (gId) {
                expect(gId).to.equal(1);
                Membership.create({ groupId: gId, userId: uId }).run()
                .then(function (mId) {
                    expect(mId).to.equal(1);
                    done();
                }).catch(function (err) {
                    expect(err).to.be.a("null");
                });
            }).catch(function (err) {
                expect(err).to.be.a("null");
            });
        }).catch(function (err) {
            expect(err).to.be.a("null");
        });
    });
    it("allows multiple to be created", function (done) {
        populate(function (err) {
            expect(err).to.be.a("null");
            done();
        });
    });  
});
