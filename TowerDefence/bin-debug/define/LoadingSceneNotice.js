var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 加载场景消息
 * @author Andrew_Huang
 * @class LoadingSceneNotice
 */
var LoadingSceneNotice = (function () {
    function LoadingSceneNotice() {
    }
    //打开
    LoadingSceneNotice.OPEN = 'LoadingSceneNotice_Open';
    //关闭
    LoadingSceneNotice.CLOSE = 'LoadingSceneNotice_Close';
    return LoadingSceneNotice;
}());
__reflect(LoadingSceneNotice.prototype, "LoadingSceneNotice");
