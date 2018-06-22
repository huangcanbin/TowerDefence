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
        this.progress.visible = true;
        this.startBtn.visible = false;
        //加载资源
        Loader.getInstance().load('welcomeload');
    };
    PreLoad.prototype.setProgress = function (current, total) {
        this.progress.value = current;
        this.progress.maximum = total;
    };
    /**
     * 加载完成
     * @author Andrew_Huang
     * @memberof PreLoad
     */
    PreLoad.prototype.loadComplete = function () {
        this.progress.visible = false;
        this.startBtn.visible = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBegin, this);
    };
    PreLoad.prototype.touchBegin = function () {
        this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBegin, this);
        AppFacade.instance().sendNotification(LoadingSceneNotice.CLOSE);
        AppFacade.instance().sendNotification(SceneNotice.OPEN_INDEX);
    };
    return PreLoad;
}(eui.Component));
__reflect(PreLoad.prototype, "PreLoad");
