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
export { LocalStorageWrapper };
//# sourceMappingURL=LocalStorageWrapper.js.map