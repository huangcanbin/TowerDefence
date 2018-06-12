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
var TestMediator = (function (_super) {
    __extends(TestMediator, _super);
    function TestMediator(viewComponent) {
        if (viewComponent === void 0) { viewComponent = null; }
        var _this = _super.call(this, TestMediator.NAME, viewComponent) || this;
        _this.testPanel = new TestPanel();
        return _this;
    }
    TestMediator.prototype.onRegister = function () {
    };
    TestMediator.prototype.listNotificationInterests = function () {
        return [
            "Test_OPEN",
            "Test_CLOSE"
        ];
    };
    TestMediator.prototype.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
            case "Test_OPEN": {
                //显示角色面板
                this.showUI(this.testPanel, 1);
                break;
            }
            case "Test_CLOSE": {
                this.closePanel(1);
                break;
            }
        }
    };
    /**
     * 初始化面板UI
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    TestMediator.prototype.initUI = function () {
    };
    /**
     * 初始化面板数据
     * @author Andrew_Huang
     * @memberof TestMediator
     */
    TestMediator.prototype.initData = function () {
    };
    TestMediator.NAME = "TestMediator";
    return TestMediator;
}(BaseMediator));
__reflect(TestMediator.prototype, "TestMediator");
