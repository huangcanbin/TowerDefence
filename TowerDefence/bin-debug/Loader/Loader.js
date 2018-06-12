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
 * 资源加载类
 * @author Andrew_Huang
 * @class Loader
 * @extends {egret.EventDispatcher}
 */
var Loader = (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        return _super.call(this) || this;
    }
    Loader.getInstance = function () {
        if (!this._instance) {
            this._instance = new Loader();
        }
        return this._instance;
    };
    /**
     * 初始化配置文件
     * @author Andrew_Huang
     * @memberof Loader
     */
    Loader.prototype.init = function () {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    Loader.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
    * 资源组加载出错
    */
    Loader.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * @author Andrew_Huang
     * @private
     * @param {RES.ResourceEvent} event
     * @memberof Loader
     */
    Loader.prototype.onResourceProgress = function (event) {
        this._loadEvent = new LoadEvent(LoadEvent.GROUP_PROGRESS);
        this._loadEvent.groupName = event.groupName;
        this._loadEvent.itemsLoaded = event.itemsLoaded;
        this._loadEvent.itemsTotal = event.itemsTotal;
        this.dispatchEvent(this._loadEvent);
        this._loadEvent = null;
    };
    /**
     * preload资源组加载完成
     * @author Andrew_Huang
     * @private
     * @param {RES.ResourceEvent} event
     * @memberof Loader
     */
    Loader.prototype.onResourceLoadComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        this._loadEvent = new LoadEvent(LoadEvent.GROUP_COMPLETE);
        this._loadEvent.groupName = event.groupName;
        this.dispatchEvent(this._loadEvent);
        this._loadEvent = null;
    };
    /**
     * 加载preload资源组
     * @author Andrew_Huang
     * @param {string} group
     * @memberof Loader
     */
    Loader.prototype.load = function (group) {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    };
    return Loader;
}(egret.EventDispatcher));
__reflect(Loader.prototype, "Loader");
