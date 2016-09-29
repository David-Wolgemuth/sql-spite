"use strict";
var TokenType;
(function (TokenType) {
    TokenType[TokenType["BuiltIn"] = 0] = "BuiltIn";
    TokenType[TokenType["Attribute"] = 1] = "Attribute";
    TokenType[TokenType["Value"] = 2] = "Value";
    TokenType[TokenType["Relationship"] = 3] = "Relationship";
})(TokenType || (TokenType = {}));
exports.TokenType = TokenType;
var BuiltIns = [
    "find", "create", "by", "where",
    "update", "delete",
    "all", "not", "desc",
    "select", "limit", "order",
    "first", "last",
    "sql"
];
exports.BuiltIns = BuiltIns;
class Token {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
    toString() {
        return `${this.value} (${Token.typeToString(this.type)})`;
    }
    static typeToString(type) {
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
exports.Token = Token;
