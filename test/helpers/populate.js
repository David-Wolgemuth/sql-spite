
var spite = require("../../sql-spite");

module.exports = function (done) {
    if (typeof done === "function") {
        populate(done);
    } else {
        return new Promise(function (resolve, reject) {
            populate(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    }
};
function populate (cb)
{
    var User = spite.model("User");
    var Group = spite.model("Group");
    var users = [
        { firstName: "Frank", lastName: "Sinatra" },
        { firstName: "Joe", lastName: "Shmoe" },
        { firstName: "Jim", lastName: "James" },
        { firstName: "Jane", lastName: "James" },
        { firstName: "Frank", lastName: "BigFace" }
    ];
    var groups = [
        { name: "The Puppies" },
        { name: "The BigShots" },
        { name: "Groupies" }
    ];
    createUsers(0);
    function createUsers (i) {
        if (i >= users.length) {
            return createGroups(0);
        }
        User.create(users[i]).run(function (err) {
            if (err) {
                return cb(err);
            }
            createUsers(i+1);
        });
    }
    function createGroups (i) {
        if (i >= groups.length) {
            return cb(null);
        }
        Group.create(groups[i]).run(function (err) {
            if (err) {
                return cb(err);
            }
            createGroups(i+1);
        });
    }
}
