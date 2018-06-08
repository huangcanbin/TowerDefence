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
 * 游戏容器
 * @author Andrew_Huang
 * @class GameLayerManager
 * @extends {eui.UILayer}
 */
var GameLayerManager = (function (_super) {
    __extends(GameLayerManager, _super);
    function GameLayerManager() {
        var _this = _super.call(this) || this;
        //场景层
        _this.sceneLayer = new eui.UILayer();
        //主UI层
        _this.mainLayer = new eui.UILayer();
        //弹窗层
        _this.panelLayer = new eui.UILayer();
        //特效层
        _this.effectLayer = new eui.UILayer();
        //通讯遮罩层
        _this.maskLayer = new eui.UILayer();
        //加载遮罩层
        _this.loadLayer = new eui.UILayer();
        _this.init();
        return _this;
    }
    GameLayerManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new GameLayerManager();
        }
        return this._instance;
    };
    /**
     * 初始化场景类
     * @author Andrew_Huang
     * @private
     * @memberof GameLayerManager
     */
    GameLayerManager.prototype.init = function () {
        this.touchThrough = true;
        this.sceneLayer.touchThrough = true;
        this.mainLayer.touchThrough = true;
        this.panelLayer.touchThrough = true;
        this.effectLayer.touchThrough = true;
        this.maskLayer.touchThrough = true;
        this.loadLayer.touchThrough = true;
        this.addChild(this.sceneLayer);
        this.addChild(this.mainLayer);
        this.addChild(this.panelLayer);
        this.addChild(this.effectLayer);
        this.addChild(this.loadLayer);
    };
    return GameLayerManager;
}(eui.UILayer));
__reflect(GameLayerManager.prototype, "GameLayerManager");
