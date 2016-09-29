
var User = require("spite").model("User");

//------------ Create -------------//
User.email("example@website.com").password("s3cr3t").create(function () {

});
User.create({ email: "example@website.com", password: "s3cr3t" }, function () {

});

// Optionally Use Promise
User.create({ email: "example@website.com", password: "s3cr3t" }).then(function (user) {

}).catch(function (error) {});


//------------ Find By/Where Id -------------//
User.find(12).row(function (user) {  // Limit 1

});
User.find().id(12).row(function (user) {

});
User.find({ id: 12 }).row(function (user) {

});
User.find().by({ id: 12 }).row(function (user) {  // Limit 1

});
User.find().by().id(12).row(function (user) {  // Limit 1

});
User.id(12).row(function (user) {

});
User.id(12).one().row(function (user) {  // Limit 1

});

// Optionally Use Promise
User.id(12).one().row().then(function (user) {

}).catch(function (error) {});

spite.register({ model: "ToDoItem", table: "todoitems", attributes: [
    { name: "description", type: "string" },
    { name: "dueDate", type: "date" },
    { name: "user", type: "relationship", opts: { manyToOne: "user" } }
]
}, callback);
