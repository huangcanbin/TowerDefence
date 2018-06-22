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
 * 面板mediator基类
 * @author Andrew_Huang
 * @class BaseMediator
 * @extends {puremvc.Mediator}
 * @implements {puremvc.IMediator}
 */
var BaseMediator = (function (_super) {
    __extends(BaseMediator, _super);
    function BaseMediator(mediatorName, viewComponent) {
        if (mediatorName === void 0) { mediatorName = ""; }
        if (viewComponent === void 0) { viewComponent = null; }
        var _this = _super.call(this, mediatorName, viewComponent) || this;
        _this.isInitialized = false; //是否初始化
        _this.isPopUp = false; //是否已经显示
        _this.ui = null; //UI容器
        _this.w = 0;
        _this.h = 0;
        _this.w = GameConfig.curWidth();
        _this.h = GameConfig.curHeight();
        return _this;
    }
    /**
     * 添加显示面板
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    BaseMediator.prototype.showUI = function (ui, effectType, dark, popUpWidth, popUpHeight, isAlert) {
        if (effectType === void 0) { effectType = 0; }
        if (dark === void 0) { dark = false; }
        if (popUpWidth === void 0) { popUpWidth = 0; }
        if (popUpHeight === void 0) { popUpHeight = 0; }
        if (isAlert === void 0) { isAlert = false; }
        this.ui = ui;
        this.beforeShow();
        this.initUI();
        this.initData();
        PopUpManager.addPopUp(ui, effectType, dark, popUpWidth, popUpHeight, isAlert);
    };
    /**
     * 面板弹出之前处理
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    BaseMediator.prototype.beforeShow = function () {
    };
    /**
     * 初始化面板UI
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    BaseMediator.prototype.initUI = function () {
    };
    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    BaseMediator.prototype.initData = function () {
    };
    /**
     * 移除面板
     * @author Andrew_Huang
     * @param {number} [effectType=0]
     * @memberof BaseMediator
     */
    BaseMediator.prototype.closePanel = function (effectType) {
        if (effectType === void 0) { effectType = 0; }
        this.destroy();
        PopUpManager.removePopUp(this.ui, effectType);
    };
    /**
     * 面板关闭后执行对象和数据的相关销毁
     * @author Andrew_Huang
     * @memberof BaseMediator
     */
    BaseMediator.prototype.destroy = function () {
    };
    /**
     * 面板是否弹出状态
     * @author Andrew_Huang
     * @returns {Boolean}
     * @memberof BaseMediator
     */
    BaseMediator.prototype.getIsPopUp = function () {
        return this.isPopUp;
    };
    /**
     * 面板是否初始化完毕
     * @author Andrew_Huang
     * @returns {Boolean}
     * @memberof BaseMediator
     */
    BaseMediator.prototype.getIsInit = function () {
        return this.isInitialized;
    };
    /**
     * 获取面板宽度
     * @author Andrew_Huang
     * @returns {number}
     * @memberof BaseMediator
     */
    BaseMediator.prototype.getWidth = function () {
        return this.ui.width;
    };
    /**
     * 获取面板高度
     * @author Andrew_Huang
     * @returns {number}
     * @memberof BaseMediator
     */
    BaseMediator.prototype.getHeight = function () {
        return this.ui.height;
    };
    return BaseMediator;
}(puremvc.Mediator));
__reflect(BaseMediator.prototype, "BaseMediator", ["puremvc.IMediator", "puremvc.INotifier"]);
