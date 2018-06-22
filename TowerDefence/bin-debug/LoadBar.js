var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 资源加载进度
 * @author Andrew_Huang
 * @class LoadBar
 * @extends {eui.Component}
 */
var LoadBar = (function (_super) {
    __extends(LoadBar, _super);
    function LoadBar() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/UISkin/LoadBarSkin.exml";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    LoadBar.prototype.onAddToStage = function (event) {
        //this.progress.visible = false;
        this.showAnimation();
        //合拢音效
        SoundManager.playEffect("loaderClose");
    };
    LoadBar.prototype.showAnimation = function () {
        TweenLite.to(this.leftGroup, 0.3, { x: 0, ease: Cubic.easeOut });
        TweenLite.to(this.rightGroup, 0.3, {
            x: 400, ease: Cubic.easeOut, onComplete: function () {
                SceneResManager.getInstance().dispatchEvent(new MainEvent(MainEvent.REMOVE));
            }
        });
    };
    /**
     * 加载完成，展开动画完毕
     * @author Andrew_Huang
     * @memberof LoadBar
     */
    LoadBar.prototype.hideLoadBar = function () {
        var that = this;
        TweenLite.to(this.leftGroup, 0.3, { delay: 0.6, x: -400, ease: egret.Ease.bounceIn });
        TweenLite.to(this.rightGroup, 0.3, {
            delay: 0.6, x: 800, ease: egret.Ease.bounceIn, onComplete: function () {
                if (that.parent != null) {
                    GameLayerManager.getInstance().loadLayer.removeChild(that);
                }
                //展开音效
                SoundManager.playEffect("loaderOpen");
            }
        });
    };
    /**
     * 进度展示
     * @author Andrew_Huang
     * @param {number} current
     * @param {number} total
     * @memberof LoadBar
     */
    LoadBar.prototype.setProgress = function (current, total) {
        this.progress.value = current;
        this.progress.maximum = total;
    };
    return LoadBar;
}(eui.Component));
__reflect(LoadBar.prototype, "LoadBar");
