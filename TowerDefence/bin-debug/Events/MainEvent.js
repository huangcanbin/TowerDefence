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
/**
 * 主类事件
 * @author Andrew_Huang
 * @class MainEvent
 * @extends {egret.Event}
 */
var MainEvent = (function (_super) {
    __extends(MainEvent, _super);
    function MainEvent(type, resName, bubbles, cancelable) {
        if (resName === void 0) { resName = ""; }
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this._resName = "";
        _this._resName = resName;
        return _this;
    }
    Object.defineProperty(MainEvent.prototype, "resName", {
        get: function () {
            return this._resName;
        },
        enumerable: true,
        configurable: true
    });
    //用于打开加载下一个场景的资源
    MainEvent.OPENLOADBAR = "openloadbar";
    //移除上一个场景
    MainEvent.REMOVE = "remove";
    //加载完成
    MainEvent.LOADCOMP = "loadcomp";
    //暂停
    MainEvent.PAUSE = "pause";
    //退出关卡
    MainEvent.QUITGUANKA = "quitguanka";
    //再次尝试
    MainEvent.TRYAGAIN = "tryagain";
    return MainEvent;
}(egret.Event));
__reflect(MainEvent.prototype, "MainEvent");
