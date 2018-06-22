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
 * 启动项
 * @author Andrew_Huang
 * @class AppFacade
 * @extends {puremvc.Facade}
 * @implements {puremvc.IFacade}
 */
var AppFacade = (function (_super) {
    __extends(AppFacade, _super);
    function AppFacade() {
        return _super.call(this, AppFacade.KEY) || this;
    }
    AppFacade.instance = function () {
        return (this.getInstance(AppFacade.KEY));
    };
    AppFacade.prototype.initializeController = function () {
        _super.prototype.initializeController.call(this);
        this.registerCommand(AppFacade.STRATUP, StartupCommand);
    };
    /**
     * 启动pureMVC，在应用中调用此方法，并传递应用本身的引用
     * @author Andrew_Huang
     * @param {egret.DisplayObjectContainer} root 根视图，包含其他所有的View Component
     * @memberof AppFacade
     */
    AppFacade.prototype.startUp = function (root) {
        this.sendNotification(AppFacade.STRATUP, root);
        this.removeCommand(AppFacade.STRATUP);
    };
    AppFacade.KEY = 'APP'; //实例的Key值
    AppFacade.STRATUP = 'startup'; //启动Key值
    return AppFacade;
}(puremvc.Facade));
__reflect(AppFacade.prototype, "AppFacade", ["puremvc.IFacade", "puremvc.INotifier"]);
