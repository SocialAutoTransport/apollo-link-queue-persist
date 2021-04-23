"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStorageWrapper = void 0;
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
exports.SessionStorageWrapper = SessionStorageWrapper;
//# sourceMappingURL=SessionStorageWrapper.js.map