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
 * 场景资源加载管理器
 * @author Andrew_Huang
 * @class SceneResManager
 * @extends {egret.EventDispatcher}
 */
var SceneResManager = (function (_super) {
    __extends(SceneResManager, _super);
    function SceneResManager() {
        return _super.call(this) || this;
    }
    SceneResManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new SceneResManager();
        }
        return this._instance;
    };
    SceneResManager.prototype.init = function () {
        this.addEventListener(MainEvent.REMOVE, this.removeLast, this);
        this.addEventListener(MainEvent.OPENLOADBAR, this.createLoadBar, this);
        this.addEventListener(MainEvent.LOADCOMP, this.addScene, this);
    };
    /**
     * 移除上一个场景
     * @author Andrew_Huang
     * @private
     * @memberof SceneResManager
     */
    SceneResManager.prototype.removeLast = function (event) {
        //加载新资源组
        Loader.getInstance().load(this._resName);
        //移除上一场景
        AppFacade.instance().sendNotification(SceneNotice.CLOSE_SCENE, this._noticeName);
    };
    /**
     * 侦听加载界面调用事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    SceneResManager.prototype.createLoadBar = function (event) {
        this._resName = event.resName;
        this._noticeName = event.noticeName;
        this._loadBar = new LoadBar();
        GameLayerManager.getInstance().loadLayer.addChild(this._loadBar);
    };
    /**
     * 侦听加载完成加载场景事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneResManager
     */
    SceneResManager.prototype.addScene = function (event) {
        var resName = event.resName;
        if (resName == ResDefine.MAPS) {
            console.log("打开地图");
        }
    };
    return SceneResManager;
}(egret.EventDispatcher));
__reflect(SceneResManager.prototype, "SceneResManager");
