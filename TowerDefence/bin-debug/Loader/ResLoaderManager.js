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
    }
    ResLoaderManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new ResLoaderManager();
        }
        return this._instance;
    };
    ResLoaderManager.prototype.init = function () {
        Loader.getInstance().addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_PROGRESS, this.loadProgress, this);
        Loader.getInstance().init();
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
            case "preload":
                //this.removeChild(this.loadingView); this.loadingView = null; this.createScene();
                //读取本地游戏配置和储存的数据
                //StorageSetting.loadConfig();
                break;
            case "welcomeload":
            // if (this.loadIndexIsFirst)
            // {
            //     this.preload.loadComp();
            //     this.loadIndexIsFirst = false;
            //     break;
            // }
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
                    // this.dispatchEvent(new MainEvent(MainEvent.LOADCOMP, e.groupName));
                    // //展开LoadBar
                    // this.loadBar.hideLoadBar();
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
            case "preload":
                //this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                break;
            case "welcomeload":
            // if (this.loadIndexIsFirst)
            // {
            //     this.preload.setProgress(event.itemsLoaded, event.itemsTotal);
            //     break;
            // }
            default: //this.loadBar.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    return ResLoaderManager;
}());
__reflect(ResLoaderManager.prototype, "ResLoaderManager");
