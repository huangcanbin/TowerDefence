/**
 * 资源加载进度
 * @author Andrew_Huang
 * @class LoadBar
 * @extends {eui.Component}
 */
class LoadBar extends eui.Component
{
    public leftGroup: eui.Group;
    public rightGroup: eui.Group;
    public progress: ProgressLoadBar;

    public constructor()
    {
        super();
        this.skinName = "resource/UISkin/LoadBarSkin.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event): void
    {
        //this.progress.visible = false;
        this.showAnimation();
        //合拢音效
        SoundManager.playEffect("loaderClose");
    }

    private showAnimation(): void
    {
        TweenMax.to(this.leftGroup, 0.3, { x: 0, ease: Cubic.easeOut });
        TweenMax.to(this.rightGroup, 0.3, {
            x: 400, ease: Cubic.easeOut, onComplete: function ()
            {
                SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.REMOVE));
            }
        });
    }

    /**
     * 加载完成，展开动画完毕
     * @author Andrew_Huang
     * @memberof LoadBar
     */
    public hideLoadBar(): void
    {
        var that = this;
        TweenLite.to(this.leftGroup, 0.3, { delay: 0.6, x: -400, ease: egret.Ease.bounceIn });
        TweenLite.to(this.rightGroup, 0.3, {
            delay: 0.6, x: 800, ease: egret.Ease.bounceIn, onComplete: function ()
            {
                if (that.parent != null)
                {
                    GameLayerManager.getInstance().loadLayer.removeChild(that);
                }
                //展开音效
                SoundManager.playEffect("loaderOpen");
            }
        });
    }

    /**
     * 进度展示
     * @author Andrew_Huang
     * @param {number} current
     * @param {number} total
     * @memberof LoadBar
     */
    public setProgress(current: number, total: number): void
    {
        this.progress.value = current;
        this.progress.maximum = total;
    }
}