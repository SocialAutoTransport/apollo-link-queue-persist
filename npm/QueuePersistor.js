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
        var queue = new Queue(options);
        var storage = new Storage(options);
        var persistor = new Persistor({ queue: queue, storage: storage }, options);
        this.queue = queue;
        this.storage = storage;
        this.persistor = persistor;
        QueueLink.addLinkQueueEventListener("mutation", "enqueue", function (item) {
            console.log('QueuePersistor: mutation enqueued', item);
            _this.persistor.persist();
        });
        QueueLink.addLinkQueueEventListener("mutation", "dequeue", function (item) {
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
export default QueuePersistor;
//# sourceMappingURL=QueuePersistor.js.map