var spite = require("./sql-spite");

module.exports = Promise.all([

    spite.connect("database"),

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
    }),

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
    }),

    spite.register({ model: "Group", table: "groups" }, {
        name:  "string",
        memberships: {
            type: "relationship",
            oneToMany: {
                table: "memberships",
                foreignKey: "groupId"
            }
        },
    })

]);