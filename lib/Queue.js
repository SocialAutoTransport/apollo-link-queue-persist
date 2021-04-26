var Queue = (function () {
    function Queue(options) {
        var queueLink = options.queueLink, _a = options.serialize, serialize = _a === void 0 ? true : _a, client = options.client;
        this.queueLink = queueLink;
        this.serialize = serialize;
        this.client = client;
    }
    Queue.prototype.extract = function () {
        var data = '';
        var entries = this.queueLink.getQueue().map(function (entry) { return ({
            query: entry.operation.query,
            variables: entry.operation.variables,
            operationName: entry.operation.operationName,
            context: {},
            extensions: entry.operation.extensions,
        }); });
        if (this.serialize) {
            data = JSON.stringify(entries);
        }
        return data;
    };
    Queue.prototype.restore = function (data) {
        var _this = this;
        var parsedData = null;
        if (this.serialize && typeof data === 'string') {
            parsedData = JSON.parse(data);
        }
        else {
        }
        if (parsedData != null) {
            parsedData.map(function (graphqlRequest) {
                var _a = graphqlRequest, query = _a.query, variables = _a.variables, context = _a.context;
                if (_this.queueLink.isType(query, 'mutation')) {
                    _this.client.mutate({ mutation: query, variables: variables, context: context });
                }
                else {
                    _this.client.query({ query: query, variables: variables, context: context });
                }
            });
        }
    };
    return Queue;
}());
export default Queue;
//# sourceMappingURL=Queue.js.map