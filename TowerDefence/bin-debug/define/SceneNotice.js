var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 场景消息
 * @author Andrew_Huang
 * @class SceneNotice
 */
var SceneNotice = (function () {
    function SceneNotice() {
    }
    //打开开始场景
    SceneNotice.OPEN_START_SCENE = 'Scene_Notice_Open_Start';
    //关闭场景
    SceneNotice.CLOSE_SCENE = 'Scene_Notice_Close';
    //打开游戏开始介绍面
    SceneNotice.OPEN_INDEX = 'Open_Index';
    //关闭游戏开始介绍面
    SceneNotice.CLOSE_INDEX = 'Close_Index';
    return SceneNotice;
}());
__reflect(SceneNotice.prototype, "SceneNotice");
