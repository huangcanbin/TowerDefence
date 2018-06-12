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
var TestPanel = (function (_super) {
    __extends(TestPanel, _super);
    function TestPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "";
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.createCompleteEvent, _this);
        return _this;
    }
    TestPanel.prototype.createCompleteEvent = function (event) {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
    };
    TestPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    return TestPanel;
}(eui.Component));
__reflect(TestPanel.prototype, "TestPanel");
