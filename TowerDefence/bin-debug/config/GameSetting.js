var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏配置类
 * @author Andrew_Huang
 * @class GameSetting
 */
var GameSetting = (function () {
    function GameSetting() {
    }
    //玩家获得金星 用于升级塔、解锁英雄、升级英雄属性
    GameSetting.goldStar = 0;
    //舞台宽  egret.MainContext.instance.stage.stageWidth
    GameSetting.stageW = 800;
    //舞台高 egret.MainContext.instance.stage.stageHeight
    GameSetting.stageH = 400;
    return GameSetting;
}());
__reflect(GameSetting.prototype, "GameSetting");
