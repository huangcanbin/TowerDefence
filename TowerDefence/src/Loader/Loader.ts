/**
 * 资源加载类
 * @author Andrew_Huang
 * @class Loader
 * @extends {egret.EventDispatcher}
 */
class Loader extends egret.EventDispatcher
{
    public static _instance: Loader;
    //自定义加载侦听事件
    private _loadEvent: LoadEvent;

    public constructor()
    {
        super();
    }

    public static getInstance(): Loader
    {
        if (!this._instance)
        {
            this._instance = new Loader();
        }
        return this._instance;
    }

    /**
     * 初始化配置文件
     * @author Andrew_Huang
     * @memberof Loader
     */
    public init(): void
    {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    private onConfigComplete(event: RES.ResourceEvent): void
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
    * 资源组加载出错
    */
    private onResourceLoadError(event: RES.ResourceEvent): void
    {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * @author Andrew_Huang
     * @private
     * @param {RES.ResourceEvent} event
     * @memberof Loader
     */
    private onResourceProgress(event: RES.ResourceEvent): void
    {
        this._loadEvent = new LoadEvent(LoadEvent.GROUP_PROGRESS);
        this._loadEvent.groupName = event.groupName;
        this._loadEvent.itemsLoaded = event.itemsLoaded;
        this._loadEvent.itemsTotal = event.itemsTotal;
        this.dispatchEvent(this._loadEvent);
        this._loadEvent = null;
    }

    /**
     * preload资源组加载完成
     * @author Andrew_Huang
     * @private
     * @param {RES.ResourceEvent} event
     * @memberof Loader
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void
    {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        this._loadEvent = new LoadEvent(LoadEvent.GROUP_COMPLETE);
        this._loadEvent.groupName = event.groupName;
        this.dispatchEvent(this._loadEvent);
        this._loadEvent = null;
    }

    /**
     * 加载preload资源组
     * @author Andrew_Huang
     * @param {string} group
     * @memberof Loader
     */
    public load(group: string): void
    {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    }
}