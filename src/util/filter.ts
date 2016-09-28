
export { filter };

var filter = {
    one: function (arr, permitted)
    {
        var val;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < permitted.length; j++) {
                if (permitted[j] === arr[i]) {
                    if (val) {
                        throw SyntaxError("Cannot use both \"" + val + "\" and \"" + arr[i] + "\" within same query");
                    }
                    val = arr[i];
                }
            }
        }
        return val;
    }
};
