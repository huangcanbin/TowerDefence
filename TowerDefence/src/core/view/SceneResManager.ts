/**
 * 场景资源加载管理器
 * @author Andrew_Huang
 * @class SceneResManager
 * @extends {egret.EventDispatcher}
 */
class SceneResManager extends egret.EventDispatcher
{
    private _resName: string;  //资源组名

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
        // //加载新资源组
        // Loader.instance.load(this.resName);
        // //移除上一场景
        // this.gameLayer.removeChildAt(0);
        // var view = this.views.shift();
        // view.destroy();
    }

    /**
     * 侦听加载界面调用事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneManager
     */
    private createLoadBar(): void
    {
        // this.resName = e.resName;
        // this.loadBar = new LoadBar();
        // this.addChild(this.loadBar);
    }

    /**
     * 侦听加载完成加载场景事件
     * @author Andrew_Huang
     * @private
     * @memberof SceneResManager
     */
    private addScene(): void
    {
        //  //反射，根据name值返回指定类对象的引用
        //  var objClass = egret.getDefinitionByName(this.senceName[e.resName]);
        //  var obj = new objClass();
        //  this.gameLayer.addChild(obj);
        //  this.views.push(obj);
    }
}