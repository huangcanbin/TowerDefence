class TestMediator extends BaseMediator
{
    public static NAME: string = "TestMediator";
    private testPanel: TestPanel = new TestPanel();

    public constructor(viewComponent: any = null)
    {
        super(TestMediator.NAME, viewComponent);
    }

    public onRegister(): void
    {

    }

    public listNotificationInterests(): Array<any>
    {
        return [
            "Test_OPEN",
            "Test_CLOSE"
        ];
    }

    public handleNotification(notification: puremvc.INotification): void
    {
        var data: any = notification.getBody();
        switch (notification.getName())
        {
            case "Test_OPEN": {
                //显示角色面板
                this.showUI(this.testPanel, 1);
                break;
            }
            case "Test_CLOSE": {
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

    }

    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    public initData(): void
    {

    }
}