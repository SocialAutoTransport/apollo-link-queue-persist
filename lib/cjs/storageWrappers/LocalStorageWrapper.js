"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageWrapper = void 0;
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
exports.LocalStorageWrapper = LocalStorageWrapper;
//# sourceMappingURL=LocalStorageWrapper.js.map