/**
 * 面板mediator基类
 * @author Andrew_Huang
 * @class BaseMediator
 * @extends {puremvc.Mediator}
 * @implements {puremvc.IMediator}
 */
class BaseMediator extends puremvc.Mediator implements puremvc.IMediator
{
    private isInitialized: Boolean = false;  //是否初始化
    private isPopUp: Boolean = false;        //是否已经显示
    private ui: eui.Component = null;        //UI容器
    public w: number = 0;
    public h: number = 0;

    public constructor(mediatorName: string = "", viewComponent: Object = null)
    {
        super(mediatorName, viewComponent);
        this.w = GameConfig.curWidth();
        this.h = GameConfig.curHeight();
    }

    /**
     * 添加显示面板
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    public showUI(ui: eui.Component, effectType: number = 0, dark: boolean = false, popUpWidth: number = 0, popUpHeight: number = 0, isAlert: boolean = false): void
    {
        this.ui = ui;
        this.beforeShow();
        this.initUI();
        this.initData();
        PopUpManager.addPopUp(ui, effectType, dark, popUpWidth, popUpHeight, isAlert);
    }

    /**
     * 面板弹出之前处理
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    public beforeShow(): void
    {

    }

    /**
     * 初始化面板UI
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    public initUI(): void
    {

    }

    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    public initData(): void
    {

    }

    /**
     * 移除面板
     * @author Andrew_Huang
     * @param {number} [effectType=0]
     * @memberof BaseMediator
     */
    public closePanel(effectType: number = 0): void
    {
        PopUpManager.removePopUp(this.ui, effectType);
        this.destroy();
    }

    /**
     * 面板关闭后执行对象和数据的相关销毁
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    public destroy(): void
    {

    }

    /**
     * 面板是否弹出状态
     * @author Andrew_Huang
     * @returns {Boolean}
     * @memberof BaseMediator
     */
    public getIsPopUp(): Boolean
    {
        return this.isPopUp;
    }

    /**
     * 面板是否初始化完毕
     * @author Andrew_Huang
     * @returns {Boolean}
     * @memberof BaseMediator
     */
    public getIsInit(): Boolean
    {
        return this.isInitialized;
    }

    /**
     * 获取面板宽度
     * @author Andrew_Huang
     * @returns {number}
     * @memberof BaseMediator
     */
    public getWidth(): number
    {
        return this.ui.width;
    }

    /**
     * 获取面板高度
     * @author Andrew_Huang
     * @returns {number}
     * @memberof BaseMediator
     */
    public getHeight(): number
    {
        return this.ui.height;
    }
}