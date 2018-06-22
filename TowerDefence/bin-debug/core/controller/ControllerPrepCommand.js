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
 * 注册控制器
 * @author Andrew_Huang
 * @class ControllerPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
var ControllerPrepCommand = (function (_super) {
    __extends(ControllerPrepCommand, _super);
    function ControllerPrepCommand() {
        return _super.call(this) || this;
    }
    ControllerPrepCommand.prototype.execute = function (notification) {
        // 注册管理器的消息
        (new SceneManager(this.multitonKey)).register();
        (new LoadingSceneManager(this.multitonKey)).register();
    };
    return ControllerPrepCommand;
}(puremvc.SimpleCommand));
__reflect(ControllerPrepCommand.prototype, "ControllerPrepCommand", ["puremvc.ICommand", "puremvc.INotifier"]);
