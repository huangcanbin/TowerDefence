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
 * 场景管理器
 * @author Andrew_Huang
 * @class SceneManager
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    // private welcome: Index;
    function SceneManager(key) {
        var _this = _super.call(this) || this;
        _this.initializeNotifier(key);
        return _this;
    }
    /**
     * 注册消息
     * @author Andrew_Huang
     * @memberof SceneManager
     */
    SceneManager.prototype.register = function () {
        this.facade().registerCommand(SceneNotice.OPEN_START_SCENE, SceneManager);
        this.facade().registerCommand(SceneNotice.CLOSE_SCENE, SceneManager);
    };
    SceneManager.prototype.execute = function (notification) {
        var data = notification.getBody();
        var mainLayer = GameLayerManager.getInstance().mainLayer;
        switch (notification.getName()) {
            case SceneNotice.OPEN_START_SCENE:
                // this.facade().sendNotification()
                break;
            case SceneNotice.CLOSE_SCENE:
                if (data == SceneNotice.CLOSE_INDEX) {
                    this.facade().sendNotification(SceneNotice.CLOSE_INDEX);
                }
                break;
        }
    };
    return SceneManager;
}(puremvc.SimpleCommand));
__reflect(SceneManager.prototype, "SceneManager", ["puremvc.ICommand", "puremvc.INotifier"]);
