/// <reference path="__init__.ts"/>
var dsync;
(function (dsync) {
    var Container = (function () {
        function Container() {
        }
        return Container;
    })();
    dsync.Container = Container;
})(dsync || (dsync = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="__init__.ts"/>
var dsync;
(function (dsync) {
    var Sync = (function () {
        function Sync() {
        }
        Sync.prototype.sync = function (model, display, dt) {
            return this._update();
        };

        Sync.prototype._update = function () {
            return null;
        };
        return Sync;
    })();
    dsync.Sync = Sync;

    var ModelSync = (function (_super) {
        __extends(ModelSync, _super);
        function ModelSync() {
            _super.apply(this, arguments);
        }
        return ModelSync;
    })(Sync);
    dsync.ModelSync = ModelSync;
})(dsync || (dsync = {}));
