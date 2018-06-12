/**
 * 启动项
 * @author Andrew_Huang
 * @class AppFacade
 * @extends {puremvc.Facade}
 * @implements {puremvc.IFacade}
 */
class AppFacade extends puremvc.Facade implements puremvc.IFacade
{
    public static KEY: string = 'APP';          //实例的Key值
    public static STRATUP: string = 'startup';  //启动Key值

    public constructor()
    {
        super(AppFacade.KEY);
    }

    public static instance(): AppFacade
    {
        return <AppFacade>this.getInstance(AppFacade.KEY);
    }

    public initializeController(): void
    {
        super.initializeController();
        this.registerCommand(AppFacade.STRATUP, StartupCommand);
    }

    /**
     * 启动pureMVC，在应用中调用此方法，并传递应用本身的引用
     * @author Andrew_Huang
     * @param {egret.DisplayObjectContainer} root 根视图，包含其他所有的View Component
     * @memberof AppFacade
     */
    public startUp(root: egret.DisplayObjectContainer): void
    {
        this.sendNotification(AppFacade.STRATUP, root);
        this.removeCommand(AppFacade.STRATUP);
    }
}