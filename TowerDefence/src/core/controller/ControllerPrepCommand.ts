/**
 * 注册控制器
 * @author Andrew_Huang
 * @class ControllerPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand
{
    public constructor()
    {
        super();
    }

    public execute(notification: puremvc.INotification): void
    {
        // 注册管理器的消息
        // (new SceneManager()).register();
        // (new MainManager()).register();
    }
}