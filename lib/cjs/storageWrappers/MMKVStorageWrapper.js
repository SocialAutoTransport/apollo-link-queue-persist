"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMKVStorageWrapper = void 0;
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
exports.MMKVStorageWrapper = MMKVStorageWrapper;
//# sourceMappingURL=MMKVStorageWrapper.js.map