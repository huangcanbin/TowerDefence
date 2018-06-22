/**
 * 场景资源加载管理器
 * @author Andrew_Huang
 * @class SceneResManager
 * @extends {egret.EventDispatcher}
 */
class SceneResManager extends egret.EventDispatcher
{
    private _resName: string;     //资源组名
    private _noticeName: string;  //通知名
    private _loadBar: LoadBar;    //加载界面

    public static _instance: SceneResManager;
    private constructor()
    {
        super();
    }

    public static getInstance(): SceneResManager
    {
        if (!this._instance)
        {
            this._instance = new SceneResManager();
        }
        return this._instance;
    }

    public init(): void
    {
        this.addEventListener(MainEvent.REMOVE, this.removeLast, this);
        this.addEventListener(MainEvent.OPENLOADBAR, this.createLoadBar, this);
        this.addEventListener(MainEvent.LOADCOMP, this.addScene, this);
    }

    /**
     * 移除上一个场景
     * @author Andrew_Huang
     * @private
     * @memberof SceneResManager
     */
    private removeLast(event: MainEvent): void
    {
        //加载新资源组
        Loader.getInstance().load(this._resName);
        //移除上一场景
        AppFacade.instance().sendNotification(SceneNotice.CLOSE_SCENE, this._noticeName);
    }

    /**
     * 侦听加载界面调用事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    private createLoadBar(event: MainEvent): void
    {
        this._resName = event.resName;
        this._noticeName = event.noticeName;
        this._loadBar = new LoadBar();
        GameLayerManager.getInstance().loadLayer.addChild(this._loadBar);
    }

    /**
     * 侦听加载完成加载场景事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneResManager
     */
    private addScene(event: MainEvent): void
    {
        let resName: string = event.resName;
        if (resName == ResDefine.MAPS)
        {
            console.log("打开地图")
        }
    }
}