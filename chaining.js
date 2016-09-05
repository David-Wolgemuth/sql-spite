
var spite = require("./sql-spite");
var register = require("./example-registration");

var User, Group, Membership;

register(function (err) {
    if (err) {
        return console.log("Error:", err);
    }
    User = spite.model("User");
    Group = spite.model("Group");
    Membership = spite.model("Membership");
    createMembership(printMembership);
});

function createUser (done)
{
    User.create({ firstName: "Joe", lastName: "Pesci" }).run(done);
}
function createGroupAndUser (done)
{
    createUser(function (err, userId) {
        if (err) {
            return done(err);
        }
        Group.create({ name: "The Peeps" }).run(function (err, groupId) {
            done(err, groupId, userId);
        });
    });
}
function createMembership (done)
{
    createGroupAndUser(function (err, groupId, userId) {
        if (err) {
            return done(err);
        }
        Membership.create({ userId: userId, groupId: groupId }).run(done);
    });
}

function printMembership(err, mId)
{
    console.log("ID:", mId);
    Membership.find.by.id(mId).row(function (err, membership) {
        console.log("Error:", err);
        console.log("Membership:", membership);
        var Model = require("./model-generator");
        membership = new Model(Membership.schema, membership);
        console.log("Id:", membership.id());
        console.log("Old User:", membership.userId());
        console.log("Old Group:", membership.groupId());
        membership.userId(16).groupId(16).save(function (err, changes) {
            console.log("New User:", membership.userId());
            console.log("New Group:", membership.groupId());
            membership.group(function (err, group) {
                console.log("I'll be so happy", err, group);
            });
            membership.user(function (err, user) {
                console.log("Who will win?", err, user);
                user = new Model(User.schema, user);
                user.memberships(function (err, memberships) {
                    console.log("Many?", err, memberships);
                });
            });
        });
    });
}
// .then(function () {

    // console.log("What happsssened", arguments);
    // var User = spite.model("User");
    // var Membership = spite.model("Membership");
    // var Group = spite.model("Group");

    // User.create({ firstName: "Joe", lastName: "Pesci" }).run(function (userId) {
    //     console.log("User", userId);
    //     Group.create({ name: "The Things" }).run(function (groupId) {
    //         console.log("Group", groupId);
    //         Membership.create({ userId: userId, groupId: groupId }).run(function (mId) {
    //             console.log("Membership", mId);
    //         }).catch(function (err) { console.log(err); });
    //     }).catch(function (err) { console.log(err);});
    // }).catch(function (err) { console.log(err); });

// })
// .catch(function () {
//     console.log("What happened", arguments);
// });

// spite.connect("database");
// spite.register({ model: "User", table: "users" }, { firstName: "string", lastName: "string", email: "string" });

// User.create({ firstName: "Frankie", lastName: "BigFace" }).run(function (user) {
//     console.log("CREATED:", user);
// }).catch(function (err) {
//     console.log("ERRO", err);
// });
// User.find.rows(function (users) {
//     console.log("USERS:", users);
// });
// User.find.by.firstName("Jamie").select(["firstName", "createdAt"]).row(function (user) {
//     console.log("USER:", user);
// });
// User.find().each(function (user) {
//     console.log("User:", user.firstName, user.createdAt);
// });
// .catch(function (err) {
//     console.log("ERR:", err);
// });
// var x = User.select("email").find.by.email("a@b.com").rows(function (users) {
// User.find.select("id", "lastName").limit(1).desc.find().rows(function (users) {
//     for (var i = 0; i < users.length; i++) {
//         console.log(" >", users[i]);
//     }
// }).catch(function (err) {
//     console.log("ERR", err);
// });

// console.log(">- 1 -<");
// User.sql("INSERT INTO users (firstName, lastName) VALUES (?, ?)", ["Mr", "Bill"]).run(function (res) {
//     console.log("RES:", res);
// });
// User.create({ firstName: "Jamie", lastName: "Hanks" }).run();
// console.log(">- 2 -<");
// User.find().each(function (user) {
//     console.log(" >", user.firstName, user.lastName);
// });
// console.log(">- 3 -<");

spite.db.close();
// console.log(x.str);
