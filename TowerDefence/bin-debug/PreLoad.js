var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PreLoad = (function (_super) {
    __extends(PreLoad, _super);
    function PreLoad() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/UISkin/PreLoadSkin.exml";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    PreLoad.prototype.onAddToStage = function (event) {
        //加载资源
    };
    PreLoad.prototype.setProgress = function (current, total) {
        this.progress.value = current;
        this.progress.maximum = total;
    };
    return PreLoad;
}(eui.Component));
__reflect(PreLoad.prototype, "PreLoad");
