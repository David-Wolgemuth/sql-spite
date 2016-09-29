
export { Token, TokenType, BuiltIns };

enum TokenType {
    BuiltIn,
    Attribute,
    Value,
    Relationship
}

var BuiltIns = [
    "find", "create", "by", "where",
    "update", "delete",
    "all", "not", "desc",
    "select", "limit", "order",
    "first", "last",
    "sql"
]

class Token {
    public value: any;
    public type: TokenType;
    public constructor(value: any, type: TokenType) {
        this.value = value;
        this.type = type;
    }
    public toString () {
        return `${this.value} (${Token.typeToString (this.type)})`;
    }
    static typeToString (type: TokenType): string {
        switch (type) {
            case TokenType.BuiltIn:
                return "BuiltInt";
            case TokenType.Attribute:
                return "Attribute";
            case TokenType.Value:
                return "Value";
            case TokenType.Relationship:
                return "Relationship";
        }
        return "null";
    }
}
