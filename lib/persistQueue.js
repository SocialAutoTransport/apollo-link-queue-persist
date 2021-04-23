import QueuePersistor from './QueuePersistor';
export default (function (options) {
    var persistor = new QueuePersistor(options);
    return persistor.restore();
});
//# sourceMappingURL=persistQueue.js.map