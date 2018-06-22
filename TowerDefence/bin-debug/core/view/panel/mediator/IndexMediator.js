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
 * 游戏开始界面视图器
 * @author Andrew_Huang
 * @class IndexMediator
 * @extends {BaseMediator}
 */
var IndexMediator = (function (_super) {
    __extends(IndexMediator, _super);
    function IndexMediator(viewComponent) {
        if (viewComponent === void 0) { viewComponent = null; }
        var _this = _super.call(this, IndexMediator.NAME, viewComponent) || this;
        _this.indexPanel = new IndexPanel();
        return _this;
    }
    IndexMediator.prototype.onRegister = function () {
    };
    IndexMediator.prototype.listNotificationInterests = function () {
        return [SceneNotice.OPEN_INDEX, SceneNotice.CLOSE_INDEX];
    };
    IndexMediator.prototype.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
            case SceneNotice.OPEN_INDEX: {
                this.showUI(this.indexPanel);
                break;
            }
            case SceneNotice.CLOSE_INDEX: {
                this.closePanel(1);
                break;
            }
        }
    };
    /**
     * 初始化面板UI
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    IndexMediator.prototype.initUI = function () {
        this.indexPanel.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startCallback, this);
    };
    IndexMediator.prototype.startCallback = function () {
        this.indexPanel.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startCallback, this);
        //打开加载界面
        SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.OPENLOADBAR, ResDefine.MAPS, SceneNotice.CLOSE_INDEX));
        this.indexPanel.destroy();
    };
    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    IndexMediator.prototype.initData = function () {
    };
    IndexMediator.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    IndexMediator.NAME = "IndexMediator";
    return IndexMediator;
}(BaseMediator));
__reflect(IndexMediator.prototype, "IndexMediator");
