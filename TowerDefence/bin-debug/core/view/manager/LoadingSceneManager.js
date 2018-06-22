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
 * 加载场景管理器
 * @author Andrew_Huang
 * @class LoadingSceneManager
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
var LoadingSceneManager = (function (_super) {
    __extends(LoadingSceneManager, _super);
    function LoadingSceneManager(key) {
        var _this = _super.call(this) || this;
        _this.initializeNotifier(key);
        return _this;
    }
    /**
     * 注册消息
     * @author Andrew_Huang
     * @memberof LoadingSceneManager
     */
    LoadingSceneManager.prototype.register = function () {
        this.facade().registerCommand(LoadingSceneNotice.OPEN, LoadingSceneManager);
        this.facade().registerCommand(LoadingSceneNotice.CLOSE, LoadingSceneManager);
    };
    LoadingSceneManager.prototype.execute = function (notification) {
        var data = notification.getBody();
        var loadLayer = GameLayerManager.getInstance().loadLayer;
        switch (notification.getName()) {
            case LoadingSceneNotice.OPEN:
                this.preload = new PreLoad();
                loadLayer.addChild(this.preload);
                break;
            case LoadingSceneNotice.CLOSE:
                this.preload = null;
                loadLayer.removeChildren();
                break;
        }
    };
    return LoadingSceneManager;
}(puremvc.SimpleCommand));
__reflect(LoadingSceneManager.prototype, "LoadingSceneManager", ["puremvc.ICommand", "puremvc.INotifier"]);
