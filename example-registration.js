
var spite = require("./sql-spite");

module.exports = function (done) {
    spite.connect("database", function (err) {
        if (err) {
            done(err);
        } else {
            registerUser(done);
        }
    });
};

function registerUser (done)
{ 
    spite.register({ model: "User", table: "users" }, { 
        firstName: "string",
        lastName: "string",
        memberships: {
            type: "relationship",
            oneToMany: {
                table: "memberships",
                foreignKey: "userId"
            }
        },
        groups: {
            type: "relationship",
            manyToMany: {
                through: "memberships",
                toOne: "group",
            }
        }
    }, function (err) {
        if (err) {
            done(err);
        } else {
            registerMembership(done);
        }
    });
}

function registerMembership (done)
{
    spite.register({ model: "Membership", table: "memberships" }, { 
        user: {
            type: "relationship",
            manyToOne: {
                table: "users",
                foreignKey: "userId"
            }
        },
        group: {
            type: "relationship",
            manyToOne: {
                table: "groups",
                foreignKey: "groupId"
            }
        }
    }, function (err) {
        if (err) {
            done(err);
        } else {
            registerGroup(done);
        }
    });
}

function registerGroup (done)
{
    spite.register({ model: "Group", table: "groups" }, {
        name:  "string",
        memberships: {
            type: "relationship",
            oneToMany: {
                table: "memberships",
                foreignKey: "groupId"
            }
        },
    }, function (err) {
        done(err);
    });
}