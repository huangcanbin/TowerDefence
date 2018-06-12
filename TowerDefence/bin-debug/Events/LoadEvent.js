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
 * 加载类事件
 * 作为加载类的基类，直接引用类名调用RES.ResourceEvent的静态方法
 * @author Andrew_Huang
 * @class LoadEvent
 * @extends {RES.ResourceEvent}
 */
var LoadEvent = (function (_super) {
    __extends(LoadEvent, _super);
    function LoadEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        return _super.call(this, type, bubbles, cancelable) || this;
    }
    return LoadEvent;
}(RES.ResourceEvent));
__reflect(LoadEvent.prototype, "LoadEvent");
