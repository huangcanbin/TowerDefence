/**
 * 加载场景管理器
 * @author Andrew_Huang
 * @class LoadingSceneManager
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
class LoadingSceneManager extends puremvc.SimpleCommand implements puremvc.ICommand
{
    public preload: PreLoad; //加载界面

    public constructor()
    {
        super();
    }

    /**
     * 注册消息
     * @author Andrew_Huang
     * @memberof LoadingSceneManager
     */
    public register(): void
    {
        this.facade().registerCommand(LoadingSceneNotice.OPEN, LoadingSceneManager);
        this.facade().registerCommand(LoadingSceneNotice.CLOSE, LoadingSceneManager);
    }

    public execute(notification: puremvc.INotification): void
    {
        let data: any = notification.getBody();
        let loadLayer: eui.UILayer = GameLayerManager.getInstance().loadLayer;
        switch (notification.getName())
        {
            case LoadingSceneNotice.OPEN:
                this.preload = new PreLoad();
                loadLayer.addChild(this.preload);
                break;
            case LoadingSceneNotice.CLOSE:
                this.preload = null;
                loadLayer.removeChildren();
                break;
        }
    }
}