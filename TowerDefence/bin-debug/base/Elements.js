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
 * 场景中所有可被摧毁的对象的基类，塔除外
 * @author Andrew_Huang
 * @class Elements
 * @extends {egret.Sprite}
 */
var Elements = (function (_super) {
    __extends(Elements, _super);
    function Elements() {
        var _this = _super.call(this) || this;
        _this._targets = []; //敌人
        _this._canClear = false; //是否可以清除
        return _this;
    }
    /**
     * 创建
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    Elements.prototype.onCreate = function () {
    };
    /**
     * 移动
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    Elements.prototype.move = function () {
    };
    /**
     * 打击效果
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    Elements.prototype.onHit = function () {
    };
    /**
     * 帧事件
     * @author Andrew_Huang
     * @protected
     * @param {number} advTime
     * @memberof Elements
     */
    Elements.prototype.onEnterFrame = function (advTime) {
    };
    /**
     * 销毁
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    Elements.prototype.onDestroy = function () {
        if (this && this.parent) {
            this.parent.removeChild(this);
        }
    };
    Object.defineProperty(Elements.prototype, "targets", {
        get: function () {
            return this._targets;
        },
        set: function (value) {
            this._targets = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Elements.prototype, "damage", {
        get: function () {
            return this._damage;
        },
        set: function (value) {
            this._damage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Elements.prototype, "canClear", {
        get: function () {
            return this._canClear;
        },
        set: function (value) {
            this._canClear = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Elements.prototype, "contentLayer", {
        get: function () {
            return this._contentLayer;
        },
        set: function (value) {
            this._contentLayer = value;
        },
        enumerable: true,
        configurable: true
    });
    return Elements;
}(egret.Sprite));
__reflect(Elements.prototype, "Elements");
