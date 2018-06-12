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
 * 注册数据模型控制器
 * @author Andrew_Huang
 * @class ModelPrepCommand
 * @extends {puremvc.SimpleCommand}
 * @implements {puremvc.ICommand}
 */
var ModelPrepCommand = (function (_super) {
    __extends(ModelPrepCommand, _super);
    function ModelPrepCommand() {
        return _super.call(this) || this;
    }
    ModelPrepCommand.prototype.execute = function (notification) {
        // 注册数据代理
        // this.facade().registerProxy(new ProxyModel());
    };
    return ModelPrepCommand;
}(puremvc.SimpleCommand));
__reflect(ModelPrepCommand.prototype, "ModelPrepCommand", ["puremvc.ICommand", "puremvc.INotifier"]);
