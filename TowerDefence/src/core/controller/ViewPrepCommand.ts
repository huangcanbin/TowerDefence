/**
 * 注册视图控制器
 * @author Andrew_Huang
 * @class ViewPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
class ViewPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand
{
    public constructor()
    {
        super();
    }

    public execute(nitification: puremvc.INotification): void
    {
        this.facade().registerMediator(new TestMediator())
    }
}