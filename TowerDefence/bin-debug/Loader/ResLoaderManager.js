var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 资源组加载管理
 * @author Andrew_Huang
 * @class ResLoaderManager
 */
var ResLoaderManager = (function () {
    function ResLoaderManager() {
        //是否第一次加载Index
        this._loadIndexIsFirst = true;
    }
    ResLoaderManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new ResLoaderManager();
        }
        return this._instance;
    };
    /**
     * 初始化资源加载
     * @author Andrew_Huang
     * @param {eui.UILayer} root 舞台节点
     * @memberof ResLoaderManager
     */
    ResLoaderManager.prototype.init = function (root) {
        if (!this._root) {
            this._root = root;
        }
        Loader.getInstance().addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_PROGRESS, this.loadProgress, this);
    };
    /**
     * 分组资源加载完成
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    ResLoaderManager.prototype.loadComp = function (event) {
        var group = event.groupName;
        switch (group) {
            case "welcomeload":
                if (this._loadIndexIsFirst) {
                    var preload = GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (preload && (preload instanceof PreLoad)) {
                        preload.loadComplete();
                    }
                    this._loadIndexIsFirst = false;
                    break;
                }
            default:
                if (event.groupName == "uiLoad") {
                    console.log("加载怪物资源");
                    Loader.getInstance().load("monsterLoad");
                }
                else if (event.groupName == "monsterLoad") {
                    console.log("加载塔类资源");
                    Loader.getInstance().load("towerLoad");
                }
                else if (event.groupName == "towerLoad") {
                    console.log("加载音效资源");
                    Loader.getInstance().load("soundLoad");
                }
                else if (event.groupName == "soundLoad") {
                    console.log("加载关卡资源");
                    //Loader.getInstance().load(GuanKaConfig.guankaData[Main.curGuankaIdx]);
                }
                else {
                    SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.LOADCOMP, event.groupName));
                    //展开LoadBar
                    var loadBar = GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (loadBar && (loadBar instanceof LoadBar)) {
                        loadBar.hideLoadBar();
                    }
                }
        }
    };
    /**
     * 分组资源加载进度
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    ResLoaderManager.prototype.loadProgress = function (event) {
        var group = event.groupName;
        switch (group) {
            case "welcomeload":
                if (this._loadIndexIsFirst) {
                    var preload = GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (preload && (preload instanceof PreLoad)) {
                        preload.setProgress(event.itemsLoaded, event.itemsTotal);
                    }
                    break;
                }
            default:
                var loadBar = GameLayerManager.getInstance().loadLayer.getChildAt(0);
                if (loadBar && (loadBar instanceof LoadBar)) {
                    loadBar.setProgress(event.itemsLoaded, event.itemsTotal);
                }
        }
    };
    return ResLoaderManager;
}());
__reflect(ResLoaderManager.prototype, "ResLoaderManager");
