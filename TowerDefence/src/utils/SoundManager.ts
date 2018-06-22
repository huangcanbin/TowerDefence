/**
 * 声音管理类
 * @author Andrew_Huang
 * @class SoundManager
 */
class SoundManager
{
    private static sdbg: egret.Sound;

    /**
     * 播放音效
     * @author Andrew_Huang
     * @static
     * @param {string} name
     * @param {number} [value=1]
     * @memberof SoundManager
     */
    public static playEffect(name: string, value: number = 1)
    {
        //判断音效按钮是否静音，是则return 否则播放
        var sound_eff: egret.Sound = RES.getRes(name);
        sound_eff.type = egret.Sound.EFFECT;
        sound_eff.play();
    }

    /**
     * 播放背景音乐
     * @author Andrew_Huang
     * @static
     * @param {string} name
     * @param {boolean} [loop=true]
     * @memberof SoundManager
     */
    public static playBgSound(name: string, loop: boolean = true)
    {
        this.sdbg = RES.getRes(name);
        this.sdbg.type = egret.Sound.MUSIC;
        this.sdbg.play();
    }

    /**
     * 停止背景音乐
     * @author Andrew_Huang
     * @static
     * @memberof SoundManager
     */
    public static stopBgSound()
    {
        this.sdbg.close();
    }
}