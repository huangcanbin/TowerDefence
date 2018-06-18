/**
 * 资源组加载管理
 * @author Andrew_Huang
 * @class ResLoaderManager
 */
class ResLoaderManager
{
    public static _instance: ResLoaderManager;
    private _root: eui.UILayer;
    private _loadingView: LoadingUI;
    //是否第一次加载Index
    private _loadIndexIsFirst: boolean = true;

    private constructor()
    {

    }

    public static getInstance(): ResLoaderManager
    {
        if (!this._instance)
        {
            this._instance = new ResLoaderManager();
        }
        return this._instance
    }

    /**
     * 初始化资源加载
     * @author Andrew_Huang
     * @param {eui.UILayer} root 舞台节点
     * @memberof ResLoaderManager
     */
    public init(root: eui.UILayer): void
    {
        if (!this._root)
        {
            this._root = root;
        }
        this._loadingView = new LoadingUI();
        GameLayerManager.getInstance().addChild(this._loadingView);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_PROGRESS, this.loadProgress, this);
        Loader.getInstance().init();
    }

    /**
     * 分组资源加载完成
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    private loadComp(event: LoadEvent): void
    {
        var group: string = event.groupName;
        switch (group)
        {
            case "preload":
                GameLayerManager.getInstance().removeChild(this._loadingView);
                this._loadingView = null;
                this.createScene();
                //读取本地游戏配置和储存的数据
                StorageSetting.loadConfig();
                break;
            case "welcomeload":
                if (this._loadIndexIsFirst)
                {
                    AppFacade.instance().sendNotification(LoadingSceneNotice.CLOSE);
                    this._loadIndexIsFirst = false;
                    break;
                }
            default:
                if (event.groupName == "uiLoad")
                {
                    console.log("加载怪物资源");
                    Loader.getInstance().load("monsterLoad");
                } else if (event.groupName == "monsterLoad")
                {
                    console.log("加载塔类资源");
                    Loader.getInstance().load("towerLoad");
                } else if (event.groupName == "towerLoad")
                {
                    console.log("加载音效资源");
                    Loader.getInstance().load("soundLoad");
                } else if (event.groupName == "soundLoad")
                {
                    console.log("加载关卡资源");
                    //Loader.getInstance().load(GuanKaConfig.guankaData[Main.curGuankaIdx]);
                } else
                {
                    // this.dispatchEvent(new MainEvent(MainEvent.LOADCOMP, e.groupName));
                    // //展开LoadBar
                    // this.loadBar.hideLoadBar();
                }
        }
    }

    /**
     * 分组资源加载进度
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    private loadProgress(event: LoadEvent): void
    {
        let group: string = event.groupName;
        switch (group)
        {
            case "preload":
                this._loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
                break;
            case "welcomeload":
                if (this._loadIndexIsFirst)
                {
                    let preload: PreLoad = <PreLoad>GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (preload && (preload instanceof PreLoad))
                    {
                        preload.setProgress(event.itemsLoaded, event.itemsTotal);
                    }
                    break;
                }
            default: //this.loadBar.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 预加载资源完成，启动游戏
     * @author Andrew_Huang
     * @private
     * @memberof ResLoaderManager
     */
    private createScene(): void
    {
        //初始化游戏场景层
        this._root.addChild(GameLayerManager.getInstance())
        AppFacade.instance().startUp(this._root);
        //加载加载界面
        AppFacade.instance().sendNotification(LoadingSceneNotice.OPEN);
    }
}