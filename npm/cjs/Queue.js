"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue(options) {
        var queueLink = options.queueLink, _a = options.serialize, serialize = _a === void 0 ? true : _a, client = options.client;
        this.queueLink = queueLink;
        this.serialize = serialize;
        this.client = client;
    }
    Queue.prototype.extract = function () {
        console.log('Queue.extract() start');
        var data = '';
        var entries = this.queueLink.getQueue().map(function (entry) { return ({
            query: entry.operation.query,
            variables: entry.operation.variables,
            operationName: entry.operation.operationName,
            context: {},
            extensions: entry.operation.extensions,
        }); });
        console.log('Queue.extract() entries:', entries);
        if (this.serialize) {
            data = JSON.stringify(entries);
            console.log('Queue.extract() serialize:', data);
        }
        return data;
    };
    Queue.prototype.restore = function (data) {
        var parsedData = null;
        if (this.serialize && typeof data === 'string') {
            parsedData = JSON.parse(data);
        }
        else {
        }
        if (parsedData != null) {
            console.log('Queue.restore() parsedData: ', parsedData);
            for (var graphqlRequest in parsedData) {
                console.log('Queue.restore() foreach parsedData.graphqlRequest: ', graphqlRequest);
                var _a = graphqlRequest, query = _a.query, variables = _a.variables, context = _a.context;
                console.log('Queue.restore() graphqlRequest destructured: ', query, variables, context);
                if (this.queueLink.isType(query, 'mutation')) {
                    this.client.mutate({ mutation: query, variables: variables, context: context });
                }
                else {
                    this.client.query({ query: query, variables: variables, context: context });
                }
            }
        }
    };
    return Queue;
}());
exports.default = Queue;
//# sourceMappingURL=Queue.js.map