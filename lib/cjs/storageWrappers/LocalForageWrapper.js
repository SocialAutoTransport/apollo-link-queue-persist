"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalForageWrapper = void 0;
var LocalForageWrapper = (function () {
    function LocalForageWrapper(storage) {
        this.storage = storage;
    }
    LocalForageWrapper.prototype.getItem = function (key) {
        return this.storage.getItem(key);
    };
    LocalForageWrapper.prototype.removeItem = function (key) {
        return this.storage.removeItem(key);
    };
    LocalForageWrapper.prototype.setItem = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage
                .setItem(key, value)
                .then(function () { return resolve(); })
                .catch(function () { return reject(); });
        });
    };
    return LocalForageWrapper;
}());
exports.LocalForageWrapper = LocalForageWrapper;
//# sourceMappingURL=LocalForageWrapper.js.map