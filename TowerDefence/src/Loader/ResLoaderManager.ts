/**
 * 资源组加载管理
 * @author Andrew_Huang
 * @class ResLoaderManager
 */
class ResLoaderManager extends puremvc.SimpleCommand implements puremvc.ICommand
{
    private loadingView: LoadingUI;
    public static NAME: string = 'ResLoaderManager';

    private constructor()
    {
        super();
    }

    /**
     * 注册消息
     * @author Andrew_Huang
     * @memberof ResLoaderManager
     */
    public register(): void
    {
        this.facade().registerCommand(NotificationName.INIT, ResLoaderManager);
        this.facade().registerCommand("2", ResLoaderManager);
    }

    public execute(notification: puremvc.INotification): void
    {
        let data: any = notification.getBody();
        switch (notification.getName())
        {
            case NotificationName.INIT:
                this.loadingView = new LoadingUI();
                GameLayerManager.getInstance().addChild(this.loadingView);
                this.init();
                break;
            case "2": break;
        }
    }

    private init(): void
    {
        Loader.getInstance().addEventListener(LoadEvent.GROUP_COMPLETE, this.loadComp, this);
        Loader.getInstance().addEventListener(LoadEvent.GROUP_PROGRESS, this.loadProgress, this);
        //加载preload资源
        Loader.getInstance().init();
    }

    /**
     * 分组资源加载完成
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    private loadComp(event: LoadEvent): void
    {
        var group: string = event.groupName;
        switch (group)
        {
            case "preload":
                GameLayerManager.getInstance().removeChild(this.loadingView);
                this.loadingView = null;
                //this.createScene();
                //读取本地游戏配置和储存的数据
                //StorageSetting.loadConfig();
                break;
            case "welcomeload":
            // if (this.loadIndexIsFirst)
            // {
            //     this.preload.loadComp();
            //     this.loadIndexIsFirst = false;
            //     break;
            // }
            default:
                if (event.groupName == "uiLoad")
                {
                    console.log("加载怪物资源");
                    Loader.getInstance().load("monsterLoad");
                } else if (event.groupName == "monsterLoad")
                {
                    console.log("加载塔类资源");
                    Loader.getInstance().load("towerLoad");
                } else if (event.groupName == "towerLoad")
                {
                    console.log("加载音效资源");
                    Loader.getInstance().load("soundLoad");
                } else if (event.groupName == "soundLoad")
                {
                    console.log("加载关卡资源");
                    //Loader.getInstance().load(GuanKaConfig.guankaData[Main.curGuankaIdx]);
                } else
                {
                    // this.dispatchEvent(new MainEvent(MainEvent.LOADCOMP, e.groupName));
                    // //展开LoadBar
                    // this.loadBar.hideLoadBar();
                }
        }
    }

    /**
     * 分组资源加载进度
     * @author Andrew_Huang
     * @private
     * @param {LoadEvent} event
     * @memberof ResLoaderManager
     */
    private loadProgress(event: LoadEvent): void
    {
        let group: string = event.groupName;
        switch (group)
        {
            case "preload":
                this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
                break;
            case "welcomeload":
            // if (this.loadIndexIsFirst)
            // {
            //     this.preload.setProgress(event.itemsLoaded, event.itemsTotal);
            //     break;
            // }
            default: //this.loadBar.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
}