(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@SocialAutoTransport/apollo-link-queue')) :
    typeof define === 'function' && define.amd ? define(['exports', '@SocialAutoTransport/apollo-link-queue'], factory) :
    (global = global || self, factory(global['apollo-cache-persist'] = {}, global.QueueLink));
}(this, (function (exports, QueueLink) { 'use strict';

    QueueLink = QueueLink && QueueLink.hasOwnProperty('default') ? QueueLink['default'] : QueueLink;

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
            var _this = this;
            var parsedData = null;
            if (this.serialize && typeof data === 'string') {
                parsedData = JSON.parse(data);
            }
            if (parsedData != null) {
                console.log('Queue.restore() parsedData: ', parsedData);
                parsedData.map(function (graphqlRequest) {
                    console.log('Queue.restore() foreach parsedData.graphqlRequest: ', graphqlRequest);
                    var _a = graphqlRequest, query = _a.query, variables = _a.variables, context = _a.context;
                    console.log('Queue.restore() graphqlRequest destructured: ', query, variables, context);
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

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Storage = (function () {
        function Storage(options) {
            var storage = options.storage, _a = options.key, key = _a === void 0 ? 'apollo-link-queue-persist' : _a;
            this.storage = storage;
            this.key = key;
        }
        Storage.prototype.read = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, this.storage.getItem(this.key)];
                });
            });
        };
        Storage.prototype.write = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Storage.write() called with data.', data);
                            console.log('Storage.write() About to call storage.setItem(this.key, data) ', this.key, data);
                            return [4, this.storage.setItem(this.key, data)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Storage.prototype.purge = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.storage.removeItem(this.key)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Storage.prototype.getSize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.storage.getItem(this.key)];
                        case 1:
                            data = _a.sent();
                            if (data == null) {
                                return [2, 0];
                            }
                            else {
                                return [2, typeof data === 'string' ? data.length : null];
                            }
                    }
                });
            });
        };
        return Storage;
    }());

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Persistor = (function () {
        function Persistor(_a, options) {
            var queue = _a.queue, storage = _a.storage;
            var _b = options.maxSize, maxSize = _b === void 0 ? 1024 * 1024 : _b;
            this.queue = queue;
            this.storage = storage;
            this.paused = false;
            if (maxSize) {
                this.maxSize = maxSize;
            }
        }
        Persistor.prototype.persist = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, error_1;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Persistor.persist() start');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            data = this.queue.extract();
                            console.log('Persistor.persist() queue.extract() result: ', data);
                            if (!(this.maxSize != null &&
                                typeof data === 'string' &&
                                data.length > this.maxSize &&
                                !this.paused)) return [3, 3];
                            return [4, this.purge()];
                        case 2:
                            _a.sent();
                            this.paused = true;
                            return [2];
                        case 3:
                            if (this.paused) {
                                return [2];
                            }
                            console.log('Persistor.persist() made it to storage.write(data)');
                            return [4, this.storage.write(data)];
                        case 4:
                            _a.sent();
                            return [3, 6];
                        case 5:
                            error_1 = _a.sent();
                            console.error('Persistor.persist() unexpected error: ', error_1.message, error_1.stack, error_1);
                            throw error_1;
                        case 6: return [2];
                    }
                });
            });
        };
        Persistor.prototype.restore = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var data, error_2;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4, this.storage.read()];
                        case 1:
                            data = _a.sent();
                            if (!(data != null)) return [3, 3];
                            return [4, this.queue.restore(data)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [3, 5];
                        case 4:
                            error_2 = _a.sent();
                            throw error_2;
                        case 5: return [2];
                    }
                });
            });
        };
        Persistor.prototype.purge = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var error_3;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4, this.storage.purge()];
                        case 1:
                            _a.sent();
                            return [3, 3];
                        case 2:
                            error_3 = _a.sent();
                            throw error_3;
                        case 3: return [2];
                    }
                });
            });
        };
        return Persistor;
    }());

    var QueuePersistor = (function () {
        function QueuePersistor(options) {
            var _this = this;
            if (!options.queueLink) {
                throw new Error('In order to persist your Apollo Link Queue, you need to pass in a link queue instance. ' +
                    'Please see https://github.com/helfer/apollo-link-queue for more information.');
            }
            if (!options.storage) {
                throw new Error('In order to persist your Apollo Link Queue, you need to pass in an underlying storage provider. ' +
                    'Please see https://github.com/SocialAutoTransport/apollo-link-queue-persist#storage-providers');
            }
            var queue = new Queue(options);
            var storage = new Storage(options);
            var persistor = new Persistor({ queue: queue, storage: storage }, options);
            this.queue = queue;
            this.storage = storage;
            this.persistor = persistor;
            QueueLink.addLinkQueueEventListener("any", "enqueue", function (item) {
                console.log('QueuePersistor: mutation enqueued', item);
                _this.persistor.persist();
            });
            QueueLink.addLinkQueueEventListener("any", "dequeue", function (item) {
                console.log('QueuePersistor: mutation dequeued', item);
                _this.persistor.persist();
            });
        }
        QueuePersistor.prototype.persist = function () {
            return this.persistor.persist();
        };
        QueuePersistor.prototype.restore = function () {
            return this.persistor.restore();
        };
        QueuePersistor.prototype.purge = function () {
            return this.persistor.purge();
        };
        return QueuePersistor;
    }());

    var persistQueue = (function (options) {
        var persistor = new QueuePersistor(options);
        return persistor.restore();
    });

    var AsyncStorageWrapper = (function () {
        function AsyncStorageWrapper(storage) {
            this.storage = storage;
        }
        AsyncStorageWrapper.prototype.getItem = function (key) {
            return this.storage.getItem(key);
        };
        AsyncStorageWrapper.prototype.removeItem = function (key) {
            return this.storage.removeItem(key);
        };
        AsyncStorageWrapper.prototype.setItem = function (key, value) {
            return this.storage.setItem(key, value);
        };
        return AsyncStorageWrapper;
    }());

    var IonicStorageWrapper = (function () {
        function IonicStorageWrapper(storage) {
            this.storage = storage;
        }
        IonicStorageWrapper.prototype.getItem = function (key) {
            return this.storage.get(key);
        };
        IonicStorageWrapper.prototype.removeItem = function (key) {
            return this.storage.remove(key);
        };
        IonicStorageWrapper.prototype.setItem = function (key, value) {
            return this.storage.set(key, value);
        };
        return IonicStorageWrapper;
    }());

    var LocalForageWrapper = (function () {
        function LocalForageWrapper(storage) {
            this.storage = storage;
        }
        LocalForageWrapper.prototype.getItem = function (key) {
            return this.storage.getItem(key);
        };
        LocalForageWrapper.prototype.removeItem = function (key) {
            return this.storage.removeItem(key);
        };
        LocalForageWrapper.prototype.setItem = function (key, value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.storage
                    .setItem(key, value)
                    .then(function () { return resolve(); })
                    .catch(function () { return reject(); });
            });
        };
        return LocalForageWrapper;
    }());

    var LocalStorageWrapper = (function () {
        function LocalStorageWrapper(storage) {
            this.storage = storage;
        }
        LocalStorageWrapper.prototype.getItem = function (key) {
            return this.storage.getItem(key);
        };
        LocalStorageWrapper.prototype.removeItem = function (key) {
            return this.storage.removeItem(key);
        };
        LocalStorageWrapper.prototype.setItem = function (key, value) {
            return this.storage.setItem(key, value);
        };
        return LocalStorageWrapper;
    }());

    var MMKVStorageWrapper = (function () {
        function MMKVStorageWrapper(storage) {
            this.storage = storage;
        }
        MMKVStorageWrapper.prototype.getItem = function (key) {
            return this.storage.getItem(key);
        };
        MMKVStorageWrapper.prototype.removeItem = function (key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.storage
                    .removeItem(key)
                    .then(function () { return resolve(); })
                    .catch(function () { return reject(); });
            });
        };
        MMKVStorageWrapper.prototype.setItem = function (key, value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.storage
                    .setItem(key, value)
                    .then(function () { return resolve(); })
                    .catch(function () { return reject(); });
            });
        };
        return MMKVStorageWrapper;
    }());

    var SessionStorageWrapper = (function () {
        function SessionStorageWrapper(storage) {
            this.storage = storage;
        }
        SessionStorageWrapper.prototype.getItem = function (key) {
            return this.storage.getItem(key);
        };
        SessionStorageWrapper.prototype.removeItem = function (key) {
            return this.storage.removeItem(key);
        };
        SessionStorageWrapper.prototype.setItem = function (key, value) {
            return this.storage.setItem(key, value);
        };
        return SessionStorageWrapper;
    }());

    exports.AsyncStorageWrapper = AsyncStorageWrapper;
    exports.IonicStorageWrapper = IonicStorageWrapper;
    exports.LocalForageWrapper = LocalForageWrapper;
    exports.LocalStorageWrapper = LocalStorageWrapper;
    exports.MMKVStorageWrapper = MMKVStorageWrapper;
    exports.QueuePersistor = QueuePersistor;
    exports.SessionStorageWrapper = SessionStorageWrapper;
    exports.persistQueue = persistQueue;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
