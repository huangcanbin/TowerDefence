class PreLoad extends eui.Component
{
    public progress: ProgressLoadBar;

    public constructor()
    {
        super();
        this.skinName = "resource/UISkin/PreLoadSkin.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event): void
    {
        //加载资源
    }

    public setProgress(current: number, total: number): void
    {
        this.progress.value = current;
        this.progress.maximum = total;
    }
}