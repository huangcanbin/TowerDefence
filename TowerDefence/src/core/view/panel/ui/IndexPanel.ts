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
        //SoundManager.playBgSound("gamebgsound_mp3");
        this.removeEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
        this.showAnimation();
    }

    private showAnimation(): void
    {
        let y: number = this.group.y;
        this.group.y = this.logo.y - 110;
        egret.Tween.get(this.group).to({ y: y }, 600, egret.Ease.bounceOut).call(() => { }, this);
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