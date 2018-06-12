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
 * tips类
 * @author Andrew_Huang
 * @class TipsPanel
 * @extends {eui.Component}
 */
var TipsPanel = (function (_super) {
    __extends(TipsPanel, _super);
    function TipsPanel(descStr) {
        if (descStr === void 0) { descStr = ""; }
        var _this = _super.call(this) || this;
        _this.descStr = "";
        _this.descStr = descStr;
        _this.initUI();
        return _this;
    }
    /**
     * 初始化面板
     * @author Andrew_Huang
     * @memberof TipsPanel
     */
    TipsPanel.prototype.initUI = function () {
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("tipsBg_png");
        this.addChild(this.bg);
        this.bg.touchEnabled = true;
        this.descTF = new egret.TextField();
        this.addChild(this.descTF);
        this.descTF.textColor = 0x000000;
        this.descTF.size = 20;
        this.descTF.x = 5;
        this.descTF.textAlign = "center";
        this.descTF.text = this.descStr;
        //九宫格
        var rect = new egret.Rectangle(5, 5, 5, 5);
        this.bg.scale9Grid = rect;
        this.bg.width = this.descTF.width + 10;
        this.bg.height = this.descTF.height * 3;
        this.descTF.y = this.bg.height / 2 - this.descTF.height / 2 + 2;
    };
    // 获取高度
    TipsPanel.prototype.getHeight = function () {
        return this.bg.height;
    };
    // 获取宽度
    TipsPanel.prototype.getWidth = function () {
        return this.bg.width;
    };
    return TipsPanel;
}(eui.Component));
__reflect(TipsPanel.prototype, "TipsPanel");
