/**
 * 游戏容器
 * @author Andrew_Huang
 * @class GameLayerManager
 * @extends {eui.UILayer}
 */
class GameLayerManager extends eui.UILayer
{
    //场景层
    public sceneLayer: eui.UILayer = new eui.UILayer();
    //主UI层
    public mainLayer: eui.UILayer = new eui.UILayer();
    //弹窗层
    public panelLayer: eui.UILayer = new eui.UILayer();
    //特效层
    public effectLayer: eui.UILayer = new eui.UILayer();
    //通讯遮罩层
    public maskLayer: eui.UILayer = new eui.UILayer();
    //加载遮罩层
    public loadLayer: eui.UILayer = new eui.UILayer();

    public static _instance: GameLayerManager;

    private constructor()
    {
        super();
        this.init();
    }

    public static getInstance(): GameLayerManager
    {
        if (!this._instance)
        {
            this._instance = new GameLayerManager();
        }
        return this._instance;
    }

    /**
     * 初始化场景类
     * @author Andrew_Huang
     * @private
     * @memberof GameLayerManager
     */
    private init(): void
    {
        this.touchThrough = true;
        this.sceneLayer.touchThrough = true;
        this.mainLayer.touchThrough = true;
        this.panelLayer.touchThrough = true;
        this.effectLayer.touchThrough = true;
        this.maskLayer.touchThrough = true;
        this.loadLayer.touchThrough = true;
        this.addChild(this.sceneLayer);
        this.addChild(this.mainLayer);
        this.addChild(this.panelLayer);
        this.addChild(this.effectLayer);
        this.addChild(this.loadLayer);
    }
}