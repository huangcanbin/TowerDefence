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
 * @extends {egret.EventDispatcher}
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        return _super.call(this) || this;
    }
    SceneManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new SceneManager();
        }
        return this._instance;
    };
    SceneManager.prototype.init = function () {
        this.addEventListener(MainEvent.REMOVE, this.removeLast, this);
        this.addEventListener(MainEvent.OPENLOADBAR, this.createLoadBar, this);
        this.addEventListener(MainEvent.LOADCOMP, this.addScene, this);
    };
    /**
     * 移除上一个场景
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    SceneManager.prototype.removeLast = function (event) {
        // //加载新资源组
        // Loader.instance.load(this.resName);
        // //移除上一场景
        // this.gameLayer.removeChildAt(0);
        // var view = this.views.shift();
        // view.destroy();
    };
    /**
     * 侦听加载界面调用事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    SceneManager.prototype.createLoadBar = function () {
        // this.resName = e.resName;
        // this.loadBar = new LoadBar();
        // this.addChild(this.loadBar);
    };
    /**
     * 侦听加载完成加载场景事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    SceneManager.prototype.addScene = function () {
        //  //反射，根据name值返回指定类对象的引用
        //  var objClass = egret.getDefinitionByName(this.senceName[e.resName]);
        //  var obj = new objClass();
        //  this.gameLayer.addChild(obj);
        //  this.views.push(obj);
    };
    return SceneManager;
}(egret.EventDispatcher));
__reflect(SceneManager.prototype, "SceneManager");
