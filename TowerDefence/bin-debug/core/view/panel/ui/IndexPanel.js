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
 * 主界面
 * @author Andrew_Huang
 * @class IndexPanel
 * @extends {eui.Component}
 */
var IndexPanel = (function (_super) {
    __extends(IndexPanel, _super);
    function IndexPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/UISkin/IndexSkin.exml";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.createCompleteEvent, _this);
        return _this;
    }
    IndexPanel.prototype.createCompleteEvent = function (event) {
        //播放bgsound
        //SoundManager.playBgSound("gamebgsound_mp3");
        this.removeEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
        this.showAnimation();
    };
    IndexPanel.prototype.showAnimation = function () {
        var y = this.group.y;
        this.group.y = this.logo.y - 110;
        egret.Tween.get(this.group).to({ y: y }, 600, egret.Ease.bounceOut).call(function () { }, this);
    };
    IndexPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    IndexPanel.prototype.destroy = function () {
        SoundManager.stopBgSound();
    };
    return IndexPanel;
}(eui.Component));
__reflect(IndexPanel.prototype, "IndexPanel");
