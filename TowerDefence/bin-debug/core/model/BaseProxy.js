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
 * 数据读取基类
 * @author Andrew_Huang
 * @class BaseProxy
 * @extends {puremvc.Proxy}
 * @implements {puremvc.IProxy}
 */
var BaseProxy = (function (_super) {
    __extends(BaseProxy, _super);
    function BaseProxy(proxyName) {
        if (proxyName === void 0) { proxyName = ''; }
        var _this = _super.call(this, proxyName) || this;
        _this._proxyName = "";
        _this._proxyName = proxyName;
        return _this;
    }
    return BaseProxy;
}(puremvc.Proxy));
__reflect(BaseProxy.prototype, "BaseProxy", ["puremvc.IProxy", "puremvc.INotifier"]);
