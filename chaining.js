
var spite = require("./sql-spite");


spite.connect("database");
spite.register("User", { firstName: "string", lastName: "string" });

var User = spite.model("User");

// User.create({ firstName: "Fred", lastName: "Flintstone" }).run(function (user) {
//     console.log("CREATED:", user);
// }).catch(function (err) {
//     console.log("ERRO", err);
// });

// var x = User.select("email").find.by.email("a@b.com").rows(function (users) {
User.select("id", "lastName").limit(1).desc.find().rows(function (users) {
    for (var i = 0; i < users.length; i++) {
        console.log(" >", users[i]);
    }
}).catch(function (err) {
    console.log("ERR", err);
});

spite.db.close();
// console.log(x.str);
