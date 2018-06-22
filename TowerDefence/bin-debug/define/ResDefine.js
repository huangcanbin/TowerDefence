var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 资源全局变量定义
 * @author Andrew_Huang
 * @class ResDefine
 */
var ResDefine = (function () {
    function ResDefine() {
    }
    //地图
    ResDefine.MAPS = 'maps';
    return ResDefine;
}());
__reflect(ResDefine.prototype, "ResDefine");
