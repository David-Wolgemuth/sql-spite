module.exports = Schema;

function Schema (options, columns)
{
    this.columns = [];
    this.methods = [];
    this.table = options.table;
    
    var column;
    if (options.pk !== false) {
        column = new Column("id", "INTEGER PRIMARY KEY");
        this.columns.push(column);
    }
   
    for (var key in columns) {
        var type = columns[key];
        if (typeof type === "string") {
            column = new Column(key, type.toUpperCase());
            this.columns.push(column);
            continue;
        }
        if (typeof type.type !== "string") {
            throw Error("Cannot Determine Type Of " + key + type);
        }
        if (type.type !== "relationship") {
            column = new Column(key, type.type.toUpperCase());
            continue;
        }
        if (type.oneToMany) {
            column = new Column(type.oneToMany.foreignKey, "INTEGER");
            this.columns.push(column);
            type.oneToMany.type = "oneToMany";
            this.methods.push(type.oneToMany);
            continue;
        }
        if (type.manyToOne || type.manyToMany) {
            var m; 
            if (type.manyToOne) {
                m = type.manyToOne;
                m.type = "manyToOne";
            } else {
                m = type.manyToMany;
                m.type = "manyToMany";
            }
            this.methods.push(m);
            continue;
        }
        throw Error("Error creating Schema");
    }
    if (options.timestamps !== false) {
        column = new Column("createdAt", "INTEGER");
        this.columns.push(column);
        column = new Column("updatedAt", "INTEGER");
        this.columns.push(column);
    }
}

function Column (name, type)
{
    this.name = name;
    this.type = type;
}
