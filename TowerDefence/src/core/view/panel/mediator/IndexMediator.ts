/**
 * 游戏开始界面视图器
 * @author Andrew_Huang
 * @class IndexMediator
 * @extends {BaseMediator}
 */
class IndexMediator extends BaseMediator
{
    public static NAME: string = "IndexMediator";
    private indexPanel: IndexPanel = new IndexPanel();

    public constructor(viewComponent: any = null)
    {
        super(IndexMediator.NAME, viewComponent);
    }

    public onRegister(): void
    {

    }

    public listNotificationInterests(): Array<any>
    {
        return [SceneNotice.OPEN_INDEX, SceneNotice.CLOSE_INDEX];
    }

    public handleNotification(notification: puremvc.INotification): void
    {
        var data: any = notification.getBody();
        switch (notification.getName())
        {
            case SceneNotice.OPEN_INDEX: {
                this.showUI(this.indexPanel);
                break;
            }
            case SceneNotice.CLOSE_INDEX: {
                this.closePanel(1);
                break;
            }
        }
    }

    /**
     * 初始化面板UI
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    public initUI(): void
    {
        this.indexPanel.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startCallback, this);
    }

    private startCallback(): void
    {
        this.indexPanel.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.startCallback, this);
        //打开加载界面
        SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.OPENLOADBAR, ResDefine.MAPS, SceneNotice.CLOSE_INDEX));
        this.indexPanel.destroy();
    }

    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    public initData(): void
    {

    }

    public destroy(): void
    {
        super.destroy();
    }
}