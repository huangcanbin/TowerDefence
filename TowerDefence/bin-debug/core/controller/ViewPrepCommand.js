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
 * 注册视图控制器
 * @author Andrew_Huang
 * @class ViewPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
var ViewPrepCommand = (function (_super) {
    __extends(ViewPrepCommand, _super);
    function ViewPrepCommand() {
        return _super.call(this) || this;
    }
    ViewPrepCommand.prototype.execute = function (nitification) {
        this.facade().registerMediator(new TestMediator());
    };
    return ViewPrepCommand;
}(puremvc.SimpleCommand));
__reflect(ViewPrepCommand.prototype, "ViewPrepCommand", ["puremvc.ICommand", "puremvc.INotifier"]);
