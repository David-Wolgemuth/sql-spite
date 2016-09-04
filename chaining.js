
var spite = require("./sql-spite");

require("./example-registration")
.then(function () {
    var User = spite.model("User");
    var Group = spite.model("Group");
    var Membership = spite.model("Membership");

    Promise.all([
        User.create({ firstName: "Joe", lastName: "Pesci" }).run(),
        Group.create({ name: "The Peeps" }).run()
    ]).then(function (ids) {
        Membership.create({ userId: ids[0], groupId: ids[1] }).run()
        .then(function (mId) {
            console.log("Created", mId);
            printMembership(mId);
        });
    });
})
.catch(function () {
    console.log(arguments);
});
function printMembership(mId)
{
    var User = spite.model("User");
    var Group = spite.model("Group");
    var Membership = spite.model("Membership");
    console.log("ID:", mId);
    Membership.find.by.id(mId).row()
    .then(function (membership) {
        console.log("Membership:", membership);
    })
    .catch(function (err) {
        console.log(err);
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
