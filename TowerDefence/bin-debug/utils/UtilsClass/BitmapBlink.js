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
var BitmapBlink = (function (_super) {
    __extends(BitmapBlink, _super);
    /**
     * Creates an instance of BitmapBlink.
     * @author Andrew_Huang
     * @param {egret.Bitmap} target   目标位图
     * @param {number} time           闪啊闪的时间
     * @param {boolean} [isAuto=true] 是否立即执行，默认是ture，也可以设置false，外部调用start方法
     * @memberof BitmapBlink
     */
    function BitmapBlink(target, time, isAuto) {
        if (isAuto === void 0) { isAuto = true; }
        var _this = _super.call(this) || this;
        _this._target = target;
        _this._time = time;
        if (isAuto) {
            _this.start();
        }
        return _this;
    }
    BitmapBlink.prototype.start = function () {
        this._currTime = egret.getTimer();
        this._target.addEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
    };
    BitmapBlink.prototype.runDown = function (e) {
        this._target.alpha -= 0.045;
        if (this.checkOver()) {
            return;
        }
        if (this._target.alpha <= 0.6) {
            this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
            this._target.addEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
        }
    };
    BitmapBlink.prototype.runUp = function (e) {
        this._target.alpha += 0.045;
        if (this.checkOver()) {
            return;
        }
        if (this._target.alpha >= 1) {
            this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
            this._target.addEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
        }
    };
    BitmapBlink.prototype.checkOver = function () {
        var nowTime = egret.getTimer();
        if (nowTime - this._currTime >= this._time) {
            this.destroy();
            return true;
        }
        return false;
    };
    BitmapBlink.prototype.destroy = function () {
        this._target.alpha = 1;
        this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
        this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
        this.dispatchEventWith(egret.Event.COMPLETE, false, this._target);
        this._target = null;
    };
    return BitmapBlink;
}(egret.EventDispatcher));
__reflect(BitmapBlink.prototype, "BitmapBlink");
