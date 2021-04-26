import Log from './Log';
import Queue from './Queue';
import Storage from './Storage';
import Persistor from './Persistor';
import QueueLink from '@SocialAutoTransport/apollo-link-queue';
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
        var log = new Log(options);
        var queue = new Queue(options);
        var storage = new Storage(options);
        var persistor = new Persistor({ log: log, queue: queue, storage: storage }, options);
        this.log = log;
        this.queue = queue;
        this.storage = storage;
        this.persistor = persistor;
        QueueLink.addLinkQueueEventListener("any", "enqueue", function (item) {
            _this.log.info('QueueLink listener (any, enqueued) fired', item);
            _this.persistor.persist();
        });
        QueueLink.addLinkQueueEventListener("any", "dequeue", function (item) {
            _this.log.info('QueueLink listener (any, dequeue) fired', item);
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
    QueuePersistor.prototype.getLogs = function (print) {
        if (print === void 0) { print = false; }
        if (print) {
            this.log.tailLogs();
        }
        else {
            return this.log.getLogs();
        }
    };
    QueuePersistor.prototype.getSize = function () {
        return this.storage.getSize();
    };
    return QueuePersistor;
}());
export default QueuePersistor;
//# sourceMappingURL=QueuePersistor.js.map