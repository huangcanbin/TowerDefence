/**
 * 资源组加载管理
 * @author Andrew_Huang
 * @class ResLoaderManager
 */
class ResLoaderManager
{
    public static _instance: ResLoaderManager;
    private _root: eui.UILayer;
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
        Loader.getInstance().addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_PROGRESS, this.loadProgress, this);
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
            case "welcomeload":
                if (this._loadIndexIsFirst)
                {
                    let preload: PreLoad = <PreLoad>GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (preload && (preload instanceof PreLoad))
                    {
                        preload.loadComplete();
                    }
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
                    SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.LOADCOMP, event.groupName));
                    //展开LoadBar
                    let loadBar: LoadBar = <LoadBar>GameLayerManager.getInstance().loadLayer.getChildAt(0);
                    if (loadBar && (loadBar instanceof LoadBar))
                    {
                        loadBar.hideLoadBar();
                    }
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
            default:
                let loadBar: LoadBar = <LoadBar>GameLayerManager.getInstance().loadLayer.getChildAt(0);
                if (loadBar && (loadBar instanceof LoadBar))
                {
                    loadBar.setProgress(event.itemsLoaded, event.itemsTotal);
                }
        }
    }
}