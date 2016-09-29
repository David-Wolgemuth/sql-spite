
var sqlSpite = require("../dist/sql-spite");

var expect = require("chai").expect;

describe("sql-spite", function () {
    var spite;
    it("is instantiated with new, then is shared as a singleton", function () {
        spite = new sqlSpite.Spite();
        expect(spite).to.be.an("object");
        spite = sqlSpite.spite;
        expect(spite).to.be.an("object");
    });
    describe("#connect(@name, @callback)", function () {
        it("returns connects to and creates a database if needed", function (done) {
            spite.connect("test-database", done);
        });
    });
    describe("#disconnect()", function () {
        it("sets the db to be null after closing db", function () {
            spite.disconnect();
            expect(spite.db).to.be.a("null");
        });
    });
    describe("#register(@info, @columns, cb)", function () {
        beforeEach(function (done) {
            spite = new sqlSpite.Spite();
            spite.connect("test-database", function (err) {
                expect(err).to.be.a("null");
                done();
            });
        });
        afterEach(function () {
            spite.disconnect();
        });
        it("creates and stores a model with name and tableName provided in @info", function (done) {
            spite.register({ model: "User", table: "users", attributes: [] }, function (err) {
                expect(err).to.be.a("null");
                var User; 
                expect(function () { User = spite.model("User") }).to.not.throw(ReferenceError);
                expect(User.schema.table).to.equal("users");
                done();
            });
        });
        it("creates method for 'id' unless { pk: false }", function (done) {
            spite.register({ model: "Thing", table: "things" }, function (err) {
                expect(err).to.be.a("null");
                var Thing = spite.model("Thing");
                expect(Thing.id).to.be.a("function");
                spite.register({ model: "Animal", table: "animals", pk: false, 
                    attributes: [{ name: "placeholder", type: "string"}]}, function (err) {
                    expect(err).to.be.a("null");
                    var Animal = spite.model("Animal");
                    expect(Animal.id).not.to.be.a("function");
                    done();
                });
            });
        });
        it("creates method for 'createdAt'/'updatedAt' if { timestamps: true }", function (done) {
            spite.register({ model: "Thing", table: "things" }, function (err) {
                expect(err).to.be.a("null");
                var Thing = spite.model("Thing");
                expect(Thing.createdAt).not.to.be.a("function");
                expect(Thing.updatedAt).not.to.be.a("function");
                spite.register({ model: "Animal", table: "animals", timestamps: true }, function (err) {
                    expect(err).to.be.a("null");
                    var Animal = spite.model("Animal");
                    expect(Animal.createdAt).to.be.a("function");
                    expect(Animal.updatedAt).to.be.a("function");
                    done();
                });
            });
        });
        it("creates methods for any columns passed in @columns", function (done) {
            spite.register({ model: "Note", table: "notes", attributes: [ 
                    { name: "content", type: "string" }, 
                    { name: "priority", type: "number" },
                    { name: "completed", type: "boolean" }
                ]}, 
                function (err) {
                    expect(err).to.be.a("null");
                    var Note = spite.model("Note");
                    expect(Note.content).to.be.a("function");
                    expect(Note.priority).to.be.a("function");
                    expect(Note.completed).to.be.a("function");
                    done();
                }
            );
        });
    });
});
