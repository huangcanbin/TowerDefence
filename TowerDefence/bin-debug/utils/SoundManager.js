var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 声音管理类
 * @author Andrew_Huang
 * @class SoundManager
 */
var SoundManager = (function () {
    function SoundManager() {
    }
    /**
     * 播放音效
     * @author Andrew_Huang
     * @static
     * @param {string} name
     * @param {number} [value=1]
     * @memberof SoundManager
     */
    SoundManager.playEffect = function (name, value) {
        if (value === void 0) { value = 1; }
        //判断音效按钮是否静音，是则return 否则播放
        var sound_eff = RES.getRes(name);
        if (sound_eff) {
            sound_eff.type = egret.Sound.EFFECT;
            sound_eff.play();
        }
    };
    /**
     * 播放背景音乐
     * @author Andrew_Huang
     * @static
     * @param {string} name
     * @param {boolean} [loop=true]
     * @memberof SoundManager
     */
    SoundManager.playBgSound = function (name, loop) {
        if (loop === void 0) { loop = true; }
        this.sdbg = RES.getRes(name);
        if (this.sdbg) {
            this.sdbg.type = egret.Sound.MUSIC;
            this.sdbg.play();
        }
    };
    /**
     * 停止背景音乐
     * @author Andrew_Huang
     * @static
     * @memberof SoundManager
     */
    SoundManager.stopBgSound = function () {
        if (this.sdbg) {
            this.sdbg.close();
        }
    };
    return SoundManager;
}());
__reflect(SoundManager.prototype, "SoundManager");
