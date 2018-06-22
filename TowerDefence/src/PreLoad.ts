class PreLoad extends eui.Component
{
    public progress: ProgressLoadBar;
    public startBtn: eui.Button;

    public constructor()
    {
        super();
        this.skinName = "resource/UISkin/PreLoadSkin.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event): void
    {
        this.progress.visible = true;
        this.startBtn.visible = false;
        //加载资源
        Loader.getInstance().load('welcomeload');
    }

    public setProgress(current: number, total: number): void
    {
        this.progress.value = current;
        this.progress.maximum = total;
    }

    /**
     * 加载完成
     * @author Andrew_Huang
     * @memberof PreLoad
     */
    public loadComplete(): void
    {
        this.progress.visible = false;
        this.startBtn.visible = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBegin, this);
    }

    private touchBegin(): void
    {
        this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBegin, this);
        AppFacade.instance().sendNotification(LoadingSceneNotice.CLOSE);
        AppFacade.instance().sendNotification(SceneNotice.OPEN_INDEX);
    }
}