/**
 * 场景管理器
 * @author Andrew_Huang
 * @class SceneManager
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
class SceneManager extends puremvc.SimpleCommand implements puremvc.ICommand
{
    // private welcome: Index;

    public constructor()
    {
        super();
    }

    /**
     * 注册消息
     * @author Andrew_Huang
     * @memberof SceneManager
     */
    public register(): void
    {
        this.facade().registerCommand(SceneNotice.OPEN_START_SCENE, SceneManager);
        this.facade().registerCommand(SceneNotice.CLOSE_SCENE, SceneManager);
    }

    public execute(notification: puremvc.INotification): void
    {
        let data: any = notification.getBody();
        let mainLayer: eui.UILayer = GameLayerManager.getInstance().mainLayer;
        switch (notification.getName())
        {
            case SceneNotice.OPEN_START_SCENE:

                break;
            case SceneNotice.CLOSE_SCENE: break;
        }
    }
}