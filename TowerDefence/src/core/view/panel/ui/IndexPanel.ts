/**
 * 主界面
 * @author Andrew_Huang
 * @class IndexPanel
 * @extends {eui.Component}
 */
class IndexPanel extends eui.Component
{
    public bg: eui.Image;         //背景图片
    public logo: eui.Image;       //logo图片
    public group: eui.Group;      //链条和开始游戏按钮
    public startBtn: eui.Button;  //开始游戏

    public constructor()
    {
        super();
        this.skinName = "resource/UISkin/IndexSkin.exml";
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createCompleteEvent, this);
    }

    private createCompleteEvent(event: eui.UIEvent): void
    {
        //播放bgsound
        SoundManager.playBgSound("gamebgsound_mp3");
        this.removeEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
        this.showAnimation();
    }

    private showAnimation(): void
    {
        egret.Tween.get(this.bg).to({ alpha: 1 }, 800);
        TweenLite.fromTo(
            this.logo, 0.2,
            { y: -this.logo.height, scaleX: 0.1, rotation: 40 },
            { delay: 1.3, y: GameSetting.stageW / 2 + 70, scaleX: 1, rotation: 0, ease: egret.Ease.elasticIn });
        egret.Tween.get(this.logo).wait(1450).to({ scaleX: 0.9 }, 100).to({ scaleX: 1 }, 100);
        egret.Tween.get(this.logo).wait(1460).to({ scaleY: 1.1 }, 100).to({ scaleY: 1 }, 100).
            call(() =>
            {
                egret.Tween.get(this.group).to({ y: this.logo.y + 110 }, 600, egret.Ease.bounceOut).call(() => { }, this);
            }, this);
    }

    public partAdded(partName: string, instance: any): void
    {
        super.partAdded(partName, instance);
    }

    public destroy(): void
    {
        SoundManager.stopBgSound();
    }
}