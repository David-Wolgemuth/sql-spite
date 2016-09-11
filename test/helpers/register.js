
var spite = require("../../sql-spite");

var register = {
    user: registerUser,
    membership: registerMembership,
    group: registerGroup,
    all: function (done) {
        if (typeof done === "function") {
            register.user(function (err) {
                if (err) { return done(err); }
                register.membership(function (err) {
                    if (err) { return done(err); }
                    register.group(done);
                });
            });
        } else {
            return Promise.all([
                register.user(),
                register.membership(),
                register.group()
            ]);
        }
    }
};

module.exports = register;

function registerUser (done)
{ 
    return spite.register({ model: "User", table: "users" }, { 
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
                onOne: "group",
            }
        }
    }, done);
}

function registerMembership (done)
{
    return spite.register({ model: "Membership", table: "memberships" }, { 
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
    }, done);
}

function registerGroup (done)
{
    return spite.register({ model: "Group", table: "groups" }, {
        name:  "string",
        memberships: {
            type: "relationship",
            oneToMany: {
                table: "memberships",
                foreignKey: "groupId"
            }
        },
        users: {
            type: "relationship",
            manyToMany: {
                through: "memberships",
                onOne: "user"
            }
        }
    }, done);
}