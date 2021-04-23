"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStorageWrapper = void 0;
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
exports.AsyncStorageWrapper = AsyncStorageWrapper;
//# sourceMappingURL=AsyncStorageWrapper.js.map