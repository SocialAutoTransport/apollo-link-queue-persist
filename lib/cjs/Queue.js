"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue(options) {
        var queueLink = options.queueLink, _a = options.serialize, serialize = _a === void 0 ? true : _a, client = options.client, beforeRestore = options.beforeRestore, onCompleted = options.onCompleted, onError = options.onError;
        this.queueLink = queueLink;
        this.serialize = serialize;
        this.client = client;
        this.beforeRestore = beforeRestore;
        this.onCompleted = onCompleted;
        this.onError = onError;
    }
    Queue.prototype.extract = function () {
        var data = '';
        var entries = this.queueLink.getQueue().map(function (entry) {
            var context = entry.operation.getContext();
            context.cache = undefined;
            context.getCacheKey = undefined;
            return {
                query: entry.operation.query,
                variables: entry.operation.variables,
                operationName: entry.operation.operationName,
                context: context,
                extensions: entry.operation.extensions,
            };
        });
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
                var workingGraphqlRequest = __assign({}, graphqlRequest);
                try {
                    workingGraphqlRequest = _this.beforeRestore(workingGraphqlRequest);
                }
                catch (error) { }
                var _a = workingGraphqlRequest, query = _a.query, variables = _a.variables, context = _a.context;
                if (_this.queueLink.isType(query, 'mutation')) {
                    _this.client.mutate({ mutation: query, variables: variables, context: context })
                        .then(function (response) {
                        if (_this.onCompleted)
                            _this.onCompleted(workingGraphqlRequest, response);
                    })
                        .catch(function (error) {
                        if (_this.onError)
                            _this.onError(workingGraphqlRequest, error);
                    });
                }
                else {
                    _this.client.query({ query: query, variables: variables, context: context })
                        .then(function (response) {
                        if (_this.onCompleted)
                            _this.onCompleted(workingGraphqlRequest, response);
                    })
                        .catch(function (error) {
                        if (_this.onError)
                            _this.onError(workingGraphqlRequest, error);
                    });
                }
            });
        }
    };
    return Queue;
}());
exports.default = Queue;
//# sourceMappingURL=Queue.js.map