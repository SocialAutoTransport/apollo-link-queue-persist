"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue_1 = require("./Queue");
var Storage_1 = require("./Storage");
var Persistor_1 = require("./Persistor");
var apollo_link_queue_1 = require("@SocialAutoTransport/apollo-link-queue");
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
        var queue = new Queue_1.default(options);
        var storage = new Storage_1.default(options);
        var persistor = new Persistor_1.default({ queue: queue, storage: storage }, options);
        this.queue = queue;
        this.storage = storage;
        this.persistor = persistor;
        apollo_link_queue_1.default.addLinkQueueEventListener("mutation", "enqueue", function (item) {
            console.log('QueuePersistor: mutation enqueued', item);
            _this.persistor.persist();
        });
        apollo_link_queue_1.default.addLinkQueueEventListener("mutation", "dequeue", function (item) {
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
exports.default = QueuePersistor;
//# sourceMappingURL=QueuePersistor.js.map