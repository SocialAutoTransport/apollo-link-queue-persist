"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueuePersistor_1 = require("./QueuePersistor");
exports.default = (function (options) {
    var persistor = new QueuePersistor_1.default(options);
    return persistor.restore();
});
//# sourceMappingURL=persistQueue.js.map