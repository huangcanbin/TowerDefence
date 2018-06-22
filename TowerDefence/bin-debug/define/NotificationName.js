var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 时间通知名
 * @author Andrew_Huang
 * @class NotificationName
 */
var NotificationName = (function () {
    function NotificationName() {
    }
    //初始加载resource资源和preload资源
    NotificationName.INIT = "init_preload";
    return NotificationName;
}());
__reflect(NotificationName.prototype, "NotificationName");
