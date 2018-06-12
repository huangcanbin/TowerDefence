/**
 * 注册数据模型控制器
 * @author Andrew_Huang
 * @class ModelPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
class ModelPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand
{
    public constructor()
    {
        super();
    }

    public execute(notification: puremvc.INotification): void
    {
        // 注册数据代理
        // this.facade().registerProxy(new ProxyModel());
    }
}