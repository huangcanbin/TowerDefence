var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Created by brucex on 16/5/28.
 */
var meru;
(function (meru) {
    var Animation = (function () {
        function Animation() {
            this._isRunning = false;
            this._timeLine = new TimelineMax({
                onComplete: this.onComplete.bind(this)
            });
            this._animationInfoArr = [];
        }
        Object.defineProperty(Animation.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.to = function (duration, props, ease) {
            this.mergeEase(props, ease);
            this._animationInfoArr.push({ duration: duration / 1000, props: props });
            return this;
        };
        Animation.prototype.mergeEase = function (props, ease) {
            if (ease) {
                props['ease'] = ease;
            }
            else {
                props['ease'] = Linear.easeNone;
            }
        };
        Animation.prototype.toProp = function (prop, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key in prop) {
                var num = prop[key];
                if (type == 'by' || key == 'x' || key == 'y') {
                    obj[key] = num > 0 ? '+=' + num : '-=' + Math.abs(num);
                }
                else {
                    obj[key] = '' + num;
                }
            }
            return obj;
        };
        Animation.prototype.fromProp = function (target, prop, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key in prop) {
                obj[key] = '+=0';
            }
            return obj;
        };
        Animation.prototype.set = function (props) {
            this._animationInfoArr.push({ duration: 0, props: props, type: 'set' });
            return this;
        };
        Animation.prototype.onComplete = function () {
            Animation.removeAnimation(this.target, this);
        };
        Animation.prototype.remove = function () {
            this._animationInfoArr.push({ duration: 0, props: [], type: 'remove' });
            return this;
        };
        Animation.prototype.zoom = function (duration, scale, delay, ease) {
            if (is.fun(delay)) {
                ease = delay;
                delay = 0;
            }
            else if (is.falsy(delay)) {
                delay = 0;
            }
            var one = (duration - delay) / 2;
            this.by(one, { scaleX: scale, scaleY: scale }, ease);
            if (delay > 0) {
                this.delay(delay);
            }
            this.by(one, { scaleX: -scale, scaleY: -scale }, ease);
            return this;
        };
        Object.defineProperty(Animation.prototype, "isRunning", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.run = function (target, isLoop) {
            var _this = this;
            if (target === void 0) { target = this._target; }
            Animation.addAnimation(target, this);
            if (isLoop) {
                this._timeLine.repeat(-1);
            }
            for (var i = 0; i < this._animationInfoArr.length; i++) {
                var info = this._animationInfoArr[i];
                if (info.type == 'delay') {
                    this._timeLine.to(target, info.duration, {});
                }
                else if (info.type == 'call') {
                    var sel = info.props['sel'];
                    var context = info.props['context'];
                    if (sel) {
                        this._timeLine.call(sel.bind(context));
                    }
                }
                else if (info.type == 'set') {
                    this._timeLine.set(target, info.props);
                }
                else if (info.type == 'by') {
                    this._timeLine.fromTo(target, info.duration, this.fromProp(target, info.props), this.toProp(info.props));
                }
                else if (info.type == 'blueprint') {
                    this._timeLine.fromTo(target, info.duration, this.fromProp(target, info.props, 'blueprint'), this.toProp(info.props, 'blueprint'));
                }
                else if (info.type == 'remove') {
                    this._timeLine.call(function () {
                        if (target && target.parent) {
                            target.parent.removeChild(target);
                        }
                    });
                }
                else {
                    this._timeLine.to(target, info.duration, info.props);
                }
            }
            if (!isLoop) {
                this._timeLine.call(function () {
                    Animation.removeAnimation(target, _this);
                });
            }
            this._isRunning = true;
            return this;
        };
        Animation.addAnimation = function (target, animation) {
            if (!target.$__animId__) {
                target.$__animId__ = this._animatoinId++;
            }
            if (!this._animationMap.hasOwnProperty(target.$__animId__)) {
                this._animationMap[target.$__animId__] = [];
            }
            this._animationMap[target.$__animId__].push(animation);
        };
        Animation.removeAnimation = function (target, animation) {
            if (target && target.$__animId__) {
                var arr = this._animationMap[target.$__animId__];
                if (arr) {
                    var idx = arr.indexOf(animation);
                    if (idx > -1) {
                        animation.destory();
                        arr.splice(idx, 1);
                    }
                    if (arr.length == 0) {
                        delete this._animationMap[target.$__animId__];
                    }
                }
            }
        };
        Animation.removeAnimationByTarget = function (target) {
            if (target && target.$__animId__) {
                var arr = this._animationMap[target.$__animId__];
                if (arr) {
                    while (arr.length) {
                        arr.shift().destory();
                    }
                }
                delete this._animationMap[target.$__animId__];
            }
        };
        Animation.prototype.delay = function (duration) {
            this._animationInfoArr.push({ duration: duration / 1000, props: {}, type: 'delay' });
            return this;
        };
        Animation.prototype.call = function (sel, context) {
            this._animationInfoArr.push({ duration: 0, props: { sel: sel, context: context }, type: 'call' });
            return this;
        };
        Animation.prototype.score = function (duration, beginScore, endScore, ease) {
            return null;
        };
        Animation.prototype.shake = function (duration, offsetX, offsetY, ease) {
            return null;
        };
        Animation.prototype.by = function (duration, prop, ease) {
            this.mergeEase(prop, ease);
            this._animationInfoArr.push({ duration: duration / 1000, props: prop, type: 'by' });
            return this;
        };
        Animation.prototype.blueprint = function (animationName, timeScale, scale) {
            if (timeScale === void 0) { timeScale = 1; }
            if (scale === void 0) { scale = {}; }
            var conf = meru.Config.get(meru.getSetting().AnimationBlueprint);
            var animationArr = meru.object.getValue(conf, animationName, []);
            if (is.array(animationArr) && animationArr.length > 0) {
                var lastX = 0;
                var lastY = 0;
                for (var i = 0; i < animationArr.length; i++) {
                    var animationItem = animationArr[i];
                    if (animationItem.hasOwnProperty('delay')) {
                        this.delay((animationItem['delay'] * 1000) * timeScale);
                    }
                    else {
                        var deepObject = meru.object.deepClone(animationItem);
                        for (var key in deepObject) {
                            if (is.number(scale)) {
                                if (key != 'alpha') {
                                    deepObject[key] *= scale;
                                }
                            }
                            else {
                                if (scale.hasOwnProperty(key)) {
                                    deepObject[key] *= scale[key];
                                }
                            }
                            if (key == 'x') {
                                var tmp = deepObject[key];
                                deepObject[key] -= lastX;
                                lastX = tmp;
                            }
                            else if (key == 'y') {
                                var tmp = deepObject[key];
                                deepObject[key] -= lastY;
                                lastY = tmp;
                            }
                        }
                        var duration = (deepObject['duration'] * 1000) * timeScale;
                        this._animationInfoArr.push({ duration: duration / 1000, props: deepObject, type: 'blueprint' });
                    }
                }
            }
            return this;
        };
        Animation.prototype.blink = function (duration, blinks, ease) {
            var step = duration / blinks;
            var visible = true;
            for (var i = 0; i < blinks; i++) {
                this.delay(step);
                this.set({ visible: visible });
                visible = !visible;
            }
            return this;
        };
        Animation.prototype.fadeInOut = function (duration, ease) {
            this.to(duration / 2, { alpha: 0 }, ease);
            this.to(duration / 2, { alpha: 1 }, ease);
            return this;
        };
        Animation.prototype.destory = function () {
            this._timeLine.kill();
            this._timeLine = null;
            this._target = null;
        };
        Animation.prototype.stop = function () {
            this._timeLine.totalProgress(1);
            Animation.removeAnimation(this.target, this);
        };
        Animation.prototype.pause = function () {
            this._timeLine.pause();
        };
        Animation.prototype.setTarget = function (obj) {
            this._target = obj;
            return this;
        };
        Animation.prototype.resume = function () {
            this._timeLine.resume();
        };
        Animation.stopAnimationByTarget = function (target) {
            if (target && target.$__animId__) {
                var arr = this._animationMap[target.$__animId__];
                if (arr && arr.length > 0) {
                    while (arr.length) {
                        arr.shift().stop();
                    }
                }
                delete this._animationMap[target.$__animId__];
            }
        };
        Animation.by = function (duration, props, ease) {
            return new Animation().by(duration, props, ease);
        };
        Animation.blueprint = function (animationName, timeScale, scale) {
            return new Animation().blueprint(animationName, timeScale, scale);
        };
        Animation.fadeInOut = function (duration, ease) {
            return new Animation().fadeInOut(duration, ease);
        };
        Animation.set = function (props) {
            return new Animation().set(props);
        };
        Animation.setTarget = function (target) {
            return new Animation().setTarget(target);
        };
        Animation.zoom = function (duration, scale, delay, ease) {
            return new Animation().zoom(duration, scale, delay, ease);
        };
        Animation.delay = function (duration) {
            return new Animation().delay(duration);
        };
        Animation.call = function (sel, context) {
            if (context === void 0) { context = null; }
            return new Animation().call(sel, context);
        };
        Animation.to = function (duration, props, ease) {
            return new Animation().to(duration, props, ease);
        };
        Animation._animationMap = {};
        Animation._animatoinId = 1;
        return Animation;
    }());
    meru.Animation = Animation;
    __reflect(Animation.prototype, "meru.Animation", ["meru.IAnimation"]);
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/15.
 */
var meru;
(function (meru) {
    var ToggleButton = (function (_super) {
        __extends(ToggleButton, _super);
        function ToggleButton() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.buttonAddStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.buttonRemoveStage, _this);
            return _this;
        }
        Object.defineProperty(ToggleButton.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ToggleButton.prototype, "notice", {
            get: function () {
                return this._notice;
            },
            set: function (value) {
                this._notice = value;
            },
            enumerable: true,
            configurable: true
        });
        ToggleButton.prototype.buttonAddStage = function () {
            meru.addPullObject(meru.k.GET_BUTTON, this.getButton, this);
        };
        ToggleButton.prototype.buttonRemoveStage = function () {
            meru.removePullObject(meru.k.GET_BUTTON, this.getButton, this);
        };
        ToggleButton.prototype.getButton = function (name) {
            if (this.name == name) {
                return this;
            }
        };
        ToggleButton.prototype.getCurrentState = function () {
            var state = this.skin.currentState;
            if (this.selected) {
                if (this.skin.hasState(state + 'AndSelected')) {
                    return state + 'AndSelected';
                }
            }
            else {
                if (state.indexOf('AndSelected') > -1) {
                    return state.replace('AndSelected', '');
                }
            }
            return _super.prototype.getCurrentState.call(this);
        };
        ToggleButton.prototype.buttonReleased = function () {
            if (is.truthy(this._notice)) {
                var data = this.data;
                if (!data) {
                    var host = meru.display.getHostComponent(this);
                    if (host) {
                        data = host.data;
                    }
                }
                var old = this.selected;
                var state = meru.pullObject(meru.str.formatNotice(this._notice), data, host, this);
                if ((typeof (state) == 'boolean' && state == true) || state == data) {
                    if (old == this.selected) {
                        this.selected = !this.selected;
                    }
                    if (this.selected) {
                        if (this.name) {
                            meru.postNotification(meru.k.CLICK_BUTTON, this.name, this);
                        }
                    }
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            else {
                _super.prototype.buttonReleased.call(this);
                if (this.name) {
                    meru.postNotification(meru.k.CLICK_BUTTON, this.name, this);
                }
            }
        };
        return ToggleButton;
    }(eui.ToggleButton));
    meru.ToggleButton = ToggleButton;
    __reflect(ToggleButton.prototype, "meru.ToggleButton");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var NoneAnimation = (function () {
        function NoneAnimation() {
        }
        Object.defineProperty(NoneAnimation.prototype, "component", {
            get: function () {
                return this._component;
            },
            set: function (value) {
                this._component = value;
            },
            enumerable: true,
            configurable: true
        });
        NoneAnimation.prototype.show = function (callback) {
            if (callback) {
                callback();
            }
        };
        NoneAnimation.prototype.close = function (callback) {
            if (callback) {
                callback();
            }
        };
        return NoneAnimation;
    }());
    meru.NoneAnimation = NoneAnimation;
    __reflect(NoneAnimation.prototype, "meru.NoneAnimation", ["meru.IUIAnimation"]);
    /**
     * UIAnimation
     */
    var PanelAnimation = (function () {
        function PanelAnimation() {
        }
        Object.defineProperty(PanelAnimation.prototype, "component", {
            get: function () {
                return this._component;
            },
            set: function (value) {
                this._component = value;
            },
            enumerable: true,
            configurable: true
        });
        PanelAnimation.prototype.moveBy = function (displayObj, callback, ease) {
            meru.Animation.removeAnimationByTarget(displayObj);
            meru.Animation.by(200, { x: 640 }).call(function () {
                if (callback) {
                    callback();
                }
            }, ease).run(displayObj);
        };
        PanelAnimation.prototype.show = function (callback) {
            var displayObj = this._component.getAnimationDisplay();
            displayObj.x = -640;
            this.moveBy(displayObj, callback, Back.easeOut);
        };
        PanelAnimation.prototype.close = function (callback) {
            var displayObj = this._component.getAnimationDisplay();
            displayObj.x = 0;
            this.moveBy(displayObj, callback, Back.easeIn);
        };
        return PanelAnimation;
    }());
    meru.PanelAnimation = PanelAnimation;
    __reflect(PanelAnimation.prototype, "meru.PanelAnimation", ["meru.IUIAnimation"]);
    var BaseBoxAnimation = (function () {
        function BaseBoxAnimation() {
        }
        Object.defineProperty(BaseBoxAnimation.prototype, "component", {
            get: function () {
                return this._component;
            },
            set: function (value) {
                this._component = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseBoxAnimation.prototype.runAnimation = function (callback, boxAnim, maskAnim) {
            var box = this._component.getAnimationDisplay("box");
            var mask = this._component.getAnimationDisplay("mask");
            var animArr = [];
            if (box) {
                var showBoxAnim = boxAnim.call(this, box);
                if (showBoxAnim) {
                    animArr.push(showBoxAnim);
                }
            }
            if (mask) {
                var showMaskAnim = maskAnim.call(this, mask);
                if (showMaskAnim) {
                    animArr.push(showMaskAnim);
                }
            }
            if (animArr.length == 0) {
                if (callback) {
                    callback();
                }
            }
            else {
                for (var i = 0; i < animArr.length; i++) {
                    if (i == 0) {
                        animArr[i].call(callback);
                    }
                    if (!animArr[i].isRunning) {
                        animArr[i].run();
                    }
                }
            }
        };
        BaseBoxAnimation.prototype.show = function (callback) {
            this.runAnimation(callback, this.getShowBoxAnmation, this.getShowMaskAnimation);
        };
        BaseBoxAnimation.prototype.close = function (callback) {
            this.runAnimation(callback, this.getCloseBoxAnimation, this.getCloseMaskAnimation);
        };
        BaseBoxAnimation.prototype.getShowBoxAnmation = function (box) {
            return null;
        };
        BaseBoxAnimation.prototype.getShowMaskAnimation = function (mask) {
            return null;
        };
        BaseBoxAnimation.prototype.getCloseBoxAnimation = function (box) {
            return null;
        };
        BaseBoxAnimation.prototype.getCloseMaskAnimation = function (mask) {
            return null;
        };
        return BaseBoxAnimation;
    }());
    meru.BaseBoxAnimation = BaseBoxAnimation;
    __reflect(BaseBoxAnimation.prototype, "meru.BaseBoxAnimation", ["meru.IUIAnimation"]);
    var BoxAnimation = (function (_super) {
        __extends(BoxAnimation, _super);
        function BoxAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxAnimation.prototype.getShowBoxAnmation = function (box) {
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            meru.Animation.removeAnimationByTarget(box);
            return meru.Animation.to(150, { alpha: 1, scaleX: 1, scaleY: 1 }).run(box);
        };
        BoxAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha;
            mask.alpha = 0;
            return meru.Animation.to(150, { alpha: alpha }).run(mask);
        };
        return BoxAnimation;
    }(BaseBoxAnimation));
    meru.BoxAnimation = BoxAnimation;
    __reflect(BoxAnimation.prototype, "meru.BoxAnimation");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/1.
 */
var meru;
(function (meru) {
    var DataStore = (function () {
        function DataStore(propertyName) {
            this._cacheMap = {};
            this._instMap = {};
            this._propertyName = propertyName;
        }
        Object.defineProperty(DataStore.prototype, "propertyName", {
            get: function () {
                return this._propertyName;
            },
            enumerable: true,
            configurable: true
        });
        DataStore.prototype.has = function (val) {
            return this._cacheMap.hasOwnProperty(val) && this._cacheMap[val].length > 0;
        };
        DataStore.prototype.getVal = function (model) {
            var v = model.getValue(this._propertyName);
            if (is.truthy(v)) {
                return v;
            }
            return "unknown";
        };
        DataStore.prototype.onAdd = function (model) {
            var val = this.getVal(model);
            if (is.truthy(val)) {
                if (!this._cacheMap.hasOwnProperty(val)) {
                    this._cacheMap[val] = [];
                }
                this._instMap[model.hashCode] = val;
                if (this._cacheMap[val].indexOf(model) == -1) {
                    this._cacheMap[val].push(model);
                }
            }
        };
        DataStore.prototype.onDelete = function (obj) {
            var val = this.getVal(obj);
            delete this._instMap[obj.hashCode];
            if (this._cacheMap.hasOwnProperty(val)) {
                var arr = this._cacheMap[val];
                meru.array.remove(arr, obj);
            }
        };
        DataStore.prototype.update = function (obj) {
            if (this._instMap.hasOwnProperty(obj.hashCode)) {
                var val = this._instMap[obj.hashCode];
                if (this._cacheMap.hasOwnProperty(val)) {
                    meru.array.remove(this._cacheMap[val], obj);
                }
                delete this._instMap[obj.hashCode];
            }
            var val = this.getVal(obj);
            if (is.truthy(val)) {
                this._instMap[obj.hashCode] = val;
                if (!this._cacheMap.hasOwnProperty(val)) {
                    this._cacheMap[val] = [];
                }
                if (this._cacheMap[val].indexOf(obj) == -1) {
                    this._cacheMap[val].push(obj);
                }
            }
        };
        DataStore.prototype.getNewModel = function (type, arg) {
            return null;
        };
        DataStore.prototype.getModel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (type == this._propertyName) {
                var arr = [];
                for (var i = 0; i < args.length; i++) {
                    if (this._cacheMap.hasOwnProperty(args[i])) {
                        arr = arr.concat(this._cacheMap[args[i]]);
                    }
                }
                return arr;
            }
            return null;
        };
        return DataStore;
    }());
    meru.DataStore = DataStore;
    __reflect(DataStore.prototype, "meru.DataStore", ["meru.IDataStore"]);
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/1.
 */
var meru;
(function (meru) {
    var data;
    (function (data) {
        var DataUtils = (function () {
            function DataUtils() {
            }
            DataUtils.formatAliasKey = function (key) {
                var r = /([a-zA-Z_]+)\s*(as)\s*([a-zA-Z_]+)/gi;
                var obj = {};
                if (r.test(key)) {
                    obj.proxyKey = RegExp.$1;
                    obj.configKey = RegExp.$3;
                }
                else {
                    obj.proxyKey = obj.configKey = key;
                }
                return obj;
            };
            return DataUtils;
        }());
        data.DataUtils = DataUtils;
        __reflect(DataUtils.prototype, "meru.data.DataUtils");
    })(data = meru.data || (meru.data = {}));
})(meru || (meru = {}));
/**
 * Created by brucex on 9/1/14.
 */
var meru;
(function (meru) {
    var ProxyErrorCode = (function () {
        function ProxyErrorCode() {
        }
        ProxyErrorCode.ERROR_DATA = 100000;
        ProxyErrorCode.TIME_OUT = 100001;
        ProxyErrorCode.ERROR_REQUEST = 100002;
        return ProxyErrorCode;
    }());
    meru.ProxyErrorCode = ProxyErrorCode;
    __reflect(ProxyErrorCode.prototype, "meru.ProxyErrorCode");
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(params) {
            if (params === void 0) { params = {}; }
            var _this = _super.call(this) || this;
            _this._isTimeout = false;
            _this._timeoutId = null;
            _this._method = egret.HttpMethod.GET;
            _this._listeners = [];
            _this._customParams = {};
            _this._params = _this.formatParams(params);
            _this._requestUrl = Proxy.request_url;
            return _this;
        }
        Proxy.prototype.formatParams = function (params) {
            if (params && !params.hasOwnProperty("do") && params.hasOwnProperty("mod")) {
                var mod = params["mod"];
                if (mod.indexOf(".") > -1) {
                    var modarr = mod.split(".");
                    params["mod"] = modarr[0];
                    params["do"] = modarr[1];
                }
            }
            return params;
        };
        Object.defineProperty(Proxy.prototype, "requestUrl", {
            get: function () {
                return this._requestUrl;
            },
            set: function (value) {
                this._requestUrl = value;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.paramsToQueryString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var params = [];
            for (var i = 0; i < args.length; i++) {
                var item = args[i];
                for (var key in item) {
                    params.push(key + "=" + item[key]);
                }
            }
            return params.join("&");
        };
        Object.defineProperty(Proxy.prototype, "method", {
            get: function () {
                return this._method;
            },
            set: function (value) {
                this._method = value;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.load = function () {
            var _this = this;
            var url = this._requestUrl.indexOf("?") == -1 ? this._requestUrl + "?" : this._requestUrl;
            if (url[url.length - 1] != "?" && url[url.length - 1] != "&") {
                url += "&";
            }
            var filterResult = meru.pullObject(meru.ProxyAction.BEGIN_LOAD, this);
            this._status = meru.ProxyStatus.REQUEST;
            meru.postNotification(meru.ProxyAction.REQUEST, this);
            if (filterResult === this || filterResult === true) {
                this._status = meru.ProxyStatus.WAIT;
                meru.postNotification(meru.ProxyAction.WAIT, this);
                var hashKey;
                if (meru.localStorage.isSetPrefix()) {
                    hashKey = meru.localStorage.getItem("hashKey");
                }
                else {
                    hashKey = egret.localStorage.getItem("hashKey");
                }
                if (Proxy.hashKey) {
                    hashKey = Proxy.hashKey;
                }
                var paramsString = this.getParamString();
                var md5OriginalStr = paramsString + meru.pullObject("scode", "xsanguox888~1f2a3");
                var m5 = new meru.md5();
                this.addParam("s", m5.hex_md5(md5OriginalStr));
                var request = new egret.HttpRequest();
                var params = { "h": hashKey };
                request.responseType = egret.HttpResponseType.TEXT;
                request.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
                this._timeoutId = egret.setTimeout(function () {
                    request.removeEventListener(egret.IOErrorEvent.IO_ERROR, _this.onError, _this);
                    request.removeEventListener(egret.Event.COMPLETE, _this.onComplete, _this);
                    _this._errorCode = ProxyErrorCode.TIME_OUT;
                    _this._errorMessage = "请求超时";
                    _this._isTimeout = true;
                    meru.postNotification(meru.ProxyAction.TIMEOUT, _this);
                    _this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.TIME_OUT, _this));
                    _this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.ERROR, _this));
                    meru.postNotification(meru.ProxyAction.REQUEST_ERROR, _this);
                }, this, Proxy._timeout);
                if (this._method == egret.HttpMethod.GET) {
                    params['data'] = paramsString;
                    var queryString = this.paramsToQueryString(params, this._customParams, Proxy._globalParams);
                    url += queryString;
                    request.open(url, egret.HttpMethod.GET);
                    request.send();
                }
                else {
                    var queryString = this.paramsToQueryString(params, this._customParams, Proxy._globalParams);
                    url += queryString;
                    request.open(url, egret.HttpMethod.POST);
                    request.send(paramsString);
                }
            }
        };
        Object.defineProperty(Proxy.prototype, "isTimeout", {
            get: function () {
                return this._isTimeout;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.canClearEventListener = function () {
            if (this._isResponseSucceed) {
                return true;
            }
            if (this.getParamByName('notReload') == true) {
                return true;
            }
            if (this.getParamByName("reload") == true && this["reloadTimes"] >= 3) {
                return true;
            }
            return false;
        };
        Proxy.prototype.proxyDone = function () {
            if (Proxy.CLEAR_LISTENER) {
                if (this.canClearEventListener()) {
                    this.clearEventListener();
                }
            }
        };
        Proxy.prototype.onError = function (event) {
            this._isRequestSucceed = false;
            this._errorMessage = "请求失败";
            this._errorCode = ProxyErrorCode.ERROR_REQUEST;
            egret.clearTimeout(this._timeoutId);
            this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.REQUEST_FAIL, this));
            this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.ERROR, this));
            meru.postNotification(meru.ProxyAction.REQUEST_ERROR, this);
            meru.postNotification(meru.ProxyAction.RESPONSE, this);
            this.proxyDone();
        };
        Proxy.prototype.onResponse = function (data) {
            this._responseData = data;
            this._isResponseSucceed = false;
            this._status = meru.ProxyStatus.RESPONSE;
            if (this._responseData && this._responseData.hasOwnProperty("s")) {
                this._isResponseSucceed = this._responseData["s"] == 0;
            }
            this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.REQUEST_SUCCEED, this));
            this._errorCode = this._responseData ? this._responseData["s"] : ProxyErrorCode.ERROR_DATA;
            this._isRequestSucceed = true;
            meru.postNotification(meru.ProxyAction.REQUEST_SUCCEED, this);
            meru.postNotification(meru.ProxyAction.RESPONSE, this);
            if (this._isResponseSucceed) {
                meru.postNotification(meru.ProxyAction.RESPONSE_SUCCEED, this);
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.RESPONSE_SUCCEED, this));
            }
            else {
                meru.postNotification(meru.ProxyAction.RESPONSE_ERROR, this);
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.RESPONSE_ERROR, this));
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.ERROR, this));
            }
            this.proxyDone();
        };
        Proxy.prototype.onComplete = function (event) {
            egret.clearTimeout(this._timeoutId);
            var data = null;
            try {
                data = JSON.parse(event.target.response);
            }
            catch (e) { }
            this.onResponse(data);
        };
        Proxy.prototype.getURLVariables = function (params) {
            var list = [];
            for (var key in params) {
                list.push(key + "=" + params[key]);
            }
            var str = list.join("&");
            return new egret.URLVariables(str);
        };
        Proxy.prototype.getParamByName = function (name) {
            if (!this._params) {
                return null;
            }
            return this._params[name];
        };
        Proxy.prototype.hasParamByName = function (name) {
            if (!this._params) {
                return false;
            }
            return this._params.hasOwnProperty(name);
        };
        Object.defineProperty(Proxy.prototype, "params", {
            get: function () {
                return this._params;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Proxy.prototype, "responseData", {
            get: function () {
                return this._responseData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Proxy.prototype, "isResponseSucceed", {
            get: function () {
                return this._isResponseSucceed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Proxy.prototype, "isRequestSucceed", {
            get: function () {
                return this._isRequestSucceed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Proxy.prototype, "errorMessage", {
            get: function () {
                return this._errorMessage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Proxy.prototype, "errorCode", {
            get: function () {
                return this._errorCode;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.addParam = function (key, value) {
            this._customParams[key] = value;
        };
        Proxy.prototype.getParamString = function () {
            return null;
        };
        Proxy.prototype.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            _super.prototype.addEventListener.call(this, type, listener, thisObject, useCapture, priority);
            this._listeners.push({ 'type': type, 'listener': listener, 'thisObj': thisObject, 'capture': useCapture, 'priority': priority });
        };
        Proxy.prototype.clearEventListener = function () {
            while (this._listeners.length > 0) {
                var obj = this._listeners.shift();
                this.removeEventListener(obj['type'], obj['listener'], obj['thisObj'], obj['capture']);
            }
        };
        Proxy.addGlobalParams = function (key, params) {
            this._globalParams[key] = params;
        };
        Proxy.getGlobalParam = function (key) {
            return this._globalParams[key];
        };
        Proxy.removeGlobalParams = function (key) {
            delete this._globalParams[key];
        };
        Proxy.CLEAR_LISTENER = true;
        Proxy.hashKey = "";
        Proxy.request_path = "";
        Proxy.request_url = "";
        Proxy.frontProxyKeys = ["mask", "cache", "autoMerge", "delay", "dataMerge"];
        Proxy._timeout = 20000;
        Proxy._globalParams = {};
        return Proxy;
    }(egret.EventDispatcher));
    meru.Proxy = Proxy;
    __reflect(Proxy.prototype, "meru.Proxy");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/30.
 */
var meru;
(function (meru) {
    var BaseNotification = (function () {
        function BaseNotification() {
            this._nameObservers = {};
        }
        BaseNotification.prototype.addObserver = function (name, sender, context, priority) {
            if (priority === void 0) { priority = 0; }
            var typeId = meru.getTypeId(context);
            if (!this._nameObservers.hasOwnProperty(name)) {
                this._nameObservers[name] = {};
            }
            var observerObj = this._nameObservers[name];
            if (!observerObj.hasOwnProperty(typeId)) {
                observerObj[typeId] = [];
            }
            var obj = { name: name, sender: sender, priority: priority, context: context };
            observerObj[typeId].push(obj);
            observerObj[typeId] = observerObj[typeId].sort(function (a, b) {
                return b.priority - a.priority;
            });
            return obj;
        };
        BaseNotification.prototype.onceObserver = function (name, sender, context, priority) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            var ret;
            var obj = function () {
                if (sender) {
                    sender.call(context);
                }
                _this.removeObserverByInfo(_this, ret);
            };
            ret = this.addObserver(name, obj, this, priority);
        };
        BaseNotification.prototype.removeObserverByInfo = function (context, info) {
            if (!meru.hasTypeId(context)) {
                return;
            }
            var typeId = meru.getTypeId(context);
            var observerObj = this._nameObservers[info.name];
            if (observerObj.hasOwnProperty(typeId)) {
                var idx = observerObj[typeId].indexOf(info);
                if (idx > -1) {
                    observerObj[typeId].splice(idx, 1);
                }
            }
        };
        BaseNotification.prototype.removeObserver = function (name, sender, context) {
            var observers = this._nameObservers[name];
            for (var key in observers) {
                var observerArr = observers[key];
                meru.array.remove(observerArr, function (item) {
                    return item.sender == sender && item.context == context;
                });
            }
        };
        BaseNotification.prototype.removeObserverByObject = function (context) {
            if (!meru.hasTypeId(context)) {
                return;
            }
            var typeId = meru.getTypeId(context);
            for (var key in this._nameObservers) {
                var observerMap = this._nameObservers[key];
                if (observerMap.hasOwnProperty(typeId)) {
                    delete observerMap[typeId];
                }
            }
        };
        BaseNotification.prototype.removeObserverByName = function (name) {
            if (this._nameObservers.hasOwnProperty(name)) {
                delete this._nameObservers[name];
            }
        };
        return BaseNotification;
    }());
    meru.BaseNotification = BaseNotification;
    __reflect(BaseNotification.prototype, "meru.BaseNotification");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/9/4.
 */
var meru;
(function (meru) {
    function def(object, property, getter, setter) {
        var obj = {};
        obj.configurable = true;
        obj.enumerable = true;
        obj.get = getter;
        if (setter) {
            obj.set = setter;
        }
        Object.defineProperty(object, property, obj);
    }
    meru.def = def;
    def(meru, 'stage', function () {
        return egret.MainContext.instance.stage;
    });
    function getConst(name, def_val) {
        if (def_val === void 0) { def_val = null; }
        var setting_val = meru.Config.get('game_setting_json', "" + name, null);
        if (setting_val != null) {
            return setting_val;
        }
        return meru.Config.get('project_json', "Game." + name, def_val);
    }
    meru.getConst = getConst;
    var __game_callback = null;
    function $getCallback() {
        if (!__game_callback) {
            __game_callback = meru.getDefinitionInstance(meru.getSetting().GameCallbackClass);
        }
        return __game_callback;
    }
    meru.$getCallback = $getCallback;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/7/28.
 */
var meru;
(function (meru) {
    var ComponentState = (function () {
        function ComponentState(component) {
            this._args = [];
            this._listeners = [];
            this._component = component;
            component.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            component.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        }
        ComponentState.prototype.getArgs = function () {
            return this._args;
        };
        ComponentState.prototype.setArgs = function (args) {
            this._args = args;
        };
        ComponentState.prototype.listener = function (component, func) {
            if (!component || !func) {
                return;
            }
            var type = null;
            if (component instanceof eui.RadioButton) {
                type = eui.PropertyEvent.PROPERTY_CHANGE;
            }
            else {
                type = egret.TouchEvent.TOUCH_TAP;
            }
            this._listeners.push({ component: component, func: func, type: type });
            component.addEventListener(type, func, this._component);
        };
        ComponentState.prototype.onAddToStage = function (e) {
            meru.addPullObject(meru.k.GetComponent, this.getComopnent, this);
            (_a = this._component).onEnter.apply(_a, this._args);
            var _a;
        };
        ComponentState.prototype.onRemovedFromStage = function () {
            meru.removePullObject(meru.k.GetComponent, this.getComopnent, this);
            this.clearLiteners();
            this._component.onExit();
        };
        ComponentState.prototype.clearLiteners = function () {
            while (this._listeners.length > 0) {
                var listItem = this._listeners.shift();
                listItem.component.removeEventListener(listItem.type, listItem.func, this);
            }
        };
        ComponentState.prototype.getComopnent = function (id) {
            if (id == this._component.autoId && is.truthy(id)) {
                return this._component;
            }
            else if (this._component.componentName == id && is.truthy(id)) {
                return this._component;
            }
        };
        return ComponentState;
    }());
    meru.ComponentState = ComponentState;
    __reflect(ComponentState.prototype, "meru.ComponentState");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/12.
 */
var meru;
(function (meru) {
    var DragType;
    (function (DragType) {
        DragType[DragType["BEGIN"] = 0] = "BEGIN";
        DragType[DragType["MOVE"] = 1] = "MOVE";
        DragType[DragType["END"] = 2] = "END";
        DragType[DragType["INTERSECTS"] = 3] = "INTERSECTS";
        DragType[DragType["BACK"] = 4] = "BACK";
    })(DragType = meru.DragType || (meru.DragType = {}));
    var Draggable = (function () {
        function Draggable() {
            this._dragItems = [];
            this._dropItems = [];
            this._old = new egret.Point();
            this._oldParent = null;
            this._begin = new egret.Point();
            this._isDragCloneable = false;
            this._originDisplay = null;
            this._offset = new egret.Point();
        }
        Draggable.prototype.addDragItems = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var arr = [];
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (is.array(arg)) {
                    arr = arr.concat(arg);
                }
                else if (is.existy(arg)) {
                    arr.push(arg);
                }
            }
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                item.touchEnabled = true;
                item.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
                this._dragItems.push(item);
            }
            return this;
        };
        Draggable.prototype.setCallback = function (callback) {
            this._callback = callback;
            return this;
        };
        Draggable.prototype.addDropItems = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (is.array(arg)) {
                    this._dropItems = this._dropItems.concat(arg);
                }
                else if (is.existy(arg)) {
                    this._dropItems.push(arg);
                }
            }
            return this;
        };
        Draggable.prototype.onBegin = function (e) {
            this._curDragItem = e.currentTarget;
            this._begin.x = e.stageX;
            this._begin.y = e.stageY;
            this._old.x = this._curDragItem.x;
            this._old.y = this._curDragItem.y;
            var pt = this._curDragItem.localToGlobal(0, 0);
            this._offset.x = pt.x - e.stageX;
            this._offset.y = pt.y - e.stageY;
            this._oldParent = this._curDragItem.parent;
            this._originDisplay = this._curDragItem;
            if (egret.is(this._curDragItem, "meru.IDragCloneable")) {
                var item = this._curDragItem.dragClone();
                item.x = pt.x;
                item.y = pt.y;
                meru.stage.addChild(item);
                this._curDragItem = item;
                this._isDragCloneable = true;
            }
            else {
                this._curDragItem.x = pt.x;
                this._curDragItem.y = pt.y;
                this._oldParent = this._curDragItem.parent;
                meru.stage.addChild(this._curDragItem);
                this._isDragCloneable = false;
            }
            if (this._callback) {
                this._callback(DragType.BEGIN, this._originDisplay, null);
            }
            meru.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            meru.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        };
        Draggable.prototype.onMove = function (e) {
            this._curDragItem.x = e.stageX + this._offset.x;
            this._curDragItem.y = e.stageY + this._offset.y;
            if (this._callback) {
                this._callback(DragType.MOVE, this._originDisplay, null);
            }
        };
        Draggable.prototype.onEnd = function (e) {
            var _this = this;
            var end = new egret.Point(e.stageX, e.stageY);
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            var pt = new egret.Point();
            var foundItem = null;
            var dragRect = this.getDisplayRect(this._curDragItem);
            for (var i = 0; i < this._dropItems.length; i++) {
                var dropItem = this._dropItems[i];
                var dropRect = this.getDisplayRect(dropItem);
                if (dragRect.intersects(dropRect)) {
                    foundItem = dropItem;
                    break;
                }
            }
            if (this._callback) {
                this._callback(DragType.END, this._originDisplay, null);
                if (foundItem) {
                    this._callback(DragType.INTERSECTS, this._originDisplay, foundItem);
                }
            }
            if (foundItem) {
                if (this._isDragCloneable) {
                    meru.display.removeFromParent(this._curDragItem);
                }
            }
            else {
                pt = this._oldParent.localToGlobal(this._old.x, this._old.y);
                var dist = egret.Point.distance(end, pt) / 2;
                if (this._isDragCloneable) {
                    meru.Animation.to(dist, { x: pt.x, y: pt.y }).call(function () {
                        meru.display.removeFromParent(_this._curDragItem);
                        if (_this._callback) {
                            _this._callback(DragType.BACK, _this._originDisplay, null);
                        }
                    }).run(this._curDragItem);
                }
                else {
                    this._curDragItem.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
                    meru.Animation.to(dist, { x: pt.x, y: pt.y }).call(function () {
                        _this._curDragItem.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onBegin, _this);
                        _this._oldParent.addChild(_this._curDragItem);
                        _this._curDragItem.x = _this._old.x;
                        _this._curDragItem.y = _this._old.y;
                        if (_this._callback) {
                            _this._callback(DragType.BACK, _this._originDisplay, null);
                        }
                    }).run(this._curDragItem);
                }
            }
        };
        Draggable.prototype.getDisplayRect = function (displayObj, bounds) {
            if (bounds === void 0) { bounds = new egret.Rectangle(); }
            bounds = displayObj.getBounds(bounds);
            var pt = displayObj.localToGlobal(0, 0);
            bounds.x = pt.x;
            bounds.y = pt.y;
            return bounds;
        };
        Draggable.prototype.dispose = function () {
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            while (this._dragItems.length) {
                var item = this._dragItems.shift();
                item.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
                item.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                item.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            }
        };
        Draggable.addDragItems = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = new Draggable();
            ret.addDragItems.apply(ret, args);
            return ret;
        };
        Draggable.setCallback = function (callback) {
            var ret = new Draggable();
            ret.setCallback(callback);
            return ret;
        };
        Draggable.addDropItems = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ret = new Draggable();
            ret.addDropItems.apply(ret, args);
            return ret;
        };
        return Draggable;
    }());
    meru.Draggable = Draggable;
    __reflect(Draggable.prototype, "meru.Draggable");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/7/28.
 */
var meru;
(function (meru) {
    var ItemRenderer = (function (_super) {
        __extends(ItemRenderer, _super);
        function ItemRenderer() {
            var _this = _super.call(this) || this;
            _this._ignoreButton = false;
            _this._dataMapArr = [];
            _this._watchers = [];
            _this._state = new meru.ComponentState(_this);
            return _this;
        }
        Object.defineProperty(ItemRenderer.prototype, "notice", {
            get: function () {
                return this._notice;
            },
            set: function (notice) {
                this._notice = notice;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRenderer.prototype, "componentName", {
            get: function () {
                return this._componentName;
            },
            set: function (value) {
                this._componentName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRenderer.prototype, "ignoreButton", {
            get: function () {
                return this._ignoreButton;
            },
            set: function (value) {
                this._ignoreButton = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemRenderer.prototype, "data", {
            get: function () {
                return this.$_data;
            },
            set: function (val) {
                this.$_data = val;
                if (val != null) {
                    this.addDataMap('data');
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
                this.dataChanged();
            },
            enumerable: true,
            configurable: true
        });
        ItemRenderer.prototype.addDataMap = function (name) {
            if (this._dataMapArr.indexOf(name) == -1) {
                this._dataMapArr.push(name);
            }
        };
        ItemRenderer.prototype.setData = function (data, type) {
            if (type === void 0) { type = 'data'; }
            this[type] = data;
            if (data != null) {
                this.addDataMap(type);
            }
            return this;
        };
        ItemRenderer.prototype.dataChanged = function () {
            meru.display.setAttribute(this);
            while (this._watchers.length) {
                this._watchers.shift().unwatch();
            }
            this._watchers.push(eui.Binding.bindHandler(this.data, ['selected'], this.updateSelect, this));
            this._watchers.push(eui.Binding.bindHandler(this, ['enabled'], this.onUpdateEnabled, this));
            if (this.data && is.bool(this.data.selected)) {
                this.selected = this.data.selected;
            }
        };
        ItemRenderer.prototype.onUpdateEnabled = function () {
            meru.propertyChange(this, 'currentState');
        };
        ItemRenderer.prototype.updateAttribute = function (attribute) {
            this[attribute.name] = attribute.value;
        };
        ItemRenderer.prototype.setState = function (name) {
            this.currentState = name;
            return this;
        };
        ItemRenderer.prototype.setCompName = function (name) {
            this.componentName = name;
            return this;
        };
        ItemRenderer.prototype.updateSelect = function () {
            if (this.data) {
                this.selected = this.data.selected;
            }
        };
        ItemRenderer.prototype.listener = function (component, sender) {
            this._state.listener(component, sender);
        };
        Object.defineProperty(ItemRenderer.prototype, "autoId", {
            get: function () {
                return this.data ? this.data.autoId : '';
            },
            enumerable: true,
            configurable: true
        });
        ItemRenderer.prototype.onEnter = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
            meru.addPullObject(meru.k.GetComponent, this.getComopnent, this);
        };
        ItemRenderer.prototype.onExit = function () {
            while (this._watchers.length) {
                this._watchers.shift().unwatch();
            }
            meru.removePullObject(meru.k.GetComponent, this.getComopnent, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
        };
        ItemRenderer.prototype.getComopnent = function (id) {
            if (id == this.autoId && is.truthy(id)) {
                return this;
            }
            else if (this.componentName == id && is.truthy(id)) {
                return this;
            }
        };
        ItemRenderer.prototype.getCurrentState = function () {
            if (this.enabled == false && this.skin.hasState('disabled')) {
                return 'disabled';
            }
            var state = this.skin.currentState;
            var s = _super.prototype.getCurrentState.call(this);
            if (this.skin.hasState(s)) {
                return s;
            }
            return state;
        };
        ItemRenderer.prototype.destoryData = function () {
            while (this._dataMapArr.length) {
                this[this._dataMapArr.shift()] = null;
            }
            meru.display.destoryChildren(this);
        };
        ItemRenderer.prototype.tap = function (e) {
            if (!this.ignoreButton && e.target instanceof meru.Button) {
                e.stopPropagation();
                return;
            }
            if (is.truthy(this._notice)) {
                meru.postNotification(meru.str.formatNotice(this._notice), this.data, this);
            }
        };
        return ItemRenderer;
    }(eui.ItemRenderer));
    meru.ItemRenderer = ItemRenderer;
    __reflect(ItemRenderer.prototype, "meru.ItemRenderer", ["meru.IComponent", "egret.DisplayObject", "meru.IAttributeHost"]);
})(meru || (meru = {}));
var meru;
(function (meru) {
    var MovieClock = (function () {
        function MovieClock() {
            this._lastTime = 0;
        }
        MovieClock.prototype.start = function () {
            this._lastTime = egret.getTimer();
            egret.startTick(this.tick, this);
        };
        MovieClock.prototype.stop = function () {
            egret.stopTick(this.tick, this);
        };
        MovieClock.prototype.tick = function (time) {
            var delta = time - this._lastTime;
            this._lastTime = time;
            dragonBones.WorldClock.clock.advanceTime(delta / 1000);
            return false;
        };
        return MovieClock;
    }());
    __reflect(MovieClock.prototype, "MovieClock");
    var MovieEgretFactory = (function () {
        function MovieEgretFactory() {
            this._parseMap = {};
        }
        MovieEgretFactory.prototype.getFactory = function (prefix) {
            if (!this._clock) {
                this._clock = new MovieClock();
                this._clock.start();
            }
            if (!this.factory) {
                this.factory = new dragonBones.EgretFactory();
            }
            if (!this._parseMap.hasOwnProperty(prefix)) {
                var animation = prefix + "_anim.json";
                var json = prefix + "_texture.json";
                var texture = prefix + "_texture.png";
                var data = RES.getRes(animation);
                this.factory.parseDragonBonesData(data);
                if (RES.hasRes(json)) {
                    var textureData = RES.getRes(json);
                    var textureImage = RES.getRes(texture);
                    this.factory.parseTextureAtlasData(textureData, textureImage);
                }
                this._parseMap[prefix] = true;
            }
            return this.factory;
        };
        return MovieEgretFactory;
    }());
    meru.MovieEgretFactory = MovieEgretFactory;
    __reflect(MovieEgretFactory.prototype, "meru.MovieEgretFactory");
    var MoviePlay = (function () {
        function MoviePlay(name, playTimes) {
            this._name = name;
            this._playTimes = playTimes;
        }
        Object.defineProperty(MoviePlay.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        MoviePlay.prototype.play = function (animation) {
            animation.play(this._name, this._playTimes);
        };
        return MoviePlay;
    }());
    __reflect(MoviePlay.prototype, "MoviePlay", ["IMoviePlay"]);
    var DragonMovie = (function (_super) {
        __extends(DragonMovie, _super);
        function DragonMovie(prefix, armature) {
            if (prefix === void 0) { prefix = null; }
            if (armature === void 0) { armature = prefix; }
            var _this = _super.call(this) || this;
            _this._armatureName = null;
            _this._atLast = false;
            _this._frameRate = null;
            _this._intialized = false;
            _this._prefix = null;
            _this._replaceDisplayArr = [];
            _this._filename = armature + "_dragonGroup";
            if (prefix) {
                _this.init(prefix, armature);
            }
            return _this;
        }
        DragonMovie.prototype.gotoAndStop = function (name, frame) { };
        DragonMovie.prototype.gotoAndPlay = function (name, frame, playTimes) { };
        DragonMovie.prototype.dispose = function () { };
        Object.defineProperty(DragonMovie.prototype, "atLast", {
            get: function () {
                return this._atLast;
            },
            set: function (val) {
                this._atLast = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragonMovie.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            set: function (val) {
                this._frameRate = val;
                if (this._armature) {
                    this._armature.clock.timeScale = this._frameRate / 24;
                }
            },
            enumerable: true,
            configurable: true
        });
        DragonMovie.prototype.onAddToStage = function () {
            if (this._armature) {
                dragonBones.WorldClock.clock.add(this._armature);
                if (this._armature.animation) {
                    this._armature.animation.play();
                }
                this._armature.addEventListener(dragonBones.EgretEvent.ANIMATION_FRAME_EVENT, this.onFrame, this);
                this._armature.addEventListener(dragonBones.EgretEvent.COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EgretEvent.LOOP_COMPLETE, this.onComplete, this);
            }
        };
        DragonMovie.prototype.onRemoveFromStage = function () {
            dragonBones.WorldClock.clock.remove(this._armature);
            if (this._armature) {
                this._armature.animation.stop();
                this._armature.removeEventListener(dragonBones.EgretEvent.ANIMATION_FRAME_EVENT, this.onFrame, this);
                this._armature.removeEventListener(dragonBones.EgretEvent.COMPLETE, this.onComplete, this);
                this._armature.removeEventListener(dragonBones.EgretEvent.LOOP_COMPLETE, this.onComplete, this);
            }
        };
        DragonMovie.prototype.init = function (prefix, armature) {
            if (armature === void 0) { armature = prefix; }
            this.prefix = prefix;
            this.armature = armature;
            if (!this._intialized) {
                this._intialized = true;
                if (this.stage) {
                    this.onAddToStage();
                }
                if (!this.hasEventListener(egret.Event.ADDED_TO_STAGE)) {
                    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                }
                if (!this.hasEventListener(egret.Event.REMOVED_FROM_STAGE)) {
                    this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
                }
            }
        };
        Object.defineProperty(DragonMovie.prototype, "prefix", {
            get: function () {
                return this._prefix;
            },
            set: function (val) {
                this._prefix = val;
                if (val) {
                    this.initialize(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragonMovie.prototype, "armature", {
            get: function () {
                return this._armatureName;
            },
            set: function (val) {
                this._armatureName = val;
            },
            enumerable: true,
            configurable: true
        });
        DragonMovie.prototype.initialize = function (prefix) {
            this._animationFile = prefix + "_anim.json";
            this._textureFile = prefix + "_texture.json";
            this._textureImage = prefix + "_texture.png";
        };
        DragonMovie.prototype.prepareResource = function () {
            var aniData = RES.getRes(this._animationFile);
            var texFile = RES.getRes(this._textureFile);
            var texImg = RES.getRes(this._textureImage);
            if (aniData && texFile && texImg) {
                return new Promise(function (ok, err) {
                    ok();
                });
            }
            else {
                RES.createGroup(this._filename, [this._animationFile, this._textureFile, this._textureImage]);
                return RES.loadGroup(this._filename);
            }
        };
        DragonMovie.prototype.playCore = function (play) {
            var _this = this;
            this._moviePlay = play;
            this.prepareResource().then(function () {
                _this._play();
            });
        };
        DragonMovie.prototype.play = function (name, playTimes) {
            if (this._prefix && this._armatureName) {
                this.playCore(new MoviePlay(name, playTimes));
            }
        };
        Object.defineProperty(DragonMovie.prototype, "animationName", {
            get: function () {
                return this._armature.animation.lastAnimationState.name;
            },
            enumerable: true,
            configurable: true
        });
        DragonMovie.getFrameEventCount = function (label, armature, play) {
            var key = armature.name + '_' + play.name;
            if (!this._frameEventMap.hasOwnProperty(key)) {
                var animation = armature.animation.animations[play.name];
                if (!animation) {
                    return 0;
                }
                var frames = animation.frames;
                if (!frames || frames.length == 0) {
                    return 0;
                }
                var events = [];
                for (var i = 0; i < frames.length; i++) {
                    var data = frames[i];
                    if (data.events.length > 0) {
                        for (var j = 0; j < data.events.length; j++) {
                            if (events.indexOf(data.events[j].name) == -1 &&
                                data.events[j].name.indexOf(label) > -1) {
                                events.push(data.events[j].name);
                            }
                        }
                    }
                }
                this._frameEventMap[key] = events.length;
            }
            return this._frameEventMap[key];
        };
        DragonMovie.prototype.getFrameEventCount = function (label) {
            return DragonMovie.getFrameEventCount(label, this._armature, this._moviePlay);
        };
        DragonMovie.prototype._play = function () {
            if (this._armature) {
                this._moviePlay.play(this._armature.animation);
                return;
            }
            var factory = meru.singleton(MovieEgretFactory).getFactory(this._prefix);
            dragonBones.WorldClock.clock.remove(this._armature);
            this._armature = factory.buildArmature(this._armatureName);
            this._armature.display.x = 0;
            this._armature.display.y = 0;
            this._moviePlay.play(this._armature.animation);
            this._armature.addEventListener(dragonBones.EgretEvent.FRAME_EVENT, this.onFrame, this);
            this._armature.addEventListener(dragonBones.EgretEvent.COMPLETE, this.onComplete, this);
            this._armature.addEventListener(dragonBones.EgretEvent.LOOP_COMPLETE, this.onComplete, this);
            this.addChild(this._armature.display);
            while (this._replaceDisplayArr.length > 0) {
                var info = this._replaceDisplayArr.shift();
                this.replaceDisplay(info.name, info.display);
            }
            dragonBones.WorldClock.clock.add(this._armature);
            if (this._frameRate) {
                this.frameRate = this._frameRate;
            }
        };
        DragonMovie.prototype.onFrame = function (e) {
            var ev = new meru.MovieEvent(meru.MovieEvent.FRAME_LABEL, e.frameLabel);
            this.dispatchEvent(ev);
        };
        DragonMovie.prototype.onComplete = function (e) {
            this.dispatchEvent(new meru.MovieEvent(meru.MovieEvent.COMPLETE));
        };
        DragonMovie.prototype.replaceDisplay = function (slotName, display) {
            if (this._armature) {
                var slot = this._armature.getSlot(slotName);
                slot.displayIndex = 0;
                slot.display = display;
            }
            else {
                this._replaceDisplayArr.push({
                    name: slotName, display: display
                });
            }
        };
        DragonMovie._frameEventMap = {};
        return DragonMovie;
    }(egret.DisplayObjectContainer));
    meru.DragonMovie = DragonMovie;
    __reflect(DragonMovie.prototype, "meru.DragonMovie", ["meru.IMovie", "egret.DisplayObject"]);
})(meru || (meru = {}));
var meru;
(function (meru) {
    var MovieEvent = (function (_super) {
        __extends(MovieEvent, _super);
        function MovieEvent(name, label) {
            if (label === void 0) { label = null; }
            var _this = _super.call(this, name) || this;
            _this._frameLabel = label;
            return _this;
        }
        Object.defineProperty(MovieEvent.prototype, "frameLabel", {
            get: function () {
                return this._frameLabel;
            },
            enumerable: true,
            configurable: true
        });
        MovieEvent.FRAME_LABEL = "Frame_Label";
        MovieEvent.LOOP_COMPLETE = "Loop_Complete";
        MovieEvent.COMPLETE = "Complete";
        return MovieEvent;
    }(egret.Event));
    meru.MovieEvent = MovieEvent;
    __reflect(MovieEvent.prototype, "meru.MovieEvent");
    function getFilenameWithoutExt(path) {
        var arr = path.split('/');
        var filename = arr[arr.length - 1];
        arr = filename.split('.');
        return arr[0];
    }
    var DBFaseMovie = (function (_super) {
        __extends(DBFaseMovie, _super);
        function DBFaseMovie(path) {
            var _this = _super.call(this) || this;
            _this._atLast = false;
            _this._frameRate = null;
            _this._dataPath = path;
            _this._texturePath = path.replace('_ske.dbmv', '_tex.png');
            _this._filename = getFilenameWithoutExt(_this._dataPath).replace('_ske', '');
            return _this;
        }
        Object.defineProperty(DBFaseMovie.prototype, "atLast", {
            get: function () {
                return this._atLast;
            },
            set: function (val) {
                this._atLast = val;
            },
            enumerable: true,
            configurable: true
        });
        DBFaseMovie.prototype.prepareResource = function () {
            var ske = RES.getRes(this._dataPath);
            var tex = RES.getRes(this._texturePath);
            if (ske && tex) {
                return new Promise(function (ok, err) {
                    ok();
                });
            }
            else {
                RES.createGroup(this._filename, [this._dataPath]);
                return RES.loadGroup(this._filename);
            }
        };
        DBFaseMovie.prototype.play = function (name, playTimes) {
            var _this = this;
            if (playTimes === void 0) { playTimes = 0; }
            playTimes = playTimes == 0 ? -1 : playTimes == -1 ? 0 : playTimes;
            this.prepareResource().then(function () {
                _this.getMC().play(name, playTimes);
            });
        };
        DBFaseMovie.prototype.gotoAndStop = function (name, frame) {
            var _this = this;
            this.prepareResource().then(function () {
                _this.getMC().gotoAndStop(name, frame / 24);
            });
        };
        DBFaseMovie.prototype.gotoAndPlay = function (name, frame, playTimes) {
            var _this = this;
            if (playTimes === void 0) { playTimes = 0; }
            playTimes = playTimes == 0 ? -1 : playTimes == -1 ? 0 : playTimes;
            this.prepareResource().then(function () {
                _this.getMC().gotoAndPlay(name, frame / 24, playTimes);
            });
        };
        DBFaseMovie.prototype.clearEvents = function () {
            if (this._mc) {
                this._mc.removeEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.removeEventListener(dragonBones.MovieEvent.COMPLETE, this.onComplete, this);
                this._mc.removeEventListener(dragonBones.MovieEvent.FRAME_EVENT, this.onFrameLabel, this);
            }
        };
        DBFaseMovie.prototype.initEvents = function () {
            if (this._mc) {
                this._mc.addEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.addEventListener(dragonBones.MovieEvent.COMPLETE, this.onComplete, this);
                this._mc.addEventListener(dragonBones.MovieEvent.FRAME_EVENT, this.onFrameLabel, this);
            }
        };
        DBFaseMovie.prototype.getMC = function () {
            this.dispose();
            this._mc = dragonBones.buildMovie(this._filename);
            this.initEvents();
            if (this._mc && this._frameRate != null) {
                this._mc.clipTimeScale = this._frameRate / 24;
            }
            this.addChild(this._mc);
            return this._mc;
        };
        DBFaseMovie.prototype.onLoopComplete = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.LOOP_COMPLETE));
        };
        DBFaseMovie.prototype.onComplete = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.COMPLETE));
            if (!this.atLast) {
                meru.display.removeFromParent(this);
            }
        };
        Object.defineProperty(DBFaseMovie.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            set: function (val) {
                this._frameRate = val;
                if (this._mc) {
                    this._mc.clipTimeScale = this._frameRate / 24;
                }
            },
            enumerable: true,
            configurable: true
        });
        DBFaseMovie.prototype.onFrameLabel = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.FRAME_LABEL, e.name));
        };
        DBFaseMovie.prototype.dispose = function () {
            if (this._mc) {
                this._mc.dispose();
                this.clearEvents();
                meru.display.removeFromParent(this._mc);
            }
        };
        return DBFaseMovie;
    }(egret.DisplayObjectContainer));
    __reflect(DBFaseMovie.prototype, "DBFaseMovie", ["meru.IMovie", "egret.DisplayObject"]);
    var SequnceMovie = (function (_super) {
        __extends(SequnceMovie, _super);
        function SequnceMovie(template) {
            var _this = _super.call(this) || this;
            _this._curIndex = 0;
            _this._atLast = false;
            _this._frameRate = 0;
            _this._frameIntervalTime = 0;
            _this._passedTime = 0;
            _this._events = [];
            _this._template = template;
            _this.$renderNode = new egret.sys.BitmapNode();
            _this.frameRate = 24;
            return _this;
        }
        SequnceMovie.prototype.gotoAndStop = function (name, frame) {
            throw new Error("未实现");
        };
        SequnceMovie.prototype.gotoAndPlay = function (name, frame, playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            throw new Error("未实现");
        };
        Object.defineProperty(SequnceMovie.prototype, "atLast", {
            get: function () {
                return this._atLast;
            },
            set: function (val) {
                this._atLast = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SequnceMovie.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            set: function (val) {
                this._frameRate = val;
                this._frameIntervalTime = 1000 / val;
            },
            enumerable: true,
            configurable: true
        });
        SequnceMovie.prototype.play = function (name, playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            if (playTimes == 0) {
                playTimes = 1;
            }
            this._playTimes = playTimes;
            var arr = name.split(':');
            this._start = parseInt(arr[0]);
            this._end = parseInt(arr[1]);
            this._curIndex = this._start;
            egret.stopTick(this.tick, this);
            this._lastTime = egret.getTimer();
            egret.startTick(this.tick, this);
        };
        SequnceMovie.prototype.tick = function (timeStamp) {
            var advancedTime = timeStamp - this._lastTime;
            this._lastTime = timeStamp;
            var frameIntervalTime = this._frameIntervalTime;
            var currentTime = this._passedTime + advancedTime;
            this._passedTime = currentTime % frameIntervalTime;
            var num = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            while (num >= 1) {
                num--;
                this._curIndex++;
                if (this._curIndex > this._end) {
                    if (this._playTimes == -1) {
                        this._events.push(egret.Event.LOOP_COMPLETE);
                        this._curIndex = this._start;
                    }
                    else {
                        this._playTimes--;
                        if (this._playTimes > 0) {
                            this._events.push(egret.Event.LOOP_COMPLETE);
                            this._curIndex = this._start;
                        }
                        else {
                            this._curIndex = this._end;
                            this._events.push(egret.Event.COMPLETE);
                            this.stop();
                            break;
                        }
                    }
                }
            }
            this.constructFrame();
            this.handlePendingEvent();
            return false;
        };
        SequnceMovie.prototype.$render = function () {
            var texture = this._bitmapData;
            if (texture) {
                var offsetX = Math.round(0);
                var offsetY = Math.round(0);
                var bitmapWidth = texture._bitmapWidth;
                var bitmapHeight = texture._bitmapHeight;
                var textureWidth = texture.$getTextureWidth();
                var textureHeight = texture.$getTextureHeight();
                var destW = Math.round(texture.$getScaleBitmapWidth());
                var destH = Math.round(texture.$getScaleBitmapHeight());
                var sourceWidth = texture._sourceWidth;
                var sourceHeight = texture._sourceHeight;
                egret.sys.BitmapNode.$updateTextureData(this.$renderNode, texture._bitmapData, texture._bitmapX, texture._bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, null, egret.BitmapFillMode.SCALE, true);
            }
        };
        /**
         * @private
         */
        SequnceMovie.prototype.$measureContentBounds = function (bounds) {
            var texture = this._bitmapData;
            if (texture) {
                var x = 0;
                var y = 0;
                var w = texture.$getTextureWidth();
                var h = texture.$getTextureHeight();
                bounds.setTo(x, y, w, h);
            }
            else {
                bounds.setEmpty();
            }
        };
        SequnceMovie.prototype.handlePendingEvent = function () {
            if (this._events.length != 0) {
                this._events.reverse();
                var eventPool = this._events;
                var length_1 = eventPool.length;
                var isComplete = false;
                var isLoopComplete = false;
                for (var i = 0; i < length_1; i++) {
                    var event_1 = eventPool.pop();
                    if (event_1 == egret.Event.LOOP_COMPLETE) {
                        isLoopComplete = true;
                    }
                    else if (event_1 == egret.Event.COMPLETE) {
                        isComplete = true;
                    }
                    else {
                        this.dispatchEventWith(event_1);
                    }
                }
                if (isLoopComplete) {
                    this.dispatchEventWith(egret.Event.LOOP_COMPLETE);
                }
                if (isComplete) {
                    this.dispatchEventWith(egret.Event.COMPLETE);
                    if (!this.atLast) {
                        this.stop();
                        meru.display.removeFromParent(this);
                    }
                }
            }
        };
        SequnceMovie.prototype.stop = function () {
            egret.stopTick(this.tick, this);
        };
        SequnceMovie.prototype.getTextureName = function (idx) {
            return this._template.replace(MovieFactory._dnumRegex, function (all, _, pad, num) {
                if (!is.undefined(pad) && !is.undefined(num)) {
                    var s = '';
                    var count = parseInt(num);
                    var ns = '' + idx;
                    if (ns.length >= count) {
                        return ns;
                    }
                    return new Array((count - ns.length) + 1).join(pad) + ns;
                }
                return idx + '';
            });
        };
        SequnceMovie.prototype.constructFrame = function () {
            this._bitmapData = RES.getRes(this.getTextureName(this._curIndex));
            this.$invalidateContentBounds();
        };
        SequnceMovie.prototype.dispose = function () {
            egret.stopTick(this.tick, this);
        };
        return SequnceMovie;
    }(egret.DisplayObjectContainer));
    __reflect(SequnceMovie.prototype, "SequnceMovie", ["meru.IMovie", "egret.DisplayObject"]);
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(path) {
            var _this = _super.call(this) || this;
            _this._atLast = false;
            _this._frameRate = null;
            _this._dataPath = path;
            _this._texturePath = path.replace('.json', '.png');
            _this._filename = getFilenameWithoutExt(_this._dataPath);
            return _this;
        }
        Object.defineProperty(MovieClip.prototype, "atLast", {
            get: function () {
                return this._atLast;
            },
            set: function (val) {
                this._atLast = val;
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.prepareResource = function () {
            var factory = RES.getRes(this._dataPath);
            if (factory) {
                return new Promise(function (ok) {
                    ok();
                });
            }
            else {
                RES.createGroup(this._filename, [this._dataPath]);
                return RES.loadGroup(this._filename);
            }
        };
        MovieClip.prototype.play = function (name, playTimes) {
            var _this = this;
            if (playTimes === void 0) { playTimes = 0; }
            this.prepareResource().then(function () {
                _this.getMC(name).play(playTimes);
            });
        };
        MovieClip.prototype.gotoAndStop = function (name, frame) {
            var _this = this;
            this.prepareResource().then(function () {
                _this.getMC(name).gotoAndStop(frame);
            });
        };
        MovieClip.prototype.gotoAndPlay = function (name, frame, playTimes) {
            var _this = this;
            if (playTimes === void 0) { playTimes = 0; }
            this.prepareResource().then(function () {
                _this.getMC(name).gotoAndPlay(frame, playTimes);
            });
        };
        Object.defineProperty(MovieClip.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            set: function (val) {
                this._frameRate = val;
                if (this._mc) {
                    this._mc.frameRate = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        MovieClip.prototype.clearEvents = function () {
            if (this._mc) {
                this._mc.removeEventListener(egret.MovieClipEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.removeEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete, this);
                this._mc.removeEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onFrameLabel, this);
            }
        };
        MovieClip.prototype.initEvents = function () {
            if (this._mc) {
                this._mc.addEventListener(egret.MovieClipEvent.LOOP_COMPLETE, this.onLoopComplete, this);
                this._mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete, this);
                this._mc.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onFrameLabel, this);
            }
        };
        MovieClip.prototype.getMC = function (name) {
            var factory = RES.getRes(this._dataPath);
            if (factory) {
                if (this._mc) {
                    this.clearEvents();
                    meru.display.removeFromParent(this._mc);
                }
                this._mc = new egret.MovieClip(factory.generateMovieClipData(name));
                if (this._frameRate != null) {
                    this._mc.frameRate = this._frameRate;
                }
                this.initEvents();
                this.addChild(this._mc);
                return this._mc;
            }
            return null;
        };
        MovieClip.prototype.onLoopComplete = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.LOOP_COMPLETE));
        };
        MovieClip.prototype.onComplete = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.COMPLETE));
            if (!this.atLast) {
                meru.display.removeFromParent(this);
            }
        };
        MovieClip.prototype.onFrameLabel = function (e) {
            this.dispatchEvent(new MovieEvent(MovieEvent.FRAME_LABEL, e.frameLabel));
        };
        MovieClip.prototype.dispose = function () {
            this.clearEvents();
        };
        return MovieClip;
    }(egret.DisplayObjectContainer));
    __reflect(MovieClip.prototype, "MovieClip", ["meru.IMovie", "egret.DisplayObject"]);
    var MovieFactory = (function () {
        function MovieFactory() {
        }
        /**
         * 龙骨动画必须放在animation/dragon文件夹下
         * @param path
         * @param armature
         * @returns {any}
         */
        MovieFactory.create = function (path, armature) {
            var arr = path.split('/');
            var filename = arr[arr.length - 1];
            if (arr.indexOf("dragon") > -1) {
                //龙骨动画
                if (armature == null)
                    armature = filename;
                return new meru.DragonMovie(path, armature);
            }
            else if (filename.indexOf('.dbmv') > -1) {
                return new DBFaseMovie(path);
            }
            else if (filename.indexOf('_') == -1) {
                return new MovieClip(path);
            }
            else {
                MovieFactory._dnumRegex.lastIndex = 0;
                if (MovieFactory._dnumRegex.test(path)) {
                    return new SequnceMovie(path);
                }
            }
        };
        MovieFactory._dnumRegex = /\{((.+)(\d+))?d\}/gi;
        return MovieFactory;
    }());
    meru.MovieFactory = MovieFactory;
    __reflect(MovieFactory.prototype, "meru.MovieFactory");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/7/9.
 */
var meru;
(function (meru) {
    var OpenBoxAnimation = (function (_super) {
        __extends(OpenBoxAnimation, _super);
        function OpenBoxAnimation(targetDisplay) {
            var _this = _super.call(this) || this;
            _this._targetDispaly = targetDisplay;
            return _this;
        }
        OpenBoxAnimation.prototype.getShowBoxAnmation = function (box) {
            var x = 0;
            var y = 0;
            var container = this.component;
            var pt = this._targetDispaly.localToGlobal(0, 0);
            pt = container.globalToLocal(pt.x, pt.y, pt);
            pt.x -= container.width / 2;
            pt.y -= container.height / 2;
            box.verticalCenter = pt.y;
            box.horizontalCenter = pt.x;
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            return meru.Animation.to(150, { alpha: 1, verticalCenter: y, horizontalCenter: x, scaleX: 1, scaleY: 1 }).run(box);
        };
        OpenBoxAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha;
            mask.alpha = 0;
            return meru.Animation.to(150, { alpha: alpha }).run(mask);
        };
        OpenBoxAnimation.prototype.getCloseBoxAnimation = function (box) {
            var container = this.component;
            var pt = this._targetDispaly.localToGlobal(0, 0);
            pt = container.globalToLocal(pt.x, pt.y, pt);
            pt.x -= container.width / 2;
            pt.y -= container.height / 2;
            return meru.Animation.setTarget(box).to(150, { alpha: 0, verticalCenter: pt.y, horizontalCenter: pt.x, scaleX: 0, scaleY: 0 });
        };
        OpenBoxAnimation.prototype.getCloseMaskAnimation = function (mask) {
            return meru.Animation.setTarget(mask).to(150, { alpha: 0 });
        };
        return OpenBoxAnimation;
    }(meru.BaseBoxAnimation));
    meru.OpenBoxAnimation = OpenBoxAnimation;
    __reflect(OpenBoxAnimation.prototype, "meru.OpenBoxAnimation");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/24.
 */
var meru;
(function (meru) {
    var ProgressBar = (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ProgressBar.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
            },
            enumerable: true,
            configurable: true
        });
        return ProgressBar;
    }(eui.ProgressBar));
    meru.ProgressBar = ProgressBar;
    __reflect(ProgressBar.prototype, "meru.ProgressBar");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/9/20.
 */
var meru;
(function (meru) {
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.customState = null;
            return _this;
        }
        Object.defineProperty(RadioButton.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "notice", {
            get: function () {
                return this._notice;
            },
            set: function (value) {
                this._notice = value;
            },
            enumerable: true,
            configurable: true
        });
        RadioButton.prototype.getCurrentState = function () {
            var state = this.customState;
            if (!state) {
                state = this.skin.currentState;
            }
            if (this.selected) {
                if (this.skin.hasState(state + 'AndSelected')) {
                    return state + 'AndSelected';
                }
            }
            else {
                if (state.indexOf('AndSelected') > -1) {
                    return state.replace('AndSelected', '');
                }
            }
            return state;
        };
        RadioButton.prototype.buttonReleased = function () {
            if (is.truthy(this._notice)) {
                var data = this.data;
                if (!data) {
                    var host = meru.display.getHostComponent(this);
                    if (host) {
                        data = host.data;
                    }
                }
                var old = this.selected;
                var state = meru.pullObject(meru.str.formatNotice(this._notice), data, host, this);
                if ((typeof (state) == 'boolean' && state == true) ||
                    state == data) {
                    if (old == this.selected) {
                        this.selected = !this.selected;
                    }
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            else {
                _super.prototype.buttonReleased.call(this);
            }
        };
        return RadioButton;
    }(eui.RadioButton));
    meru.RadioButton = RadioButton;
    __reflect(RadioButton.prototype, "meru.RadioButton");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/7/8.
 */
var meru;
(function (meru) {
    var ResourceLoad = (function () {
        function ResourceLoad(resource) {
            this._resourceGroup = resource;
        }
        Object.defineProperty(ResourceLoad.prototype, "loadUpdate", {
            get: function () {
                return this._loadUpdate;
            },
            set: function (val) {
                this._loadUpdate = val;
            },
            enumerable: true,
            configurable: true
        });
        ResourceLoad.prototype.load = function () {
            var res = this._resourceGroup.getRes();
            var groupName = this._resourceGroup.name;
            if (res.length > 0) {
                RES.createGroup(groupName, res, true);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoaded, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
                RES.loadGroup(groupName);
            }
            else {
                if (this._loadUpdate) {
                    this._loadUpdate.update(0, 0);
                    this._loadUpdate.onComplete();
                }
            }
        };
        ResourceLoad.prototype.onLoaded = function (e) {
            if (e.groupName == this._resourceGroup.name) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoaded, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
                if (this._loadUpdate) {
                    this._loadUpdate.onComplete();
                }
            }
        };
        ResourceLoad.prototype.onProgress = function (e) {
            if (this._loadUpdate) {
                this._loadUpdate.update(e.itemsLoaded, e.itemsTotal);
            }
        };
        return ResourceLoad;
    }());
    meru.ResourceLoad = ResourceLoad;
    __reflect(ResourceLoad.prototype, "meru.ResourceLoad", ["meru.ILoad"]);
})(meru || (meru = {}));
/**
 * Created by bruce on 16/12/3.
 */
var meru;
(function (meru) {
    var TabBar = (function (_super) {
        __extends(TabBar, _super);
        function TabBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TabBar.prototype.onRendererTouchEnd = function (event) {
            if (this._sel) {
                var itemRenderer = event.currentTarget;
                var r = this._sel.call(this._context, itemRenderer.itemIndex, itemRenderer);
                if (r == true || is.undefined(r)) {
                    _super.prototype.onRendererTouchEnd.call(this, event);
                }
            }
            else {
                _super.prototype.onRendererTouchEnd.call(this, event);
            }
        };
        TabBar.prototype.onVerifyCallback = function (sel, context) {
            this._sel = sel;
            this._context = context;
        };
        return TabBar;
    }(eui.TabBar));
    meru.TabBar = TabBar;
    __reflect(TabBar.prototype, "meru.TabBar");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var WanderInfo = (function () {
        function WanderInfo(theta, radius, distance, rate) {
            if (theta === void 0) { theta = 3; }
            if (radius === void 0) { radius = 30; }
            if (distance === void 0) { distance = 40; }
            if (rate === void 0) { rate = 20; }
            this.theta = theta;
            this.radius = radius;
            this.distnace = distance;
            this.rate = rate;
        }
        return WanderInfo;
    }());
    meru.WanderInfo = WanderInfo;
    __reflect(WanderInfo.prototype, "meru.WanderInfo");
    var AlignmentInfo = (function () {
        function AlignmentInfo(radius, weight) {
            if (radius === void 0) { radius = 50; }
            if (weight === void 0) { weight = 0.4; }
            this.radius = radius;
            this.weight = weight;
        }
        return AlignmentInfo;
    }());
    meru.AlignmentInfo = AlignmentInfo;
    __reflect(AlignmentInfo.prototype, "meru.AlignmentInfo");
    var SeparationInfo = (function () {
        function SeparationInfo(radius, weight) {
            if (radius === void 0) { radius = 10; }
            if (weight === void 0) { weight = 1; }
            this.radius = radius;
            this.weight = weight;
        }
        return SeparationInfo;
    }());
    meru.SeparationInfo = SeparationInfo;
    __reflect(SeparationInfo.prototype, "meru.SeparationInfo");
    var CohesionInfo = (function () {
        function CohesionInfo(radius, weight) {
            if (radius === void 0) { radius = 100; }
            if (weight === void 0) { weight = 0.2; }
            this.radius = radius;
            this.weight = weight;
        }
        return CohesionInfo;
    }());
    meru.CohesionInfo = CohesionInfo;
    __reflect(CohesionInfo.prototype, "meru.CohesionInfo");
    var Vehicle = (function () {
        function Vehicle(x, y) {
            this._acceleration = new meru.Vec2d();
            this._velocity = new meru.Vec2d();
            this._location = new meru.Vec2d(x, y);
            this._radius = 2;
            this._maxForce = 5;
            this._maxSpeed = 5;
        }
        Vehicle.prototype.update = function () {
            this._velocity.add(this._acceleration);
            this._velocity.limit(this._maxSpeed);
            this._location.add(this._velocity);
            this._acceleration.mul(0);
        };
        Vehicle.prototype.applyForce = function (force) {
            this._acceleration.add(force);
        };
        Vehicle.prototype.wander = function () {
            var wanderRadius = this.wanderInfo.radius;
            var wanderDistance = this.wanderInfo.distnace;
            var change = this.wanderInfo.rate;
            this.wanderInfo.theta += meru.num.randInt(-change, change);
            var circleLocation = this._velocity.clone();
            circleLocation.normalize();
            circleLocation.mul(wanderDistance);
            circleLocation.add(this._location);
            var circleOffset = new meru.Vec2d(wanderRadius * Math.cos(this.wanderInfo.theta), wanderRadius * Math.sin(this.wanderInfo.theta));
            var target = meru.Vec2d.add(circleLocation, circleOffset);
            this.applyForce(this.steer(target, false));
        };
        Vehicle.prototype.steer = function (target, slowdown) {
            var steer;
            var desired = meru.Vec2d.sub(target, this._location);
            var len = desired.length;
            if (len > 0) {
                desired.normalize();
                var limit = this._maxSpeed * 3;
                if (slowdown && len < limit) {
                    desired.mul(len / limit * this._maxSpeed);
                }
                else {
                    desired.mul(this._maxSpeed);
                }
                steer = meru.Vec2d.sub(desired, this._velocity);
                steer.limit(this._maxForce);
            }
            else {
                steer = new meru.Vec2d(0, 0);
            }
            return steer;
        };
        Vehicle.prototype.seek = function (target) {
            this.applyForce(this.steer(target, false));
        };
        Vehicle.prototype.arrive = function (target) {
            this.applyForce(this.steer(target, true));
        };
        Vehicle.prototype.flee = function (target) {
            var v = this.steer(target, false);
            v.mul(-1);
            this.applyForce(v);
        };
        Vehicle.prototype.pursue = function (vehicle) {
            var T = meru.Vec2d.sub(vehicle.location, this.location).length;
            T /= vehicle.maxSpeed;
            var futurePos = meru.Vec2d.add(vehicle.location, meru.Vec2d.mul(vehicle.velocity, T));
            return this.seek(futurePos);
        };
        Vehicle.prototype.evade = function (vehicle) {
            var T = meru.Vec2d.sub(vehicle.location, this.location).length;
            T /= vehicle.maxSpeed;
            var futurePos = meru.Vec2d.add(vehicle.location, meru.Vec2d.mul(vehicle.velocity, T));
            this.flee(futurePos);
        };
        Vehicle.prototype.cohere = function (vehicleArr) {
            var vel = new meru.Vec2d();
            var neighborCount = 0;
            for (var i = 0; i < vehicleArr.length; i++) {
                var vehicle = vehicleArr[i];
                if (vehicle == this) {
                    continue;
                }
                if (this.location.distance(vehicle.location) >= this.cohesionInfo.radius) {
                    continue;
                }
                vel.add(vehicle.location);
                neighborCount++;
            }
            if (neighborCount == 0) {
                return vel;
            }
            vel.mul(1 / neighborCount);
            vel = meru.Vec2d.sub(vel, this.location);
            vel.normalize();
            vel.mul(this.cohesionInfo.weight);
            this.applyForce(vel);
            return vel;
        };
        Vehicle.prototype.align = function (vehicleArr) {
            var vel = new meru.Vec2d();
            var neighborCount = 0;
            for (var i = 0; i < vehicleArr.length; i++) {
                var vehicle = vehicleArr[i];
                if (vehicle == this) {
                    continue;
                }
                if (this.location.distance(vehicle.location) >= this.alignInfo.radius) {
                    continue;
                }
                vel.add(vehicle.velocity);
                neighborCount++;
            }
            if (neighborCount == 0) {
                return vel;
            }
            vel.mul(1 / neighborCount);
            vel.normalize();
            vel.mul(this.alignInfo.weight);
            this.applyForce(vel);
            return vel;
        };
        Vehicle.prototype.separate = function (vehicleArr) {
            var vel = new meru.Vec2d();
            var neighborCount = 0;
            for (var i = 0; i < vehicleArr.length; i++) {
                var vehicle = vehicleArr[i];
                if (vehicle == this) {
                    continue;
                }
                if (this.location.distance(vehicle.location) >= this.separationInfo.radius) {
                    continue;
                }
                vel.add(meru.Vec2d.sub(vehicle.location, this.location));
                neighborCount++;
            }
            if (neighborCount == 0) {
                return;
            }
            vel.mul(-1 / neighborCount);
            vel.normalize();
            vel.mul(this.separationInfo.weight);
            this.applyForce(vel);
        };
        Vehicle.prototype.flock = function (vehicleArr) {
            this.cohere(vehicleArr);
            this.align(vehicleArr);
            this.separate(vehicleArr);
        };
        Vehicle.prototype.followPath = function (path) {
            var target = path.current;
            if (target === undefined) {
                return false;
            }
            if (this._location.distance(target) > this._radius + path.pathWidth) {
                this.seek(target);
                return true;
            }
            else {
                target = path.next();
                if (target === undefined) {
                    return false;
                }
                this.seek(target);
                return true;
            }
        };
        Vehicle.prototype.follow = function (path) {
            if (!this.followPath(path)) {
                this.wander();
            }
        };
        Vehicle.prototype.isEqual = function (vehicle) {
            if (vehicle instanceof Vehicle) {
                return this == vehicle;
            }
            return vehicle.isEqual(this);
        };
        Object.defineProperty(Vehicle.prototype, "location", {
            get: function () {
                return this._location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "velocity", {
            get: function () {
                return this._velocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "maxForce", {
            get: function () {
                return this._maxForce;
            },
            set: function (value) {
                this._maxForce = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "maxSpeed", {
            get: function () {
                return this._maxSpeed;
            },
            set: function (value) {
                this._maxSpeed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "wanderInfo", {
            get: function () {
                if (this._wanderInfo == null) {
                    this._wanderInfo = new WanderInfo();
                }
                return this._wanderInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "cohesionInfo", {
            get: function () {
                if (this._cohesionInfo == null) {
                    this._cohesionInfo = new CohesionInfo();
                }
                return this._cohesionInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "alignInfo", {
            get: function () {
                if (this._alignInfo == null) {
                    this._alignInfo = new AlignmentInfo();
                }
                return this._alignInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vehicle.prototype, "separationInfo", {
            get: function () {
                if (this._separationInfo == null) {
                    this._separationInfo = new SeparationInfo();
                }
                return this._separationInfo;
            },
            enumerable: true,
            configurable: true
        });
        return Vehicle;
    }());
    meru.Vehicle = Vehicle;
    __reflect(Vehicle.prototype, "meru.Vehicle", ["meru.IVehicle"]);
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/23.
 */
var meru;
(function (meru) {
    var _proxyLoadingMap = {};
    function getProgressLoading(skinName) {
        if (!_proxyLoadingMap.hasOwnProperty(skinName)) {
            var loading = meru.getDefinitionInstance(meru.getSetting().ProgressLoadingClass, null, skinName);
            if (true && !loading) {
                console.error("请配置ProgressLoadingClass");
            }
            if (loading) {
                meru.UI.addTooltip(loading);
                _proxyLoadingMap[skinName] = loading;
            }
        }
        return _proxyLoadingMap[skinName];
    }
    function getLoadScene() {
        var loading = meru.getDefinitionInstance(meru.getSetting().LoadSceneClass, null);
        if (loading) {
            meru.UI.runScene(loading);
        }
        return loading;
    }
    var _loading;
    function getSimpleLoading() {
        if (!_loading) {
            _loading = meru.getDefinitionInstance(meru.getSetting().SimpleLoadingClass, null);
            if (true && !_loading) {
                console.error("请配置SimpleLoadingClass");
            }
            if (_loading) {
                meru.UI.addTooltip(_loading);
            }
        }
        return _loading;
    }
    /**
     * 显示简单载入条
     */
    function showSimpleLoading() {
        var loading = getSimpleLoading();
        if (loading) {
            loading.show();
        }
    }
    meru.showSimpleLoading = showSimpleLoading;
    /**
     * 隐藏简单载入条
     */
    function hideSimpleLoading() {
        var loading = getSimpleLoading();
        if (loading) {
            loading.hide();
        }
    }
    meru.hideSimpleLoading = hideSimpleLoading;
    function getResLoad(prepare) {
        var ret;
        if (egret.is(prepare, "meru.ILoad")) {
            ret = prepare;
        }
        else if (egret.is(prepare, "meru.IResourceGroup")) {
            ret = new meru.ResourceLoad(prepare);
        }
        return ret;
    }
    meru.getResLoad = getResLoad;
    /**
     * 显示加载条
     * @param skinName 加载条的皮肤名
     * @param load 加载器
     */
    function showProgressLoading(prepare, skinName) {
        if (skinName === void 0) { skinName = ""; }
        var promise = new Promise(function (resolve, reject) {
            var loading = getProgressLoading(skinName);
            if (loading) {
                var load = getResLoad(prepare);
                loading.load = load;
                loading.setComplete(function () {
                    resolve();
                });
                load.loadUpdate = loading;
                loading.show();
            }
            else {
                reject();
            }
        });
        return promise;
    }
    meru.showProgressLoading = showProgressLoading;
    function showLoadScene(scene) {
        var promise = new Promise(function (resolve, reject) {
            var loading = getLoadScene();
            if (loading) {
                var load = getResLoad(scene);
                loading.load = load;
                loading.setComplete(function () {
                    resolve();
                });
                load.loadUpdate = loading;
                loading.show();
            }
        });
        return promise;
    }
    meru.showLoadScene = showLoadScene;
    /**
     * 隐藏加载条
     * @param skinName 加载条的皮肤名
     */
    function hideProgressLoading(skinName) {
        var loading = getProgressLoading(skinName);
        if (loading) {
            loading.hide();
        }
    }
    meru.hideProgressLoading = hideProgressLoading;
    var _tooltip;
    function getTooltip() {
        if (!_tooltip) {
            _tooltip = meru.getDefinitionInstance(meru.getSetting().TooltipClass);
            if (_tooltip) {
                meru.UI.addTooltip(_tooltip);
            }
            if (true && !_tooltip) {
                console.error("请配置TooltipClass");
            }
        }
        return _tooltip;
    }
    /**
     * 显示浮动提示
     * @param info 浮动提示参数
     */
    function tooltip(info, skinName) {
        var tip = getTooltip();
        if (tip) {
            tip.show(info, skinName);
        }
    }
    meru.tooltip = tooltip;
    function customTooltip(skinName, data, delay) {
        var tip = getTooltip();
        if (tip) {
            tip.customView(skinName, data, delay);
        }
    }
    meru.customTooltip = customTooltip;
    var BoxType;
    (function (BoxType) {
        BoxType[BoxType["Box"] = 0] = "Box";
        BoxType[BoxType["HistoryBox"] = 1] = "HistoryBox";
        BoxType[BoxType["SequnceBox"] = 2] = "SequnceBox";
        BoxType[BoxType["GroupSequnceBox"] = 3] = "GroupSequnceBox";
    })(BoxType = meru.BoxType || (meru.BoxType = {}));
    /**
     * 弹出确认框
     * @param info 确认框参数
     * @returns {PromiseInterface<any>} 异步对象
     */
    function confirm(info, boxType) {
        var _this = this;
        if (boxType === void 0) { boxType = BoxType.Box; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var promise = new Promise(function (resolve, reject) {
            var t = meru.getDefinitionInstance(meru.getSetting().ConfirmClass, null, info);
            if (t) {
                if (boxType == BoxType.Box) {
                    meru.UI.addBox(t);
                }
                else if (boxType == BoxType.HistoryBox) {
                    (_a = meru.UI).addHistoryBox.apply(_a, [t].concat(args));
                }
                else if (boxType == BoxType.SequnceBox) {
                    (_b = meru.UI).addSequenceBox.apply(_b, [t].concat(args));
                }
                else if (boxType == BoxType.GroupSequnceBox) {
                    meru.UI.addGroupSequenceBox(t, args[0], args[1], args.slice(2));
                }
                t.show(function (button) {
                    if (button == meru.ConfirmButton.yes) {
                        resolve();
                    }
                    else {
                        reject(button);
                    }
                }, _this);
            }
            var _a, _b;
        });
        return promise;
    }
    meru.confirm = confirm;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/7/8.
 */
var meru;
(function (meru) {
    var ConfirmButton;
    (function (ConfirmButton) {
        ConfirmButton[ConfirmButton["close"] = 0] = "close";
        ConfirmButton[ConfirmButton["yes"] = 1] = "yes";
        ConfirmButton[ConfirmButton["no"] = 2] = "no";
    })(ConfirmButton = meru.ConfirmButton || (meru.ConfirmButton = {}));
})(meru || (meru = {}));
var meru;
(function (meru) {
    var UIHistory = (function () {
        function UIHistory() {
            this._history = [];
        }
        UIHistory.prototype.pushHistory = function (type, args, isUnder, hookList) {
            if (hookList === void 0) { hookList = []; }
            this._history.push({ type: type, args: args, isUnder: isUnder, hookList: hookList });
        };
        Object.defineProperty(UIHistory.prototype, "count", {
            get: function () {
                return this._history.length;
            },
            enumerable: true,
            configurable: true
        });
        UIHistory.prototype.hasHistory = function () {
            return this._history.length > 0;
        };
        UIHistory.prototype.clear = function () {
            this._history.length = 0;
        };
        UIHistory.prototype.popHistory = function () {
            return this._history.pop();
        };
        return UIHistory;
    }());
    meru.UIHistory = UIHistory;
    __reflect(UIHistory.prototype, "meru.UIHistory");
    var UIEvent = (function (_super) {
        __extends(UIEvent, _super);
        function UIEvent(type, component, group) {
            if (group === void 0) { group = null; }
            var _this = _super.call(this, type) || this;
            _this._component = component;
            _this._group = group;
            return _this;
        }
        Object.defineProperty(UIEvent.prototype, "component", {
            get: function () {
                return this._component;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIEvent.prototype, "group", {
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        UIEvent.SHOW_PANEL = "showpanel";
        UIEvent.HIDE_PANEL = "hidepanel";
        UIEvent.ADD_BOX = "addbox";
        UIEvent.CLEAR_SEQUENCE_BOX = "clear_sequence";
        UIEvent.REMOVE_BOX = "removebox";
        UIEvent.RUN_SCENE = "runscene";
        UIEvent.REMOVE_SCENE = "removescene";
        UIEvent.SET_MENU = "setmenu";
        UIEvent.REMOVE_MENU = "removemenu";
        UIEvent.ADD_TOOLTIP = "addtooltip";
        UIEvent.REMOVE_TOOLTIP = "removetooltip";
        UIEvent.ADD_GUIDE = "addguide";
        UIEvent.REMOVE_GUIDE = "remove_guide";
        UIEvent.ADD_COMPONENT = "add_component";
        UIEvent.REMOVE_COMPONENT = "remove_component";
        UIEvent.ADD_COMMON = "add_common";
        UIEvent.REMOVE_COMMON = "remove_common";
        return UIEvent;
    }(egret.Event));
    meru.UIEvent = UIEvent;
    __reflect(UIEvent.prototype, "meru.UIEvent");
    var UIType;
    (function (UIType) {
        UIType[UIType["MIN"] = 0] = "MIN";
        UIType[UIType["TOOLTIP"] = 1] = "TOOLTIP";
        UIType[UIType["GUIDE"] = 2] = "GUIDE";
        UIType[UIType["BOX"] = 3] = "BOX";
        UIType[UIType["COMMON"] = 4] = "COMMON";
        UIType[UIType["PANEL"] = 5] = "PANEL";
        UIType[UIType["MENU"] = 6] = "MENU";
        UIType[UIType["SCENE"] = 7] = "SCENE";
        UIType[UIType["ANY"] = 9] = "ANY";
    })(UIType = meru.UIType || (meru.UIType = {}));
    /**
     * 游戏UI界面控制器
     * 目前支持的容器(层级从下往上):场景层、公共UI层、面板层、菜单层、弹框层、新手引导层、浮动层
     */
    var UI = (function (_super) {
        __extends(UI, _super);
        function UI() {
            var _this = _super.call(this) || this;
            _this._panelTypeMap = {};
            _this._panelInstanceMap = {};
            _this._currentPanel = null;
            _this._sequenceBoxMap = {};
            _this.touchEnabled = false;
            _this._scene = new eui.UILayer();
            _this._scene.touchEnabled = false;
            _this.addChild(_this._scene);
            _this._common = new eui.UILayer();
            _this._common.touchEnabled = false;
            _this.addChild(_this._common);
            _this._panel = new eui.UILayer();
            _this._panel.touchEnabled = false;
            _this.addChild(_this._panel);
            _this._menu = new eui.UILayer();
            _this._menu.touchEnabled = false;
            _this.addChild(_this._menu);
            _this._topScene = new eui.UILayer();
            _this._topScene.touchEnabled = false;
            _this.addChild(_this._topScene);
            _this._box = new eui.UILayer();
            _this._box.touchEnabled = false;
            _this.addChild(_this._box);
            _this._guide = new eui.UILayer();
            _this._guide.touchEnabled = false;
            _this.addChild(_this._guide);
            _this._tooltip = new eui.UILayer();
            _this._tooltip.touchEnabled = false;
            _this.addChild(_this._tooltip);
            _this._containerArr = [_this._scene, _this._topScene, _this._menu, _this._panel, _this._common, _this._box, _this._guide, _this._tooltip];
            return _this;
        }
        /**
         * 注入面板类型到控制器类中
         * @param name 面板名称
         * @param panelType 面板类型
         * @param args 初始化参数列表
         */
        UI.prototype.injectionPanel = function (name, panelType, args) {
            this._panelTypeMap[name] = { name: name, type: panelType, args: args };
        };
        /**
         * 隐藏面板
         * @param panel
         */
        UI.prototype.hidePanel = function (panel) {
            if (panel == null) {
                this.setPanelHide(this._currentPanel);
            }
            else {
                if (is.string(panel)) {
                    this.setPanelHide(this._panelInstanceMap[panel]);
                }
                else {
                    this.setPanelHide(panel);
                }
            }
        };
        UI.prototype.panelIsDisplay = function (name) {
            if (this._currentPanel && this._currentPanel.getComponentName() == name) {
                return this._currentPanel.visible;
            }
            return false;
        };
        UI.prototype.panelInInstanceMap = function (panel) {
            for (var key in this._panelInstanceMap) {
                if (this._panelInstanceMap[key] == panel) {
                    return true;
                }
            }
            return false;
        };
        UI.prototype.setPanelHide = function (panel) {
            if (this._currentPanel && this._currentPanel == panel) {
                this.onExit(this._currentPanel, !this.panelInInstanceMap(panel));
                this.dispatchEvent(new UIEvent(UIEvent.HIDE_PANEL, this._currentPanel));
            }
        };
        UI.prototype.showAnimation = function (component) {
            egret.callLater(function () {
                component.animation.show(function () { });
            }, this);
        };
        UI.prototype.onEnter = function (component) {
            var _this = this;
            if (component.animation) {
                component.visible = true;
                if (component.stage) {
                    this.showAnimation(component);
                }
                else {
                    component.once(egret.Event.ADDED_TO_STAGE, function () {
                        _this.showAnimation(component);
                    }, this);
                }
            }
        };
        UI.prototype.clearBox = function () {
            this.boxHistory.clear();
            for (var i = this._box.numChildren - 1; i >= 0; i--) {
                var box = this._box.getChildAt(i);
                meru.UI.remove(box, false);
            }
        };
        UI.prototype.onExit = function (component, remove) {
            if (component.animation) {
                component.animation.close(function () {
                    component.visible = false;
                    if (remove) {
                        component.destoryData();
                        meru.display.removeFromParent(component, true);
                    }
                });
            }
            else {
                if (remove) {
                    component.destoryData();
                    meru.display.removeFromParent(component, true);
                }
            }
        };
        UI.prototype.setAnimation = function (animationName, instanceObj) {
            if (!instanceObj.animation && animationName) {
                var animType = egret.getDefinitionByName(animationName);
                if (animType) {
                    var animInstance = new animType();
                    instanceObj.animation = animInstance;
                }
            }
        };
        /**
         * 显示面板对象
         */
        UI.prototype._showPanel = function (name, args) {
            this.setPanelHide(this._currentPanel);
            if (!this._panelInstanceMap.hasOwnProperty(name)) {
                var info = this._panelTypeMap[name];
                var inst = new ((_a = info.type).bind.apply(_a, [void 0].concat(info.args)))();
                this._panelInstanceMap[name] = inst;
                inst.componentName = name;
                meru.display.setFullDisplay(inst);
                this._panel.addChild(this._panelInstanceMap[name]);
            }
            this._currentPanel = this._panelInstanceMap[name];
            this._currentPanel.setType(UIType.PANEL);
            if (this._currentPanel.setArgs) {
                (_b = this._currentPanel).setArgs.apply(_b, args);
            }
            this.setAnimation(meru.getSetting().PanelAnimation, this._currentPanel);
            this.onEnter(this._currentPanel);
            this.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, this._currentPanel));
            return this._currentPanel;
            var _a, _b;
        };
        Object.defineProperty(UI.prototype, "boxHistory", {
            get: function () {
                return meru.typeSingleton('__UI_BOX__', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UI.prototype, "panelHistory", {
            get: function () {
                return meru.typeSingleton('__UI_PANEL__', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        UI.prototype.addSequnceBox = function (boxType, group, priority, args, type) {
            if (type === void 0) { type = null; }
            if (!this._sequenceBoxMap.hasOwnProperty(group)) {
                this._sequenceBoxMap[group] = [];
            }
            var arr = this._sequenceBoxMap[group];
            var obj = { boxType: boxType, group: group, args: args, priority: priority, type: type };
            if (arr.length == 0 && group == '_normal_') {
                this.runSeqBox(arr, group, obj);
            }
            else {
                arr.push(obj);
                if (priority != -9999) {
                    arr = arr.sort(function (a, b) {
                        return b.priority - a.priority;
                    });
                }
            }
        };
        UI.prototype.getSequnceCount = function (group) {
            var arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0) {
                return arr.length;
            }
            return 0;
        };
        UI.prototype.runSequnceBox = function (group) {
            var arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0) {
                var top = arr.shift();
                this.runSeqBox(arr, group, top);
            }
        };
        UI.prototype.runSeqBox = function (arr, group, top) {
            var _this = this;
            var box = null;
            if (top.type == 'fun') {
                box = top.args[0];
                egret.callLater(function () {
                    box(function () {
                        _this.onRemoveBox(box);
                    });
                }, this);
            }
            else {
                box = this.addBox(top.boxType, top.args);
            }
            box['__box_group__'] = group;
            arr.push(box);
        };
        UI.prototype.onRemoveBox = function (boxDisplay) {
            var group = boxDisplay['__box_group__'];
            if (group) {
                var arr = this._sequenceBoxMap[group];
                if (arr) {
                    var idx = arr.indexOf(boxDisplay);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    }
                    if (arr.length == 0) {
                        delete this._sequenceBoxMap[group];
                        this.dispatchEvent(new UIEvent(UIEvent.CLEAR_SEQUENCE_BOX, null, group));
                    }
                    else {
                        var top = arr.shift();
                        this.runSeqBox(arr, group, top);
                    }
                }
            }
        };
        UI.prototype.showHistoryPanel = function (type, args) {
            var hookList = [];
            var hook = { setData: function (data, type) {
                    hookList.push({ action: 'setData', data: data, type: type });
                }, addOperate: function (operate) {
                    hookList.push({ action: 'addOperate', operate: operate, data: operate.serialize() });
                } };
            this.panelHistory.pushHistory(type, args, false, hookList);
            var panel = this.showPanel(type, args);
            panel.hook = hook;
            panel.setHistoryComponent(true);
            return panel;
        };
        UI.prototype.addHistoryBox = function (boxType, args) {
            for (var i = this._box.numChildren - 1; i >= 0; i--) {
                var boxInst = this._box.getChildAt(i);
                if (boxInst.isHistoryComponent() === true) {
                    meru.display.removeFromParent(boxInst, true);
                }
            }
            this.boxHistory.pushHistory(boxType, args, false);
            var box = this.addBox(boxType, args);
            box.setHistoryComponent(true);
        };
        UI.prototype.getTypeInst = function (type, animation, args, uiType) {
            var inst = null;
            var skinName;
            if (typeof type == 'string') {
                skinName = type;
                if (uiType == UIType.BOX) {
                    type = meru.getDefinitionType(meru.getSetting().BoxClass, meru.BaseComponent);
                }
                else {
                    type = meru.BaseComponent;
                }
            }
            if (type.constructor.name == "Function") {
                inst = new (type.bind.apply(type, [void 0].concat(args)))();
            }
            else {
                inst = type;
                if (inst.setManual) {
                    inst.setManual(true);
                }
                if (inst.setArgs) {
                    inst.setArgs(args);
                }
            }
            if (skinName) {
                inst.skinName = skinName;
            }
            if (egret.is(inst, 'meru.BaseComponent')) {
                inst.setType(uiType);
            }
            this.setAnimation(animation, inst);
            this.onEnter(inst);
            return inst;
        };
        UI.prototype._addPanel = function (panelType, args) {
            this.hidePanel(this._currentPanel);
            var panelInst = this.getTypeInst(panelType, meru.getSetting().PanelAnimation, args, UIType.PANEL);
            meru.display.setFullDisplay(panelInst);
            this._panel.addChild(panelInst);
            this._currentPanel = panelInst;
            this.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, panelInst));
            return panelInst;
        };
        UI.prototype.addBox = function (boxType, args) {
            var boxInst = this.getTypeInst(boxType, meru.getSetting().BoxAnimation, args, UIType.BOX);
            meru.display.setFullDisplay(boxInst);
            this._box.addChild(boxInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_BOX, boxInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, boxInst));
            return boxInst;
        };
        UI.prototype.checkHistory = function (gotoHistory, history, gotoBackFun) {
            if (!history) {
                return;
            }
            if (gotoHistory) {
                if (history.hasHistory()) {
                    history.popHistory();
                    var item = history.popHistory();
                    if (item) {
                        gotoBackFun(item);
                    }
                }
            }
            else {
                history.clear();
            }
        };
        UI.prototype.remove = function (displayObj, isHistory, checkHistory) {
            var _this = this;
            if (isHistory === void 0) { isHistory = null; }
            if (checkHistory === void 0) { checkHistory = true; }
            var gotoHistory = isHistory;
            if (isHistory == null && displayObj.isHistoryComponent()) {
                gotoHistory = true;
            }
            if (displayObj.isType(UIType.BOX) === true) {
                this.onExit(displayObj, true);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.boxHistory, function (item) {
                        return _this.addHistoryBox(item.type, item.args);
                    });
                }
            }
            else if (displayObj.isType(UIType.SCENE) === true) {
                this.onExit(displayObj, true);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.sceneHistory, function (item) {
                        return _this.addScene(item.type, item.isUnder, item.args);
                    });
                }
            }
            else if (displayObj.isType(UIType.PANEL) === true) {
                this.hidePanel(displayObj);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.panelHistory, function (item) {
                        _this.restoreHookList(_this.showHistoryPanel(item.type, item.args), item.hookList);
                    });
                }
            }
            else {
                this.onExit(displayObj, true);
            }
            if (displayObj.isType(UIType.BOX) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_BOX, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
                this.onRemoveBox(displayObj);
            }
            else if (displayObj.isType(UIType.SCENE) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_SCENE, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
            }
            else if (displayObj.isType(UIType.MENU) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_MENU, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
            }
            else if (displayObj.isType(UIType.GUIDE) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_GUIDE, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
            }
            else if (displayObj.isType(UIType.TOOLTIP) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_TOOLTIP, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
            }
            else if (displayObj.isType(UIType.COMMON) === true) {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMMON, displayObj));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, displayObj));
            }
        };
        UI.prototype.restoreHookList = function (panel, hookList) {
            for (var i = 0; i < hookList.length; i++) {
                var item = hookList[i];
                if (item.action == 'setData') {
                    panel.setData(item.data, item.type);
                }
                else if (item.action == 'addOperate') {
                    var data = item.data;
                    item.operate.unserialize(data);
                    panel.addOperate(item.operate);
                }
            }
        };
        Object.defineProperty(UI.prototype, "sceneHistory", {
            get: function () {
                return meru.typeSingleton('__UI_SCENE__', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        UI.prototype.runScene = function (sceneType, args) {
            if (is.truthy(this._sceneInst)) {
                this.remove(this._sceneInst, null, false);
            }
            var ret = this.addScene(sceneType, true, args);
            return ret;
        };
        UI.prototype.runTopScene = function (sceneType, args) {
            if (is.truthy(this._sceneInst)) {
                this.remove(this._sceneInst, null, false);
            }
            var ret = this.addScene(sceneType, false, args);
            return ret;
        };
        UI.prototype.addScene = function (sceneType, isUnderScene, args) {
            this.sceneHistory.pushHistory(sceneType, args, isUnderScene);
            var sceneInst = this.getTypeInst(sceneType, meru.getSetting().SceneAnimation, args, UIType.SCENE);
            meru.display.setFullDisplay(sceneInst);
            this._sceneInst = sceneInst;
            if (isUnderScene) {
                this._scene.addChild(sceneInst);
            }
            else {
                this._topScene.addChild(sceneInst);
            }
            this._sceneInst.setHistoryComponent(true);
            this._menu.visible = isUnderScene;
            this.dispatchEvent(new UIEvent(UIEvent.RUN_SCENE, this._sceneInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, this._sceneInst));
            return sceneInst;
        };
        UI.prototype.addCommon = function (commonType, args) {
            var commonInst = this.getTypeInst(commonType, null, args, UIType.COMMON);
            meru.display.setFullDisplay(commonInst);
            this._common.addChild(commonInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMMON, commonInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, commonInst));
        };
        UI.prototype.addTooltip = function (tooltipType, args) {
            var tooltipInst = this.getTypeInst(tooltipType, null, args, UIType.TOOLTIP);
            meru.display.setFullDisplay(tooltipInst);
            this._tooltip.addChild(tooltipInst);
            if (egret.is(tooltipInst, 'meru.BaseComponent')) {
                this.dispatchEvent(new UIEvent(UIEvent.ADD_TOOLTIP, tooltipInst));
                this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, tooltipInst));
            }
        };
        UI.prototype.addGuide = function (guideType, args) {
            var guideInst = this.getTypeInst(guideType, null, args, UIType.GUIDE);
            meru.display.setFullDisplay(guideInst);
            this._guide.addChild(guideInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_GUIDE, guideInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, guideInst));
            return guideInst;
        };
        UI.prototype.getContainerByType = function (type) {
            switch (type) {
                case UIType.BOX: {
                    return this._box;
                }
                case UIType.SCENE: {
                    return this._scene;
                }
                case UIType.GUIDE: {
                    return this._guide;
                }
                case UIType.COMMON: {
                    return this._common;
                }
                case UIType.MENU: {
                    return this._menu;
                }
                case UIType.TOOLTIP: {
                    return this._tooltip;
                }
                case UIType.PANEL: {
                    return this._panel;
                }
            }
            return null;
        };
        UI.prototype.hasPanel = function () {
            var panel = this._panel;
            var num = panel.numChildren;
            for (var i = 0; i < num; i++) {
                var child = panel.getChildAt(i);
                if (child.visible) {
                    return true;
                }
            }
            return false;
        };
        UI.hasPanel = function () {
            return meru.singleton(UI).hasPanel();
        };
        UI.prototype.getComponentByName = function (name, container) {
            var num = container.numChildren;
            for (var i = 0; i < num; i++) {
                var child = container.getChildAt(i);
                if (child.componentName == name) {
                    return child;
                }
            }
            return null;
        };
        UI.prototype.getComponent = function (name) {
            var pullComponent = meru.pullObject(meru.k.GetComponent, name);
            if (pullComponent != null && pullComponent != name) {
                return pullComponent;
            }
            for (var i = 0; i < this._containerArr.length; i++) {
                var container = this._containerArr[i];
                var component = this.getComponentByName(name, container);
                if (component) {
                    return component;
                }
            }
            return null;
        };
        UI.prototype.isSingleContainer = function (component) {
            if (component.isType(UIType.SCENE) && component.isType(UIType.MENU)) {
                return true;
            }
            return false;
        };
        UI.prototype.removeComponent = function (name) {
            var obj = this.getComponent(name);
            if (egret.is(obj, 'meru.BaseComponent')) {
                if (!this.isSingleContainer(obj)) {
                    this.remove(obj);
                }
            }
        };
        UI.prototype.setMenu = function (menuType, args) {
            if (this._menuInst != null) {
                this.remove(this._menuInst);
            }
            var menuInst = this.getTypeInst(menuType, null, args, UIType.MENU);
            meru.display.setFullDisplay(menuInst);
            this._menuInst = menuInst;
            this._menuInst.bottom = 0;
            this._menu.addChild(this._menuInst);
            this.dispatchEvent(new UIEvent(UIEvent.SET_MENU, menuInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, menuInst));
        };
        UI.prototype.setRoot = function (container) {
            if (container) {
                container.addChild(this);
            }
        };
        UI.runTopScene = function (sceneType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).runTopScene(sceneType, args);
        };
        UI.runScene = function (sceneType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).runScene(sceneType, args);
        };
        UI.setMenu = function (menuType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            meru.singleton(UI).setMenu(menuType, args);
        };
        UI.addCommon = function (commonType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            meru.singleton(UI).addCommon(commonType, args);
        };
        UI.injectionPanel = function (name, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            args.unshift(name);
            meru.singleton(UI).injectionPanel(name, type, args);
        };
        UI.panelIsVisible = function (name) {
            return meru.singleton(UI).panelIsDisplay(name);
        };
        UI.prototype.showPanel = function (name, args) {
            if ((is.string(name) && name.indexOf('Skin') > -1) || !is.string(name)) {
                return this._addPanel(name, args);
            }
            else {
                return this._showPanel(name, args);
            }
        };
        UI.showPanel = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).showPanel(name, args);
        };
        UI.getComponent = function (name) {
            return meru.singleton(UI).getComponent(name);
        };
        UI.addBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).addBox(type, args);
        };
        UI.addSequenceBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            meru.singleton(UI).addSequnceBox(type, '_normal_', -99999, args);
        };
        UI.getSequenceCount = function (group) {
            return meru.singleton(UI).getSequnceCount(group);
        };
        UI.runGroupSequenceBox = function (group) {
            meru.singleton(UI).runSequnceBox(group);
        };
        UI.addGroupSequenceBox = function (type, group, priority) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            meru.singleton(UI).addSequnceBox(type, group, priority, args);
        };
        UI.addGroupSequenceFun = function (fun, group, priority) {
            meru.singleton(UI).addSequnceBox(null, group, priority, [fun], 'fun');
        };
        UI.addHistoryBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            meru.singleton(UI).addHistoryBox(type, args);
        };
        UI.showHistoryPanel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).showHistoryPanel(type, args);
        };
        UI.addGuide = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return meru.singleton(UI).addGuide(type, args);
        };
        UI.addEventListener = function (type, func, context) {
            meru.singleton(UI).addEventListener(type, func, context);
        };
        UI.once = function (type, func, context) {
            meru.singleton(UI).once(type, func, context);
        };
        UI.removeEventListener = function (type, func, context) {
            meru.singleton(UI).removeEventListener(type, func, context);
        };
        UI.addTooltip = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            meru.singleton(UI).addTooltip(type, args);
        };
        UI.remove = function (inst, gotoHistory) {
            if (gotoHistory === void 0) { gotoHistory = null; }
            meru.singleton(UI).remove(inst, gotoHistory);
        };
        UI.clearBox = function () {
            meru.singleton(UI).clearBox();
        };
        UI.getMenu = function () {
            var ui = meru.singleton(UI)._menuInst;
            return ui;
        };
        UI.getScene = function () {
            var ui = meru.singleton(UI)._sceneInst;
            return ui;
        };
        UI.getContainerByType = function (type) {
            return meru.singleton(UI).getContainerByType(type);
        };
        UI.hidePanel = function (panel) {
            meru.singleton(UI).hidePanel(panel);
        };
        UI.removeByName = function (name) {
            meru.singleton(UI).removeComponent(name);
        };
        Object.defineProperty(UI, "panelHistory", {
            get: function () {
                return meru.singleton(UI).panelHistory;
            },
            enumerable: true,
            configurable: true
        });
        UI.setBoxVisible = function (visible, without) {
            if (without === void 0) { without = null; }
            var u = meru.singleton(UI);
            for (var i = 0, len = u._box.numChildren; i < len; i++) {
                if (u._box.getChildAt(i) != without) {
                    u._box.getChildAt(i).visible = visible;
                }
            }
        };
        Object.defineProperty(UI, "boxHistory", {
            get: function () {
                return meru.singleton(UI).boxHistory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UI, "sceneHistory", {
            get: function () {
                return meru.singleton(UI).sceneHistory;
            },
            enumerable: true,
            configurable: true
        });
        UI.setRoot = function (container) {
            meru.singleton(UI).setRoot(container);
        };
        return UI;
    }(eui.UILayer));
    meru.UI = UI;
    __reflect(UI.prototype, "meru.UI");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var BaseBox = (function (_super) {
        __extends(BaseBox, _super);
        function BaseBox() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._closeShowAll = false;
            return _this;
        }
        Object.defineProperty(BaseBox.prototype, "closeShowAll", {
            get: function () {
                return this._closeShowAll;
            },
            set: function (value) {
                this._closeShowAll = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseBox.prototype.onClose = function () {
            return false;
        };
        BaseBox.prototype.doClose = function (force) {
            if (force === void 0) { force = false; }
            if (force != true) {
                var stop = this.onClose();
                if (stop === true) {
                    return;
                }
            }
            if (this._closeShowAll && !this.operatesIsComplete()) {
                this.setOperatesComplete();
                return;
            }
            meru.display.removeFromParent(this);
        };
        return BaseBox;
    }(meru.BaseComponent));
    meru.BaseBox = BaseBox;
    __reflect(BaseBox.prototype, "meru.BaseBox");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var UIBottom = (function (_super) {
        __extends(UIBottom, _super);
        function UIBottom() {
            var _this = _super.call(this) || this;
            _this.closeVisible = true;
            _this.help = '';
            _this.title = '';
            _this.closeNotice = 'CLOSE_BOX';
            _this.helpNotice = 'HELP_BOX';
            meru.dependProperty(_this, {
                help: 'helpVisible',
                title: 'titleVisible'
            });
            return _this;
        }
        Object.defineProperty(UIBottom.prototype, "host", {
            get: function () {
                return this._host;
            },
            set: function (host) {
                this._host = host;
                if (this.helpBtn && this.helpBtn.visible) {
                    this.addToHost(this.helpBtn);
                }
                if (this.closeBtn && this.closeBtn.visible) {
                    this.addToHost(this.closeBtn);
                }
            },
            enumerable: true,
            configurable: true
        });
        UIBottom.prototype.onEnter = function () {
            var host = meru.display.findTypeParent(this, meru.BaseBox);
            if (host) {
                host.uiBottom = this;
                this.host = host;
            }
            else {
                var comp = meru.display.findTypeParent(this, meru.BaseComponent);
                this.host = comp;
            }
            this.setup(this.host);
        };
        UIBottom.prototype.setup = function (box) {
            var _this = this;
            if (box) {
                box.doHelp = function () {
                    if (_this.helpVisible) {
                        var pullName = _this.help.replace('.', '_');
                        var pullObj = meru.pullObject(pullName, null);
                        meru.$getCallback().on('help', _this.help, pullObj);
                    }
                };
            }
        };
        UIBottom.prototype.addToHost = function (button) {
            var _this = this;
            var num = 2;
            var refresh = function () {
                if (num > 0) {
                    return;
                }
                var box = _this._host;
                var parent = box.getAnimationDisplay('box');
                if (!parent) {
                    parent = box;
                }
                if (button.parent == parent) {
                    return;
                }
                meru.display.resetConstraint(button);
                var matrix = new egret.Matrix();
                matrix.copyFrom(button.$getConcatenatedMatrix());
                button.$getConcatenatedMatrixAt(parent, matrix);
                parent.addChild(button);
                button.x = matrix.tx;
                button.y = matrix.ty;
            };
            if (button.stage) {
                num--;
            }
            else {
                button.once(egret.Event.ADDED_TO_STAGE, function () {
                    num--;
                    refresh();
                }, this);
            }
            button.once(eui.UIEvent.MOVE, function () {
                num--;
                refresh();
            }, this);
        };
        Object.defineProperty(UIBottom.prototype, "helpVisible", {
            get: function () {
                return is.truthy(this.help);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIBottom.prototype, "titleVisible", {
            get: function () {
                return is.truthy(this.title);
            },
            enumerable: true,
            configurable: true
        });
        return UIBottom;
    }(meru.BaseComponent));
    meru.UIBottom = UIBottom;
    __reflect(UIBottom.prototype, "meru.UIBottom");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/29.
 */
var meru;
(function (meru) {
    var SubModelCore = (function (_super) {
        __extends(SubModelCore, _super);
        function SubModelCore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SubModelCore.prototype, "c", {
            get: function () {
                return this._c;
            },
            set: function (value) {
                this._c = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubModelCore.prototype, "p", {
            get: function () {
                return this._p;
            },
            set: function (value) {
                this._p = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubModelCore.prototype, "host", {
            get: function () {
                return this._host;
            },
            set: function (value) {
                this._host = value;
            },
            enumerable: true,
            configurable: true
        });
        SubModelCore.prototype.getProperty = function (name, format) {
            return 0;
        };
        SubModelCore.prototype.update = function () {
        };
        return SubModelCore;
    }(egret.EventDispatcher));
    meru.SubModelCore = SubModelCore;
    __reflect(SubModelCore.prototype, "meru.SubModelCore");
    function getModelVal(p, c, name, defVal) {
        var r = meru.object.getValue(p, name, null);
        if (r == null) {
            r = meru.object.getValue(c, name, defVal);
        }
        return r;
    }
    var BaseSubModel = (function (_super) {
        __extends(BaseSubModel, _super);
        function BaseSubModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(BaseSubModel.prototype, "c", {
            get: function () {
                return this._core.c;
            },
            set: function (val) {
                this._core.c = val;
                this.onInitConfig();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSubModel.prototype, "p", {
            get: function () {
                return this._core.p;
            },
            set: function (val) {
                this._core.p = val;
                this.onInitProxy();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSubModel.prototype, "core", {
            get: function () {
                return this._core;
            },
            set: function (val) {
                if (this._core) {
                    val.p = this._core.p;
                    val.c = this._core.c;
                }
                this._core = val;
                if (val) {
                    val.host = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        BaseSubModel.prototype.onInitConfig = function () {
        };
        BaseSubModel.prototype.onInitProxy = function () {
        };
        BaseSubModel.prototype.dispose = function () {
        };
        BaseSubModel.prototype.getValue = function (name, defVal) {
            if (defVal === void 0) { defVal = null; }
            return getModelVal(this.p, this.c, name, defVal);
        };
        return BaseSubModel;
    }(egret.EventDispatcher));
    meru.BaseSubModel = BaseSubModel;
    __reflect(BaseSubModel.prototype, "meru.BaseSubModel");
    var BaseModel = (function (_super) {
        __extends(BaseModel, _super);
        function BaseModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(BaseModel.prototype, "c", {
            get: function () {
                return this._configData;
            },
            set: function (value) {
                this._configData = value;
                this.onInitConfig();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseModel.prototype, "p", {
            get: function () {
                return this._proxyData;
            },
            set: function (value) {
                this._proxyData = value;
                this.onInitProxy();
            },
            enumerable: true,
            configurable: true
        });
        BaseModel.prototype.onInitProxy = function () {
        };
        BaseModel.prototype.onInitConfig = function () {
        };
        BaseModel.prototype.dispose = function () {
        };
        BaseModel.prototype.getValue = function (name, defVal) {
            if (defVal === void 0) { defVal = null; }
            return getModelVal(this.p, this.c, name, defVal);
        };
        return BaseModel;
    }(egret.EventDispatcher));
    meru.BaseModel = BaseModel;
    __reflect(BaseModel.prototype, "meru.BaseModel");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/31.
 */
var meru;
(function (meru) {
    var Config = (function () {
        function Config() {
            this._confMap = {};
        }
        Config.prototype.getConfig = function (name, key, defaultValue) {
            if (!this._confMap.hasOwnProperty(name)) {
                var data = RES.getRes(name);
                if (data) {
                    this._confMap[name] = data;
                }
            }
            if (key == null) {
                return this._confMap[name] || defaultValue;
            }
            var ret = defaultValue;
            if (this._confMap.hasOwnProperty(name)) {
                if (key != null) {
                    ret = meru.object.getValue(this._confMap[name], key, defaultValue);
                }
            }
            return ret;
        };
        Config.prototype.exists = function (name, key) {
            if (!this._confMap.hasOwnProperty(name)) {
                var data = RES.getRes(name);
                if (data) {
                    this._confMap[name] = data;
                }
            }
            if (this._confMap.hasOwnProperty(name)) {
                if (meru.object.hasValue(this._confMap[name], key)) {
                    return true;
                }
            }
            return false;
        };
        Config.exists = function (name, key) {
            return meru.singleton(Config).exists(name, key);
        };
        Config.get = function (name, key, defaultValue) {
            if (key === void 0) { key = null; }
            if (defaultValue === void 0) { defaultValue = null; }
            return meru.singleton(Config).getConfig(name, key, defaultValue);
        };
        return Config;
    }());
    meru.Config = Config;
    __reflect(Config.prototype, "meru.Config");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/1.
 */
var meru;
(function (meru) {
    var ConfigDataStore = (function (_super) {
        __extends(ConfigDataStore, _super);
        function ConfigDataStore(type, info) {
            var _this = _super.call(this, type) || this;
            _this._info = info;
            return _this;
        }
        ConfigDataStore.prototype.getNewModel = function (type, arg) {
            var conf = this._info.factory(arg);
            var inst = new this._info.type();
            if (inst instanceof meru.BaseSubModel && this._info.subCoreFactory) {
                inst.core = this._info.subCoreFactory(arg);
            }
            inst.c = conf;
            return inst;
        };
        ConfigDataStore.prototype.getModel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var retArr = [];
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (!this.has(arg)) {
                    var conf = this._info.factory(arg);
                    var inst = new this._info.type();
                    if (inst instanceof meru.BaseSubModel && this._info.subCoreFactory) {
                        inst.core = this._info.subCoreFactory(arg);
                    }
                    inst.c = conf;
                    this.onAdd(inst);
                }
                retArr = retArr.concat(_super.prototype.getModel.call(this, type, arg));
            }
            return retArr;
        };
        return ConfigDataStore;
    }(meru.DataStore));
    meru.ConfigDataStore = ConfigDataStore;
    __reflect(ConfigDataStore.prototype, "meru.ConfigDataStore");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var Data = (function () {
        function Data(type) {
            this._dataStoreMap = {};
            this._deleteModels = [];
            this._addModels = [];
            this._type = type;
            this._info = type.info;
            this._info.type = type;
            this._mainStore = new meru.MainDataStore(this._info.autoKey);
            if (this._info.confKey) {
                this._aliasKey = meru.data.DataUtils.formatAliasKey(this._info.confKey);
                this._dataStoreMap[this._aliasKey.configKey] = new meru.ConfigDataStore(this._aliasKey.configKey, this._info);
            }
            for (var i = 0; i < this._info.otherKeys.length; i++) {
                var otherKey = this._info.otherKeys[i];
                this._dataStoreMap[otherKey] = new meru.DataStore(otherKey);
            }
            meru.addNotification(meru.k.BeforeChange(this._info.moddo), this.onBeforeChange, this);
            meru.addNotification(meru.k.Change(this._info.moddo), this.onAfterChange, this);
            meru.addNotification(meru.k.Cache(this._info.moddo), this.onCacheData, this);
        }
        Data.prototype.getList = function () {
            return this._mainStore.getList();
        };
        Data.prototype.getStore = function (propertyName) {
            if (propertyName == this._info.autoKey) {
                return this._mainStore;
            }
            if (this._dataStoreMap.hasOwnProperty(propertyName)) {
                var store = this._dataStoreMap[propertyName];
                return store;
            }
            return null;
        };
        Data.prototype.get = function (propertyName, propertyVal) {
            var store = this.getStore(propertyName);
            if (store) {
                return store.getModel(propertyName, propertyVal);
            }
            return [];
        };
        Data.prototype.getMultiple = function (propertyName) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var store = this.getStore(propertyName);
            if (store) {
                return store.getModel.apply(store, [propertyName].concat(values));
            }
            return [];
        };
        Data.prototype.deleteModel = function (model) {
            meru.object.setValue(model, 'p.num', 0);
            this._mainStore.onDelete(model);
            egret.callLater(function () {
                model.p = null;
            }, this);
            for (var key in this._dataStoreMap) {
                if (key != this._aliasKey.configKey || this._info.isMultiple) {
                    var store = this._dataStoreMap[key];
                    store.onDelete(model);
                }
            }
        };
        Data.prototype.updateModel = function (property, model) {
            if (this._dataStoreMap.hasOwnProperty(property)) {
                this._dataStoreMap[property].update(model);
            }
        };
        Data.prototype.getModel = function (item) {
            var confkey = this._info.confKey;
            var confAliasKey = meru.data.DataUtils.formatAliasKey(confkey);
            var val = meru.object.getValue(item, confAliasKey.proxyKey, null);
            var model = null;
            if (val != null) {
                if (this._info.isMultiple) {
                    model = this._dataStoreMap[confAliasKey.configKey].getNewModel(confAliasKey.configKey, val);
                }
                else {
                    var modelArr = this._dataStoreMap[confAliasKey.configKey].getModel(confAliasKey.configKey, val);
                    if (modelArr != null && modelArr.length > 0) {
                        model = modelArr[0];
                    }
                }
            }
            if (model == null) {
                model = new this._info.type();
            }
            model.p = item;
            return model;
        };
        Data.prototype.addModules = function (lists) {
            var _this = this;
            lists.forEach(function (item) {
                var model = _this.getModel(item);
                _this._addModels.push(model);
                _this._mainStore.onAdd(model);
                for (var key in _this._dataStoreMap) {
                    var store = _this._dataStoreMap[key];
                    store.onAdd(model);
                }
            });
        };
        Data.prototype.add = function (data) {
            this.addModules(data);
        };
        Data.prototype.delete = function (key) {
            var arr = key.split('_');
            if (arr[1] == this._info.autoKey) {
                var id = arr[2].replace('@', '');
                var modelArr = this._mainStore.getModel(this._info.autoKey, id);
                for (var i = 0; i < modelArr.length; i++) {
                    var model = modelArr[i];
                    this._deleteModels.push(model);
                    this.deleteModel(model);
                }
            }
        };
        Data.prototype.find = function (key, data) {
            var arr = key.split('_');
            if (arr[1] == this._info.autoKey) {
                var id = arr[2].replace('@', '');
                var modelArr = this._mainStore.getModel(this._info.autoKey, id);
                for (var subkey in data) {
                    if (subkey.indexOf('@s') > -1) {
                        var subarr = subkey.split('.');
                        var proprety = subarr[1];
                        if (this._dataStoreMap.hasOwnProperty(proprety)) {
                            for (var i = 0; i < modelArr.length; i++) {
                                var model = modelArr[i];
                                this.updateModel(proprety, model);
                            }
                        }
                        meru.postNotification(meru.k.UPDATE_MODEL(this._info.type, proprety), modelArr[0]);
                        if (proprety == 'num') {
                            this.updateNum(modelArr[0]);
                        }
                    }
                }
            }
        };
        Data.prototype.updateNum = function (model) {
            meru.postNotification(meru.k.UPDATE_NUM(this._info.type), model);
        };
        Data.prototype.onChangeData = function (data, type) {
            this._deleteModels.length = 0;
            this._addModels.length = 0;
            var propertys = [];
            for (var key in data[this._info.listKey]) {
                if (key == '@a' && type == 'after') {
                    this.add(data[this._info.listKey][key]);
                }
                else if (key.indexOf('@d') > -1 && type == 'before') {
                    this.delete(key);
                }
                else if (key.indexOf('@f') > -1 && type == 'after') {
                    this.find(key, data[this._info.listKey][key]);
                }
            }
            this.postChangeModel();
        };
        Data.prototype.postChangeModel = function () {
            if (this._addModels.length > 0) {
                meru.postNotification(meru.k.ADD_MODEL(this._info.type), this._addModels);
                for (var i = 0; i < this._addModels.length; i++) {
                    this.updateNum(this._addModels[i]);
                }
            }
            if (this._deleteModels.length > 0) {
                meru.postNotification(meru.k.DELETE_MODEL(this._info.type), this._deleteModels);
                for (var i = 0; i < this._deleteModels.length; i++) {
                    this.updateNum(this._deleteModels[i]);
                }
            }
        };
        Data.prototype.onBeforeChange = function (data) {
            this.onChangeData(data, 'before');
        };
        Data.prototype.onAfterChange = function (data) {
            this.onChangeData(data, 'after');
        };
        Data.prototype.onCacheData = function (data) {
            this.addModules(data[this._info.listKey]);
        };
        return Data;
    }());
    meru.Data = Data;
    __reflect(Data.prototype, "meru.Data");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var DataCenter = (function () {
        function DataCenter() {
        }
        DataCenter.getData = function (type) {
            var id = meru.getTypeId(type);
            if (!this._dataMap.hasOwnProperty(id)) {
                this._dataMap[id] = new meru.Data(type);
            }
            return this._dataMap[id];
        };
        DataCenter.injectionModel = function (type) {
            var id = meru.getTypeId(type);
            if (!this._dataMap.hasOwnProperty(id)) {
                this._dataMap[id] = new meru.Data(type);
            }
        };
        DataCenter.get = function (type, propertyName, propertyVal) {
            var ret = this.getData(type).get(propertyName, propertyVal);
            if (ret != null && ret.length > 0) {
                return ret[0];
            }
            return null;
        };
        DataCenter.getMultiple = function (type, propertyName) {
            var vals = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                vals[_i - 2] = arguments[_i];
            }
            var ret = (_a = this.getData(type)).getMultiple.apply(_a, [propertyName].concat(vals));
            if (ret == null) {
                ret = [];
            }
            return ret;
            var _a;
        };
        DataCenter.getList = function (type) {
            return this.getData(type).getList();
        };
        DataCenter._dataMap = {};
        return DataCenter;
    }());
    meru.DataCenter = DataCenter;
    __reflect(DataCenter.prototype, "meru.DataCenter");
    /**
     * 通过指定属性名和属性值,返回指定类型的模型对象
     * @param type 需要返回的模型对象类型
     * @param propertyName 指定的属性名
     * @param propertyVal 指定的属性值
     * @returns {any} 模型对象
     */
    function getModel(type, propertyName, propertyVal) {
        return DataCenter.get(type, propertyName, propertyVal);
    }
    meru.getModel = getModel;
    /**
     * 通过指定属性名和多个属性值,返回指定类型的模型对象数组
     * @param type 需要返回的模型对象类型
     * @param propertyName 指定的属性名
     * @param valueArr 指定的属性值列表
     * @returns {any[]} 模型对象数组
     */
    function getMultipleModel(type, propertyName) {
        var valueArr = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            valueArr[_i - 2] = arguments[_i];
        }
        return DataCenter.getMultiple.apply(DataCenter, [type, propertyName].concat(valueArr));
    }
    meru.getMultipleModel = getMultipleModel;
    /**
     * 注册模型到数据中心
     * 注册后才能使用数据模型机制
     * @param type 模型类型
     */
    function injectionModel(type) {
        DataCenter.injectionModel(type);
    }
    meru.injectionModel = injectionModel;
    meru.unknown = 'unknown';
    /**
     * 返回指定类型的服务器端模型对象数组
     * @param type 需要返回的模型对象类型
     * @returns {any[]} 模型对象数组
     */
    function getModelList(type) {
        return DataCenter.getList(type);
    }
    meru.getModelList = getModelList;
})(meru || (meru = {}));
var meru;
(function (meru) {
    var PropertyEvent = eui.PropertyEvent;
    var OperateState;
    (function (OperateState) {
        OperateState[OperateState["enter"] = 0] = "enter";
        OperateState[OperateState["exit"] = 1] = "exit";
    })(OperateState = meru.OperateState || (meru.OperateState = {}));
    var isBaseComponent = (function (_super) {
        __extends(isBaseComponent, _super);
        function isBaseComponent() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this.$_componentState = OperateState.exit;
            _this.$_stateEnum = 0;
            _this._isFull = false;
            _this._dataMapArr = [];
            _this._operates = [];
            _this._isHistoryComponent = false;
            _this.$_state = new meru.ComponentState(_this);
            _this.addEventListener(egret.Event.COMPLETE, _this.onLoaded, _this);
            _this.setArgs(args);
            return _this;
        }
        isBaseComponent.prototype.clearListeners = function () {
            this.$_state.clearLiteners();
        };
        Object.defineProperty(isBaseComponent.prototype, "hook", {
            get: function () {
                return this._hook;
            },
            set: function (value) {
                this._hook = value;
            },
            enumerable: true,
            configurable: true
        });
        isBaseComponent.prototype.setManual = function (isManual) {
            if (isManual) {
                this.$_stateEnum ^= 1;
            }
        };
        Object.defineProperty(isBaseComponent.prototype, "autoId", {
            get: function () {
                return this.$_data ? this.$_data.autoId : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(isBaseComponent.prototype, "componentState", {
            get: function () {
                return this.$_componentState;
            },
            enumerable: true,
            configurable: true
        });
        isBaseComponent.prototype.setArgs = function (args) {
            this.$_stateEnum |= 1;
            this.$_state.setArgs(args);
            this.pullData();
        };
        isBaseComponent.prototype.updateAttribute = function (attribute) {
            this[attribute.name] = attribute.value;
        };
        isBaseComponent.prototype.pullData = function () {
            if ((this.$_stateEnum & 1) > 0 && (this.$_stateEnum & 2) > 0) {
                var args = this.$_state.getArgs();
                args = [this.skinName].concat(args);
                var data = meru.pullObject.apply(meru, ['getSkinData'].concat(args));
                if (data && data != this.skinName) {
                    this.data = data;
                }
                var variable = meru.getStruct('VARIABLE');
                if (variable && variable.data) {
                    this.variable = variable.data;
                }
            }
        };
        isBaseComponent.prototype.onLoaded = function () {
            this.$_stateEnum |= 2;
            this.pullData();
        };
        isBaseComponent.prototype.addDataMap = function (name) {
            if (this._dataMapArr.indexOf(name) == -1) {
                this._dataMapArr.push(name);
            }
        };
        Object.defineProperty(isBaseComponent.prototype, "data", {
            get: function () {
                return this.$_data;
            },
            set: function (value) {
                this.$_data = value;
                if (value != null) {
                    this.addDataMap('data');
                    PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "data");
                }
                this.dataChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(isBaseComponent.prototype, "variable", {
            get: function () {
                return this.$_vip;
            },
            set: function (val) {
                this.$_vip = val;
                if (val != null) {
                    this.addDataMap('variable');
                    PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, 'variable');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(isBaseComponent.prototype, "isFull", {
            get: function () {
                return this._isFull;
            },
            enumerable: true,
            configurable: true
        });
        isBaseComponent.prototype.setFull = function () {
            this._isFull = true;
            return this;
        };
        isBaseComponent.prototype.setData = function (data, type) {
            if (type === void 0) { type = 'data'; }
            if (type == 'data') {
                this.data = data;
                if (data != null) {
                    this.addDataMap('data');
                }
            }
            else {
                this[type] = data;
                if (data != null) {
                    this.addDataMap(type);
                    PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, type);
                }
            }
            if (this._hook && data != null) {
                this._hook.setData(data, type);
            }
            return this;
        };
        isBaseComponent.prototype.addOperate = function (operate) {
            if (this.$_componentState == OperateState.enter) {
                operate.state = OperateState.enter;
                operate.enter(this);
            }
            else {
                operate.state = OperateState.exit;
            }
            if (this._hook) {
                this._hook.addOperate(operate);
            }
            this._operates.push(operate);
            return this;
        };
        isBaseComponent.prototype.removeOperate = function (operate) {
            var idx = this._operates.indexOf(operate);
            if (idx > -1) {
                operate.state = OperateState.exit;
                operate.exit(this);
                this._operates.splice(idx, 1);
            }
        };
        isBaseComponent.prototype.setState = function (name) {
            this.currentState = name;
            return this;
        };
        isBaseComponent.prototype.setCompName = function (name) {
            this.componentName = name;
            return this;
        };
        isBaseComponent.prototype.clearOperate = function () {
            while (this._operates.length > 0) {
                this.removeOperate(this._operates[0]);
            }
        };
        isBaseComponent.prototype.removeOperateByName = function (name) {
            for (var i = this._operates.length - 1; i >= 0; i--) {
                if (this._operates[i].getName() == name) {
                    this.removeOperate(this._operates[i]);
                }
            }
        };
        isBaseComponent.prototype.getOperateByName = function (name) {
            var r = [];
            for (var i = 0; i < this._operates.length; i++) {
                if (this._operates[i].getName() == name) {
                    r.push(this._operates[i]);
                }
            }
            return r;
        };
        isBaseComponent.prototype.getOperateByType = function (type) {
            var r = [];
            for (var i = 0; i < this._operates.length; i++) {
                if (this._operates[i].type == type) {
                    r.push(this._operates[i]);
                }
            }
            return r;
        };
        isBaseComponent.prototype.operatesIsComplete = function () {
            return this._operates.every(function (operate) { return operate.isComplete; });
        };
        isBaseComponent.prototype.setOperatesComplete = function () {
            this._operates.forEach(function (a) { return a.setComplete(); });
        };
        isBaseComponent.prototype.dataChanged = function () {
        };
        Object.defineProperty(isBaseComponent.prototype, "animation", {
            get: function () {
                return this.$_anim;
            },
            set: function (val) {
                this.$_anim = val;
                if (val) {
                    this.$_anim.component = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        isBaseComponent.prototype.isType = function (type) {
            if (type == meru.UIType.ANY) {
                return this._type > meru.UIType.MIN &&
                    this._type < meru.UIType.ANY;
            }
            return this._type == type;
        };
        isBaseComponent.prototype.setType = function (type) {
            this._type = type;
        };
        isBaseComponent.prototype.isHistoryComponent = function () {
            return this._isHistoryComponent;
        };
        isBaseComponent.prototype.listener = function (component, sender) {
            this.$_state.listener(component, sender);
        };
        isBaseComponent.prototype.setHistoryComponent = function (isHistory) {
            this._isHistoryComponent = isHistory;
        };
        Object.defineProperty(isBaseComponent.prototype, "componentName", {
            get: function () {
                return this._componentName;
            },
            set: function (value) {
                this._componentName = value;
            },
            enumerable: true,
            configurable: true
        });
        isBaseComponent.prototype.getAnimationDisplay = function (type) {
            if (type == "") {
                return this;
            }
            if (is.falsy(type)) {
                return this;
            }
            if (type == "box") {
                return this.getSubview("boxGroup") ||
                    this.getSubview('uiGroup');
            }
            else if (type == "mask") {
                return this.getSubview("maskRect");
            }
            else {
                return this.getSubview(type);
            }
        };
        isBaseComponent.prototype.getSubview = function (name) {
            if (this[name]) {
                return this[name];
            }
            return this.getChildByName(name);
        };
        isBaseComponent.prototype.onEnter = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.$_componentState = OperateState.enter;
            meru.display.setAttribute(this);
            for (var i = 0; i < this._operates.length; i++) {
                this._operates[i].state = OperateState.enter;
                this._operates[i].enter(this);
            }
        };
        isBaseComponent.prototype.destoryData = function () {
            while (this._dataMapArr.length) {
                this[this._dataMapArr.shift()] = null;
            }
            meru.display.destoryChildren(this);
        };
        isBaseComponent.prototype.onExit = function () {
            this.$_componentState = OperateState.exit;
            for (var i = 0; i < this._operates.length; i++) {
                this._operates[i].state = OperateState.exit;
                this._operates[i].exit(this);
            }
        };
        return isBaseComponent;
    }(eui.Component));
    meru.isBaseComponent = isBaseComponent;
    __reflect(isBaseComponent.prototype, "meru.isBaseComponent", ["meru.IUIAnimationComponent", "meru.IComponent", "egret.DisplayObject", "meru.IAttributeHost"]);
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/8.
 */
var meru;
(function (meru) {
    var BaseItemRenderer = (function (_super) {
        __extends(BaseItemRenderer, _super);
        function BaseItemRenderer() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onItemTap, _this);
            return _this;
        }
        BaseItemRenderer.prototype.onItemTap = function () {
        };
        return BaseItemRenderer;
    }(eui.ItemRenderer));
    meru.BaseItemRenderer = BaseItemRenderer;
    __reflect(BaseItemRenderer.prototype, "meru.BaseItemRenderer");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/13.
 */
var meru;
(function (meru) {
    var ExtraInfo = (function () {
        function ExtraInfo() {
            this._spid = egret.getOption("egret.runtime.spid");
            this._platform = egret.getOption("pf") || "bearjoy";
            this._bench = egret.getOption("gv") || "local";
            this._version = egret.getOption("fv");
            this._oplayerId = egret.getOption("oplayerId");
            this._channel = egret.getOption("channelTag");
            this._runtime = egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }
        Object.defineProperty(ExtraInfo.prototype, "runtime", {
            /**
             * 是否为runtime运行环境
             * @returns {boolean}
             */
            get: function () {
                return this._runtime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "channel", {
            /**
             * channelTag
             * @returns {string}
             */
            get: function () {
                return this._channel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "spId", {
            /**
             * spId
             * @returns {any}
             */
            get: function () {
                return this._spid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "platform", {
            /**
             * 当前游戏的平台
             * @returns {string}
             */
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "bench", {
            /**
             * 当前运行环境:<code>local</code>、<code>beta</code>、<code>release</code>
             * @returns {string}
             */
            get: function () {
                return this._bench;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "version", {
            /**
             * 游戏当前版本
             * @returns {string}
             */
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "oplayerId", {
            /**
             * playerId
             * @returns {string}
             */
            get: function () {
                return this._oplayerId;
            },
            enumerable: true,
            configurable: true
        });
        return ExtraInfo;
    }());
    meru.ExtraInfo = ExtraInfo;
    __reflect(ExtraInfo.prototype, "meru.ExtraInfo");
    var __extra = null;
    meru.def(meru, 'extra', function () {
        if (!__extra) {
            __extra = new ExtraInfo();
        }
        return __extra;
    });
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/28.
 */
var meru;
(function (meru) {
    var item = (function () {
        function item() {
        }
        /**
         * 获取道具类型
         * @returns {null}
         */
        item.getType = function () {
            var itemClass = meru.getSetting().ItemModelClass;
            var itemType = meru.getDefinitionType(itemClass, null);
            if (itemType) {
                return itemType;
            }
            return null;
        };
        /**
         * 获取指定道具名称
         * @param configId 道具编号
         * @returns {any}
         */
        item.getName = function (configId) {
            var itemType = this.getType();
            if (itemType) {
                var nameKey = itemType.NameKey ? itemType.NameKey : "name";
                var key = itemType.info.confKey;
                var info = meru.data.DataUtils.formatAliasKey(key);
                var model = meru.getModel(itemType, info.configKey, configId);
                if (model && model.c) {
                    return meru.object.getValue(model.c, nameKey, null);
                }
            }
            return null;
        };
        /**
         * 获取指定道具的拥有数量
         * @param configId 道具编号
         * @returns {any}
         */
        item.getNum = function (configId) {
            var itemType = this.getType();
            if (itemType) {
                var numKey = itemType.NumKey ? itemType.NumKey : "num";
                var key = itemType.info.confKey;
                var info = meru.data.DataUtils.formatAliasKey(key);
                var model = meru.getModel(itemType, info.configKey, configId);
                if (model && model.p) {
                    return meru.object.getValue(model.p, numKey, 0);
                }
            }
            return 0;
        };
        /**
         * 获取指定道具的模型实例
         * @param val 道具配置编号
         * @returns {any}
         */
        item.getItemByConfigId = function (val) {
            var type = this.getType();
            if (type) {
                var key = type.info.confKey;
                var info = meru.data.DataUtils.formatAliasKey(key);
                var model = meru.getModel(type, info.configKey, val);
                return model;
            }
            return null;
        };
        /**
         * 获取指定道具的模型实例
         * @param val 道具自动编号
         * @returns {any}
         */
        item.getItemByAutoId = function (val) {
            var type = this.getType();
            if (type) {
                var key = type.info.autoKey;
                var model = meru.getModel(type, key, val);
                return model;
            }
            return null;
        };
        /**
         * 获取所有道具的模型实例列表
         * @returns {any}
         */
        item.getItems = function () {
            var type = this.getType();
            if (type) {
                return meru.getModelList(type);
            }
            return [];
        };
        /**
         * 获取指定属性的模型实例
         * @param key 属性名称
         * @param val 属性值
         * @returns {any}
         */
        item.getItemsByKey = function (key, val) {
            var type = this.getType();
            if (type) {
                return meru.getMultipleModel(type, key, val);
            }
            return [];
        };
        return item;
    }());
    meru.item = item;
    __reflect(item.prototype, "meru.item");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/1.
 */
var meru;
(function (meru) {
    var MainDataStore = (function (_super) {
        __extends(MainDataStore, _super);
        function MainDataStore() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._list = [];
            return _this;
        }
        MainDataStore.prototype.onAdd = function (obj) {
            _super.prototype.onAdd.call(this, obj);
            this._list.push(obj);
        };
        MainDataStore.prototype.onDelete = function (obj) {
            _super.prototype.onDelete.call(this, obj);
            meru.array.remove(this._list, obj);
        };
        MainDataStore.prototype.getList = function () {
            return this._list;
        };
        return MainDataStore;
    }(meru.DataStore));
    meru.MainDataStore = MainDataStore;
    __reflect(MainDataStore.prototype, "meru.MainDataStore");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var ModelInfo = (function () {
        function ModelInfo(moddo, autoKey, confKey, otherKeys, listKey, factory, subCoreFactory, isMultiple) {
            if (subCoreFactory === void 0) { subCoreFactory = null; }
            if (isMultiple === void 0) { isMultiple = false; }
            this._isMultiple = false;
            this._moddo = moddo;
            this._autoKey = autoKey;
            this._isMultiple = isMultiple;
            this._factory = factory;
            this._listKey = listKey;
            this._subCoreFactory = subCoreFactory;
            this._confKey = confKey;
            this._otherKeys = otherKeys;
        }
        Object.defineProperty(ModelInfo.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "isMultiple", {
            get: function () {
                return this._isMultiple;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "otherKeys", {
            get: function () {
                return this._otherKeys;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "confKey", {
            get: function () {
                return this._confKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "autoKey", {
            get: function () {
                return this._autoKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "listKey", {
            get: function () {
                return this._listKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "subCoreFactory", {
            get: function () {
                return this._subCoreFactory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "factory", {
            get: function () {
                return this._factory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "moddo", {
            get: function () {
                return this._moddo;
            },
            enumerable: true,
            configurable: true
        });
        return ModelInfo;
    }());
    meru.ModelInfo = ModelInfo;
    __reflect(ModelInfo.prototype, "meru.ModelInfo");
})(meru || (meru = {}));
var meru;
(function (meru) {
    /**
     * 框架基础通知事件
     */
    var NotificationKey = (function () {
        function NotificationKey() {
        }
        NotificationKey.getModDo = function (moddo) {
            if (is.string(moddo)) {
                return moddo;
            }
            if (moddo && moddo.moddo) {
                return moddo.moddo;
            }
            return null;
        };
        /**
         * 缓存请求数据前
         * @param moddo
         * @returns {string}
         * @constructor
         */
        NotificationKey.BeforeChange = function (moddo) {
            return "BeforeChange." + NotificationKey.getModDo(moddo);
        };
        NotificationKey.AfterChange = function (moddo) {
            return "AfterChange." + NotificationKey.getModDo(moddo);
        };
        /**
         * 返回特定接口缓存更新的通知事件名
         * @param moddo 接口名称
         * @returns {string} 更新通知事件名
         * @constructor
         */
        NotificationKey.Change = function (moddo) {
            return "Change." + NotificationKey.getModDo(moddo);
        };
        /**
         * 返回特定接口缓存数据的通知事件名
         * @param moddo 接口名称
         * @returns {string} 缓存通知事件名
         * @constructor
         */
        NotificationKey.Cache = function (moddo) {
            return "Cache." + NotificationKey.getModDo(moddo);
        };
        NotificationKey.ADD_MODEL = function (type) {
            return 'ADD_MODEL_' + meru.getTypeId(type);
        };
        NotificationKey.DELETE_MODEL = function (type) {
            return 'DELETE_MODEL_' + meru.getTypeId(type);
        };
        NotificationKey.UPDATE_MODEL = function (type, key) {
            return 'UPDATE_MODEL_' + meru.getTypeId(type) + '_' + key;
        };
        NotificationKey.UPDATE_NUM = function (type) {
            return 'UPDATE_' + meru.getTypeId(type) + '_NUM';
        };
        /**
         * 通用缓存通知事件名
         * @param moddo 接口名称
         * @returns {string} 通用通知事件名
         * @constructor
         */
        NotificationKey.All = function (moddo) {
            return "All." + NotificationKey.getModDo(moddo);
        };
        /**
         * 接口请求响应成功
         * @type {string}
         */
        NotificationKey.ResponseSucceed = "proxy_response_succeed";
        NotificationKey.StatusWait = "proxy_status_wait";
        NotificationKey.StatusResponse = "proxy_status_response";
        NotificationKey.RequestError = "proxy_request_error";
        NotificationKey.ResponseError = "proxy_response_error";
        NotificationKey.GetComponent = "get_component";
        NotificationKey.MultiResponseError = "multiproxy_response_error";
        NotificationKey.SKIP_MUTATION = "skip_mutation";
        NotificationKey.GET_BUTTON = "guide_get_button";
        NotificationKey.CLICK_BUTTON = "guide_click_button";
        /**
         * 游戏玩家等级提升
         * @type {string}
         */
        NotificationKey.UserLvUp = "UserLevelUp";
        /**
         * 腾讯登录系统
         * @type {string}
         */
        NotificationKey.TencentLogin = "TencentLogin";
        /**
         * 缓存请求数据
         * @type {string}
         */
        NotificationKey.CacheChange = "CacheChange";
        return NotificationKey;
    }());
    meru.NotificationKey = NotificationKey;
    __reflect(NotificationKey.prototype, "meru.NotificationKey");
    /**
     * 框架基础通知事件
     * @type {meru.NotificationKey}
     */
    meru.k = NotificationKey;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/8.
 */
var meru;
(function (meru) {
    var Setting = (function () {
        function Setting() {
        }
        Setting.prototype.getAnimation = function (animation) {
            if (animation) {
                return animation;
            }
            return "NoneAnimation";
        };
        Object.defineProperty(Setting.prototype, "SimpleLoadingClass", {
            get: function () {
                return this._setting.SimpleLoadingClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "LoadSceneClass", {
            get: function () {
                return this._setting.LoadSceneClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "TooltipClass", {
            get: function () {
                return this._setting.TooltipClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "AnimationBlueprint", {
            get: function () {
                return this._setting.AnimationBlueprint;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ProgressLoadingClass", {
            get: function () {
                return this._setting.ProgressLoadingClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "GameCallbackClass", {
            get: function () {
                return this._setting.GameCallbackClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "BoxClass", {
            get: function () {
                return this._setting.BoxClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ConfirmClass", {
            get: function () {
                return this._setting.ConfirmClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "SceneAnimation", {
            get: function () {
                return this.getAnimation(this._setting.SceneAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "PanelAnimation", {
            get: function () {
                return this.getAnimation(this._setting.PanelAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ItemModelClass", {
            get: function () {
                return this._setting.ItemModelClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "BoxAnimation", {
            get: function () {
                return this.getAnimation(this._setting.BoxAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ProjectName", {
            get: function () {
                return this._setting.ProjectName;
            },
            enumerable: true,
            configurable: true
        });
        Setting.prototype.init = function (setting) {
            this._setting = setting;
            meru.localStorage.setPrefix(this._setting.ProjectName + "-" + meru.extra.spId);
        };
        Setting.init = function (game_config) {
            var conf = meru.object.getValue(game_config, "GameConfig");
            meru.singleton(Setting).init(conf);
            var modules = meru.object.getValue(game_config, "Modules");
            for (var key in modules) {
                var moduleVal = modules[key];
                var className = moduleVal["Setting"];
                if (className) {
                    var definition = egret.getDefinitionByName(className);
                    if (definition) {
                        definition.init(moduleVal["Property"]);
                    }
                }
            }
        };
        return Setting;
    }());
    meru.Setting = Setting;
    __reflect(Setting.prototype, "meru.Setting", ["meru.ISetting"]);
    function getSetting() {
        return meru.singleton(Setting);
    }
    meru.getSetting = getSetting;
    function setup(display) {
        display.once(egret.Event.ADDED_TO_STAGE, function () {
            var scaleMode = egret.Capabilities.isMobile ? egret.StageScaleMode.FIXED_WIDTH : egret.StageScaleMode.SHOW_ALL;
            // if((window.innerHeight / window.innerWidth) < 1.45) {
            //     scaleMode = egret.StageScaleMode.SHOW_ALL;
            // }
            meru.stage.scaleMode = scaleMode;
        }, this);
    }
    meru.setup = setup;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/20.
 */
var meru;
(function (meru) {
    var array = (function () {
        function array() {
        }
        array.remove = function (arr, removeItems) {
            var removed = false;
            if (is.fun(removeItems)) {
                var fun = removeItems;
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (fun(arr[i])) {
                        arr.splice(i, 1);
                        removed = true;
                    }
                }
            }
            else if (is.truthy(removeItems)) {
                var args = [].concat(removeItems);
                for (var i = 0; i < args.length; i++) {
                    var idx = arr.indexOf(args[i]);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                        removed = true;
                    }
                }
            }
            return removed;
        };
        array.shuffle = function (array) {
            return array.sort(function () {
                var r = Math.random();
                return r > 0.5 ? 1 : -1;
            });
        };
        array.pluck = function (arr, propertyName) {
            return arr.map(function (item) {
                return item[propertyName];
            });
        };
        array.compact = function (arr) {
            return arr.filter(function (item) {
                return item;
            });
        };
        array.range = function (start, stop, step) {
            if (stop === void 0) { stop = 0; }
            if (step === void 0) { step = 1; }
            if (stop == 0) {
                stop = start || 0;
                start = 0;
            }
            if (step == 1) {
                step = stop < start ? -1 : 1;
            }
            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var range = Array(len);
            for (var idx = 0; idx < len; idx++, start += step) {
                range[idx] = start;
            }
            return range;
        };
        array.find = function (arr, predicate, context) {
            if (context === void 0) { context = null; }
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (predicate && predicate.call(context, item)) {
                    return item;
                }
            }
            return null;
        };
        array.where = function (arr, obj) {
            var keys = Object.keys(obj);
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var ok = keys.every(function (k) {
                    return item[k] == obj[k];
                });
                if (ok) {
                    ret.push(item);
                }
            }
            return ret;
        };
        array.findWhere = function (arr, obj) {
            var items = array.where(arr, obj);
            if (items.length > 0) {
                return items[0];
            }
            return null;
        };
        array.contains = function (arr, obj) {
            if (is.fun(obj)) {
                var fun = obj;
                var some = arr.some(fun);
                return some;
            }
            else {
                var idx = arr.indexOf(obj);
                if (idx > -1) {
                    return true;
                }
            }
            return false;
        };
        return array;
    }());
    meru.array = array;
    __reflect(array.prototype, "meru.array");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/26.
 */
var meru;
(function (meru) {
    var color = (function () {
        function color() {
        }
        color.parseColorText = function (text) {
            text = text.replace(/\s{0,1}\#([a-zA-Z0-9]+)/, function (group, color) {
                var newColor = color;
                if (color[color]) {
                    newColor = color[color];
                }
                return "<font color=\"" + newColor + "\">";
            });
            text = text.replace(/\s\#\s*/, function (group) {
                return "</font>";
            });
            return text;
        };
        color.html = function (text) {
            return this.parseColorText(text);
        };
        color.red = 0xff0000;
        color.white = 0xffffff;
        color.black = 0x000000;
        return color;
    }());
    meru.color = color;
    __reflect(color.prototype, "meru.color");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var display = (function () {
        function display() {
        }
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        display.setAnchor = function (disObj, anchorX, anchorY) {
            if (anchorY === void 0) { anchorY = anchorX; }
            disObj.anchorOffsetX = disObj.width * anchorX;
            disObj.anchorOffsetY = disObj.height * anchorY;
        };
        display.isHostComponentType = function (host) {
            return (host instanceof meru.BaseComponent ||
                host instanceof meru.ItemRenderer);
        };
        Object.defineProperty(display, "stageW", {
            get: function () {
                return meru.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        display.fixedToCenter = function (scroller, display, w, h) {
            if (w === void 0) { w = scroller.viewport.measuredWidth; }
            if (h === void 0) { h = scroller.viewport.measuredHeight; }
            egret.callLater(function () {
                scroller.viewport.scrollV = display.y - scroller.height / 2 + display.height / 2;
                if (scroller.viewport.scrollV < 0) {
                    scroller.viewport.scrollV = 0;
                }
                else if (scroller.viewport.scrollV > h - scroller.height) {
                    scroller.viewport.scrollV = h - scroller.height;
                }
                scroller.viewport.scrollH = display.x - scroller.width / 2 + display.width / 2;
                if (scroller.viewport.scrollH < 0) {
                    scroller.viewport.scrollH = 0;
                }
                else if (scroller.viewport.scrollH > w - scroller.width) {
                    scroller.viewport.scrollH = w - scroller.width;
                }
            }, this);
        };
        display.pointInScreen = function (targetObj, x, y) {
            var p = targetObj.localToGlobal(x, y);
            return (p.x > 0 &&
                p.y > 0 &&
                p.x < this.stageW &&
                p.y < this.stageH);
        };
        display.inScreen = function (displayObj) {
            var bounds = displayObj.getTransformedBounds(meru.stage);
            var w = this.stageW;
            var h = this.stageH;
            return (bounds.x >= -bounds.width &&
                bounds.x <= w &&
                bounds.y >= -bounds.height &&
                bounds.y <= h);
        };
        Object.defineProperty(display, "stageH", {
            get: function () {
                return meru.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        display.setFullDisplay = function (display) {
            display.width = this.stageW;
            display.height = this.stageH;
        };
        display.getStagePosition = function (anchorX, anchorY) {
            if (anchorY === void 0) { anchorY = anchorX; }
            var x = this.stageW * anchorX;
            var y = this.stageH * anchorY;
            return { x: x, y: y };
        };
        display.isVisible = function (obj) {
            while (obj.parent && obj.visible) {
                obj = obj.parent;
            }
            if (obj == meru.stage || obj.visible) {
                return true;
            }
            return false;
        };
        display.setPositionFromStage = function (obj, anchorX, anchorY) {
            if (anchorX === void 0) { anchorX = 0.5; }
            if (anchorY === void 0) { anchorY = anchorX; }
            var pos = this.getStagePosition(anchorX, anchorY);
            obj.x = pos.x;
            obj.y = pos.y;
        };
        display.sort = function (container) {
            var count = container.numChildren;
            var children = [];
            for (var i = 0; i < count; i++) {
                children.push(container.getChildAt(i));
            }
            children.sort(function (a, b) {
                return a.y - b.y;
            });
            children.forEach(function (v, idx) {
                container.setChildIndex(v, idx);
            });
        };
        display.createBitmap = function (src, anchorX, anchorY) {
            if (anchorX === void 0) { anchorX = 0; }
            if (anchorY === void 0) { anchorY = anchorX; }
            var bmp = new egret.Bitmap();
            if (is.truthy(src)) {
                var res = RES.getRes(src);
                if (res) {
                    bmp.texture = res;
                    bmp.anchorOffsetX = bmp.width * anchorX;
                    bmp.anchorOffsetY = bmp.height * anchorX;
                }
                else {
                    RES.getResAsync(src, function () {
                        res = RES.getRes(src);
                        bmp.texture = res;
                        bmp.anchorOffsetX = bmp.width * anchorX;
                        bmp.anchorOffsetY = bmp.height * anchorX;
                    }, this);
                }
            }
            return bmp;
        };
        display.setAttribute = function (component) {
            var num = component.numChildren;
            for (var i = num - 1; i >= 0; i--) {
                var child = component.getChildAt(i);
                if (child instanceof meru.Attribute) {
                    var attr = child;
                    component[attr.name] = attr.value;
                    // component.removeChild(child);
                }
            }
        };
        display.addToContianer = function (displayObj, parent) {
            var p = this.localTolocal(displayObj.x, displayObj.y, displayObj.parent, parent);
            this.resetConstraint(displayObj);
            displayObj.x = p.x;
            displayObj.y = p.y;
            parent.addChild(displayObj);
        };
        display.resetConstraint = function (component) {
            if (egret.is(component, 'eui.Component')) {
                component.left = component.right =
                    component.top = component.bottom =
                        component.horizontalCenter = component.verticalCenter = NaN;
            }
        };
        display.findTypeParent = function (display, type) {
            var parent = display.parent;
            while (parent) {
                if (parent instanceof type) {
                    return parent;
                }
                parent = parent.parent;
            }
            return null;
        };
        display.getHostComponent = function (display) {
            var host = display.parent;
            if (this.isHostComponentType(host)) {
                return host;
            }
            while (host && !(this.isHostComponentType(host))) {
                host = host.parent;
            }
            if (this.isHostComponentType(host)) {
                return host;
            }
            return null;
        };
        /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        display.removeAllChildren = function (container) {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
        };
        /**
         * 将源显示对象中的位置转换成目标对象中的位置
         * @param x 源显示对象x轴
         * @param y 源显示对象y轴
         * @param source 源显示对象
         * @param dist 目标显示对象
         * @returns {egret.Point}
         */
        display.localTolocal = function (x, y, source, dist, p) {
            if (p === void 0) { p = new egret.Point(x, y); }
            p = source.localToGlobal(x, y, p);
            p = dist.globalToLocal(p.x, p.y, p);
            return p;
        };
        display.getScale = function (obj) {
            var ret = { x: obj.scaleX, y: obj.scaleY };
            while (obj.parent) {
                obj = obj.parent;
                ret.x *= obj.scaleX;
                ret.y *= obj.scaleY;
            }
            return ret;
        };
        display.destoryChildren = function (container) {
            var children = container.numChildren;
            for (var i = 0; i < children; i++) {
                var item = container.getChildAt(i);
                if (item instanceof meru.BaseComponent) {
                    item.destoryData();
                }
                else if (item instanceof meru.Button) {
                    item.destoryData();
                }
                else if (item instanceof eui.Group) {
                    this.destoryChildren(item);
                }
                else if (item instanceof eui.Scroller) {
                    this.destoryChildren(item);
                }
                else if (item instanceof meru.ItemRenderer) {
                    item.destoryData();
                }
            }
        };
        /**
         * 移除显示对象,可以是egret的显示对象,也可以是继承组件
         * @param child 子显示对象
         */
        display.removeFromParent = function (child, forceRemove) {
            if (forceRemove === void 0) { forceRemove = false; }
            if (!forceRemove && egret.is(child, "meru.BaseComponent")) {
                meru.UI.remove(child);
            }
            else {
                if (is.truthy(child) && child.parent) {
                    child.parent.removeChild(child);
                }
            }
        };
        return display;
    }());
    meru.display = display;
    __reflect(display.prototype, "meru.display");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var Attribute = (function (_super) {
        __extends(Attribute, _super);
        function Attribute() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.add, _this);
            return _this;
        }
        Object.defineProperty(Attribute.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Attribute.prototype, "value", {
            get: function () {
                if (this._value == 'true' || this._value == 'false') {
                    return this._value == 'true';
                }
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.onUpdate();
            },
            enumerable: true,
            configurable: true
        });
        Attribute.prototype.onUpdate = function () {
            if (this.parent && this.parent.updateAttribute) {
                var host = this.parent;
                host.updateAttribute(this);
            }
        };
        Attribute.prototype.add = function () {
            this.onUpdate();
        };
        return Attribute;
    }(eui.Component));
    meru.Attribute = Attribute;
    __reflect(Attribute.prototype, "meru.Attribute");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/26.
 */
var meru;
(function (meru) {
    var num = (function () {
        function num() {
        }
        num.randInt = function (min, max) {
            return ___math___.floor(___math___.random() * (max - min + 1)) + min;
        };
        num.randFloat = function (min, max) {
            return ___math___.random() * (max - min) + min;
        };
        num.padNum = function (num, str) {
            var numStr = num.toString();
            var len = str.length - numStr.length;
            if (len > 0) {
                return '0' + numStr;
            }
            return numStr;
        };
        /**
         * 格式化倒计时时间
         * @param time 倒计时时间(秒)
         * @param format 格式化文字
         * @returns {string}
         */
        num.toCountdown = function (time, format) {
            var _this = this;
            var day = Math.floor(time / 86400);
            time = time % 86400;
            var hour = Math.floor(time / 3600);
            time = time % 3600;
            var minutes = Math.floor(time / 60);
            time = time % 60;
            var seconds = Math.floor(time);
            var str = format.replace(/((\[)(.*?))?(D{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && day <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(day, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(H{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(hour, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(M{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour <= 0 && minutes <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(minutes, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(S{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour > 0) {
                    return '';
                }
                return (before || '') + _this.padNum(seconds, key) + (after || '');
            });
            return str;
        };
        return num;
    }());
    meru.num = num;
    __reflect(num.prototype, "meru.num");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/25.
 */
var meru;
(function (meru) {
    var object = (function () {
        function object() {
        }
        object.clone = function (obj) {
            var _this = this;
            if (is.falsy(obj) || is.not.object(obj)) {
                return obj;
            }
            if (obj instanceof RegExp) {
                return obj;
            }
            var result = (Array.isArray(obj)) ? [] : {};
            Object.keys(obj).forEach(function (key) {
                if (is.object(obj[key])) {
                    result[key] = _this.clone(obj[key]);
                }
                else {
                    result[key] = obj[key];
                }
            });
            return result;
        };
        object.keys = function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys;
        };
        object.values = function (obj) {
            var keys = this.keys(obj);
            var len = keys.length;
            var values = Array(len);
            for (var i = 0; i < len; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        };
        object.isMatch = function (object, attrs) {
            var keys = this.keys(attrs), len = keys.length;
            if (object == null)
                return !len;
            var obj = Object(object);
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                if (attrs[key] !== obj[key] || !(key in obj))
                    return false;
            }
            return true;
        };
        object.matches = function (prop) {
            var _this = this;
            return function (obj) {
                return _this.isMatch(obj, prop);
            };
        };
        object.hasValue = function (data, key) {
            if (!data) {
                return false;
            }
            key = key + "";
            var keyArr = key.split('.');
            var obj = data;
            while (keyArr.length > 0 && obj) {
                var k = keyArr.shift();
                if (!obj.hasOwnProperty(k)) {
                    return false;
                }
                obj = obj[k];
            }
            return true;
        };
        object.setValue = function (data, key, val, forceSet) {
            if (forceSet === void 0) { forceSet = false; }
            if (is.falsy(data)) {
                return;
            }
            key = key + "";
            var keyArr = key.split('.');
            var obj = data;
            for (var i = 0; i < keyArr.length - 1; i++) {
                key = keyArr[i];
                if (is.array(obj)) {
                    obj = obj[parseInt(key)];
                }
                else {
                    obj = obj[key];
                }
                if (is.falsy(obj)) {
                    break;
                }
            }
            if (is.truthy(obj)) {
                var lastKey = keyArr[keyArr.length - 1];
                if (forceSet) {
                    obj[lastKey] = val;
                }
                else {
                    if (obj.hasOwnProperty(lastKey)) {
                        obj[lastKey] = val;
                    }
                }
            }
        };
        object.getValue = function (data, key, defVal) {
            if (defVal === void 0) { defVal = null; }
            if (is.falsy(data)) {
                return defVal;
            }
            key = key + "";
            var keyArr = key.split('.');
            var curObj = data;
            for (var i = 0; i < keyArr.length; i++) {
                var key = keyArr[i];
                if (is.array(curObj)) {
                    curObj = curObj[parseInt(key)];
                }
                else {
                    if (key == '') {
                        curObj = curObj;
                    }
                    else {
                        curObj = curObj[key];
                    }
                }
                if (is.not.existy(curObj)) {
                    break;
                }
            }
            if (is.not.existy(curObj)) {
                return defVal;
            }
            return curObj;
        };
        object.deepClone = function (obj) {
            var _this = this;
            if (is.falsy(obj) || is.not.object(obj)) {
                return obj;
            }
            var result = (Array.isArray(obj)) ? [] : {};
            Object.getOwnPropertyNames(obj).forEach(function (key) {
                if (is.object(obj[key])) {
                    result[key] = _this.deepClone(obj[key]);
                }
                else {
                    result[key] = obj[key];
                }
            });
            return result;
        };
        object.assign = function (destination) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            sources.forEach(function (source) { return Object.keys(source).forEach(function (key) { return destination[key] = source[key]; }); });
            return destination;
        };
        object.toObject = function (arr, keyMap, valueMap) {
            var _this = this;
            if (valueMap === void 0) { valueMap = function (x) { return x; }; }
            return arr.reduce(function (o, d) {
                return _this.assign(o, (_a = {}, _a[keyMap(d)] = valueMap(d), _a));
                var _a;
            }, Object.create(null));
        };
        object.equals = function (one, other) {
            if (one === other) {
                return true;
            }
            if (one === null || one === undefined || other === null || other === undefined) {
                return false;
            }
            if (typeof one !== typeof other) {
                return false;
            }
            if (typeof one !== 'object') {
                return false;
            }
            if ((Array.isArray(one)) !== (Array.isArray(other))) {
                return false;
            }
            var i, key;
            if (Array.isArray(one)) {
                if (one.length !== other.length) {
                    return false;
                }
                for (i = 0; i < one.length; i++) {
                    if (!this.equals(one[i], other[i])) {
                        return false;
                    }
                }
            }
            else {
                var oneKeys = [];
                for (key in one) {
                    oneKeys.push(key);
                }
                oneKeys.sort();
                var otherKeys = [];
                for (key in other) {
                    otherKeys.push(key);
                }
                otherKeys.sort();
                if (!this.equals(oneKeys, otherKeys)) {
                    return false;
                }
                for (i = 0; i < oneKeys.length; i++) {
                    if (!this.equals(one[oneKeys[i]], other[oneKeys[i]])) {
                        return false;
                    }
                }
            }
            return true;
        };
        return object;
    }());
    meru.object = object;
    __reflect(object.prototype, "meru.object");
    function v(obj, paths, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.object.getValue(obj, paths, defVal);
    }
    meru.v = v;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/25.
 */
var meru;
(function (meru) {
    var PadDireciton;
    (function (PadDireciton) {
        PadDireciton[PadDireciton["LEFT"] = 0] = "LEFT";
        PadDireciton[PadDireciton["MIDDLE"] = 1] = "MIDDLE";
        PadDireciton[PadDireciton["RIGHT"] = 2] = "RIGHT";
    })(PadDireciton = meru.PadDireciton || (meru.PadDireciton = {}));
    var str = (function () {
        function str() {
        }
        str.pad = function (str, len, pad, dir) {
            if (len === void 0) { len = 0; }
            if (pad === void 0) { pad = ' '; }
            if (dir === void 0) { dir = PadDireciton.MIDDLE; }
            var padlen = 0;
            if (len + 1 >= str.length) {
                switch (dir) {
                    case PadDireciton.LEFT: {
                        str = new Array(len + 1 - str.length).join(pad) + str;
                        break;
                    }
                    case PadDireciton.MIDDLE: {
                        var right = Math.ceil((padlen = len - str.length) / 2);
                        var left = padlen - right;
                        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
                        break;
                    }
                    default: {
                        str = str + new Array(len + 1 - str.length).join(pad);
                        break;
                    }
                }
            }
            return str;
        };
        str.replaceFromObject = function (text, arg) {
            if (is.object(arg)) {
                for (var key in arg) {
                    text = meru.str.replaceAll(text, "{" + key + "}", arg[key]);
                }
            }
            return text;
        };
        str.format = function (value) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args.length == 0) {
                return value;
            }
            return value.replace(this._formatRegexp, function (match, group) {
                var idx = parseInt(group, 10);
                return isNaN(idx) || idx < 0 || idx >= args.length ?
                    match :
                    args[idx];
            });
        };
        str.formatFromObject = function (value, param) {
            if (is.falsy(param) || is.empty(param)) {
                return value;
            }
            return value.replace(this._formatObjRegexp, function (match, group) {
                if (param.hasOwnProperty(group)) {
                    return param[group];
                }
                return match;
            });
        };
        str.trim = function (haystack, needle) {
            if (needle === void 0) { needle = ' '; }
            var trimmed = this.ltrim(haystack, needle);
            return this.rtrim(trimmed, needle);
        };
        str.ltrim = function (haystack, needle) {
            if (!haystack || !needle) {
                return haystack;
            }
            var needleLen = needle.length;
            if (needleLen === 0 || haystack.length === 0) {
                return haystack;
            }
            var offset = 0, idx = -1;
            while ((idx = haystack.indexOf(needle, offset)) === offset) {
                offset = offset + needleLen;
            }
            return haystack.substring(offset);
        };
        str.rtrim = function (haystack, needle) {
            if (!haystack || !needle) {
                return haystack;
            }
            var needleLen = needle.length, haystackLen = haystack.length;
            if (needleLen === 0 || haystackLen === 0) {
                return haystack;
            }
            var offset = haystackLen, idx = -1;
            while (true) {
                idx = haystack.lastIndexOf(needle, offset - 1);
                if (idx === -1 || idx + needleLen !== offset) {
                    break;
                }
                if (idx === 0) {
                    return '';
                }
                offset = idx;
            }
            return haystack.substring(0, offset);
        };
        str.startsWith = function (haystack, needle) {
            if (haystack.length < needle.length) {
                return false;
            }
            for (var i = 0; i < needle.length; i++) {
                if (haystack[i] !== needle[i]) {
                    return false;
                }
            }
            return true;
        };
        str.endsWith = function (haystack, needle) {
            var diff = haystack.length - needle.length;
            if (diff > 0) {
                return haystack.lastIndexOf(needle) === diff;
            }
            else if (diff === 0) {
                return haystack === needle;
            }
            else {
                return false;
            }
        };
        str.replaceAll = function (str, search, replacement) {
            var s = str.replace(new RegExp(search, 'g'), replacement);
            return s;
        };
        str.formatNotice = function (notice) {
            var r = notice.replace(/\#([^\#]+)\#/, function (all, eventName) {
                var obj = meru.pullObject(eventName);
                if (obj) {
                    return obj;
                }
                return eventName;
            });
            return r;
        };
        str.repeat = function (s, count) {
            var arr = new Array(count);
            for (var i = 0; i < count; i++) {
                arr[i] = s;
            }
            return arr.join('');
        };
        str._formatRegexp = /{(\d+)}/g;
        str._formatObjRegexp = /{([^\}]+)}/g;
        return str;
    }());
    meru.str = str;
    __reflect(str.prototype, "meru.str");
})(meru || (meru = {}));
/**
 *
 * Created by brucex on 16/8/31.
 */
var meru;
(function (meru) {
    var BaseLiteItem = (function () {
        function BaseLiteItem(name, property, genearte) {
            this.params = [];
            this.name = name;
            this.property = property;
            this.generate = genearte;
        }
        BaseLiteItem.prototype.addParams = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.params = this.params.concat(args);
        };
        BaseLiteItem.prototype.check = function (model) {
            if (this.property == null) {
                return true;
            }
            var val = meru.object.getValue(model, this.property);
            return this.params.indexOf(val) > -1;
        };
        BaseLiteItem.prototype.getList = function (lists) {
            var _this = this;
            var r = null;
            if (this.name == 'all') {
                r = this.generate();
                if (lists.length > 0) {
                    r = r.filter(function (item) { return lists.indexOf(item) == -1; });
                }
            }
            else {
                r = this.params.reduce(function (items, v) {
                    var results = _this.generate(v);
                    if (lists.length > 0) {
                        results = results.filter(function (item) { return lists.indexOf(item) == -1; });
                    }
                    return items.concat(results);
                }, []);
            }
            return r.concat(lists);
        };
        return BaseLiteItem;
    }());
    meru.BaseLiteItem = BaseLiteItem;
    __reflect(BaseLiteItem.prototype, "meru.BaseLiteItem");
    var BaseList = (function () {
        function BaseList(type) {
            this._rules = [];
            this._itemMap = {};
            this._lists = [];
            this._hasEvent = false;
            this._hasNew = false;
            this._type = type;
        }
        BaseList.prototype.valid = function (item) {
            if (this._rules.length == 0) {
                return true;
            }
            return this._rules.some(function (condition) {
                return condition.valid(item);
            });
        };
        BaseList.prototype.addItem = function (key, property, generate) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            if (!this._itemMap.hasOwnProperty(key)) {
                this._itemMap[key] = new BaseLiteItem(key, property, generate);
            }
            (_a = this._itemMap[key]).addParams.apply(_a, args);
            var _a;
        };
        BaseList.prototype.rule = function (group) {
            if (is.string(group)) {
                var s = group;
                this._rules.push(meru.ListRule.add(s));
            }
            else if (is.fun(group)) {
                var f = group;
                this._rules.push(meru.ListRule.fun(f));
            }
            else {
                var g = group;
                this._rules.push(g);
            }
            return this;
        };
        BaseList.prototype.sort = function (sort) {
            this._sort = sort;
            return this;
        };
        BaseList.prototype.setList = function (lists) {
            this._lists = lists;
            return this;
        };
        BaseList.prototype.getList = function () {
            var _this = this;
            if (this._sources && !this._hasNew) {
                return this._sources;
            }
            this._hasNew = false;
            var lists = this._lists;
            for (var key in this._itemMap) {
                var item = this._itemMap[key];
                lists = item.getList(lists);
            }
            lists = lists.filter(function (item) {
                return _this.valid(item);
            });
            if (this._sort) {
                lists.sort(this._sort.sort);
            }
            this._sources = lists;
            return this._sources;
        };
        BaseList.prototype.getCollection = function () {
            if (!this._collection) {
                var lists = this.getList();
                this._collection = new eui.ArrayCollection(lists);
                meru.addNotification(meru.k.ADD_MODEL(this._type), this.onAdd, this);
                meru.addNotification(meru.k.DELETE_MODEL(this._type), this.onDelete, this);
            }
            return this._collection;
        };
        BaseList.prototype.dispose = function () {
            meru.removeNotificationByTarget(this);
        };
        BaseList.prototype.onAdd = function (modelArr) {
            for (var i = 0; i < modelArr.length; i++) {
                var model = modelArr[i];
                if (this.check(model)) {
                    this._hasNew = true;
                    if (this._collection) {
                        this._collection.source.push(model);
                    }
                }
            }
            if (this._collection && this._hasNew) {
                if (this._sort) {
                    this._collection.source.sort(this._sort.sort);
                }
                eui.CollectionEvent.dispatchCollectionEvent(this._collection, eui.CollectionEvent.COLLECTION_CHANGE, eui.CollectionEventKind.RESET);
            }
        };
        BaseList.prototype.check = function (model) {
            var _this = this;
            var ret = true;
            var keys = Object.keys(this._itemMap);
            if (keys.length >= 0) {
                ret = keys.some(function (k) { return _this._itemMap[k].check(model); });
            }
            if (ret) {
                return this.valid(model);
            }
            return ret;
        };
        BaseList.prototype.onDelete = function (modelArr) {
            if (modelArr.length > 0 && this._collection) {
                var newArr = [].concat(modelArr);
                while (newArr.length > 0) {
                    var model = newArr.shift();
                    var idx = this._collection.getItemIndex(model);
                    if (idx > -1) {
                        this._collection.removeItemAt(idx);
                    }
                }
            }
        };
        return BaseList;
    }());
    meru.BaseList = BaseList;
    __reflect(BaseList.prototype, "meru.BaseList");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/31.
 */
var meru;
(function (meru) {
    var ListCond;
    (function (ListCond) {
        ListCond[ListCond["equal"] = 0] = "equal";
        ListCond[ListCond["greaterThen"] = 1] = "greaterThen";
        ListCond[ListCond["greaterEqual"] = 2] = "greaterEqual";
        ListCond[ListCond["lessThen"] = 3] = "lessThen";
        ListCond[ListCond["lessEqual"] = 4] = "lessEqual";
        ListCond[ListCond["truthy"] = 5] = "truthy";
        ListCond[ListCond["falsy"] = 6] = "falsy";
    })(ListCond = meru.ListCond || (meru.ListCond = {}));
    var ListCondInfo = (function () {
        function ListCondInfo(name, cond, value) {
            if (!cond) {
                this.parse(name);
            }
            else {
                this.name = name;
                this.cond = cond;
                this.value = value;
            }
        }
        ListCondInfo.prototype.parse = function (exp) {
            var r = /^\s*(\!)?([a-zA-Z\.0-9]+)\s*([\>\<\=]+)?\s*(.*?)?\s*$/gi;
            var arr = r.exec(exp);
            if (arr) {
                var not = arr[1];
                var prop = arr[2];
                var cond = arr[3];
                var val = arr[4];
                this.name = prop;
                this.value = val;
                if (not) {
                    this.cond = ListCond.falsy;
                }
                else if (cond) {
                    this.cond = ListCondInfo.condMap[cond];
                }
                else {
                    this.cond = ListCond.truthy;
                }
            }
        };
        ListCondInfo.prototype.valid = function (item) {
            var v = meru.object.getValue(item, this.name, null);
            switch (this.cond) {
                case ListCond.truthy: {
                    return is.truthy(v);
                }
                case ListCond.falsy: {
                    return is.falsy(v);
                }
                case ListCond.equal: {
                    return v == this.value;
                }
                case ListCond.greaterThen: {
                    return v > this.value;
                }
                case ListCond.lessThen: {
                    return v < this.value;
                }
                case ListCond.greaterEqual: {
                    return v >= this.value;
                }
                case ListCond.lessEqual: {
                    return v <= this.value;
                }
            }
        };
        ListCondInfo.condMap = {
            '==': ListCond.equal,
            '>=': ListCond.greaterEqual,
            '>': ListCond.greaterThen,
            '<=': ListCond.lessEqual,
            '<': ListCond.lessThen
        };
        return ListCondInfo;
    }());
    meru.ListCondInfo = ListCondInfo;
    __reflect(ListCondInfo.prototype, "meru.ListCondInfo", ["meru.IListCondInfo"]);
    var FunCondInfo = (function () {
        function FunCondInfo(fun) {
            this._fun = fun;
        }
        FunCondInfo.prototype.valid = function (item) {
            return this._fun(item);
        };
        return FunCondInfo;
    }());
    meru.FunCondInfo = FunCondInfo;
    __reflect(FunCondInfo.prototype, "meru.FunCondInfo", ["meru.IListCondInfo"]);
    var ListRule = (function () {
        function ListRule() {
            this._conditions = [];
        }
        ListRule.prototype.add = function (name, cond, val) {
            if (name.indexOf('&&') > -1) {
                var arr = name.split('&&');
                for (var i = 0; i < arr.length; i++) {
                    this._conditions.push(new ListCondInfo(arr[i]));
                }
            }
            else {
                this._conditions.push(new ListCondInfo(name, cond, val));
            }
            return this;
        };
        ListRule.prototype.fun = function (fun) {
            this._conditions.push(new FunCondInfo(fun));
            return this;
        };
        ListRule.fun = function (fun) {
            return new ListRule().fun(fun);
        };
        ListRule.add = function (name, cond, val) {
            return new ListRule().add(name, cond, val);
        };
        ListRule.prototype.valid = function (item) {
            return this._conditions.every(function (condition) {
                return condition.valid(item);
            });
        };
        return ListRule;
    }());
    meru.ListRule = ListRule;
    __reflect(ListRule.prototype, "meru.ListRule");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var SortDir;
    (function (SortDir) {
        SortDir[SortDir["asc"] = 0] = "asc";
        SortDir[SortDir["desc"] = 1] = "desc";
    })(SortDir = meru.SortDir || (meru.SortDir = {}));
    var SortItemInfo = (function () {
        function SortItemInfo(property, type) {
            this.property = property;
            this.type = type;
        }
        SortItemInfo.prototype.sort = function (a, b) {
            var av = meru.object.getValue(a, this.property, 0);
            var bv = meru.object.getValue(b, this.property, 0);
            if (this.type == SortDir.desc) {
                return bv - av;
            }
            else {
                return av - bv;
            }
        };
        return SortItemInfo;
    }());
    meru.SortItemInfo = SortItemInfo;
    __reflect(SortItemInfo.prototype, "meru.SortItemInfo");
    var Sort = (function () {
        function Sort() {
            this._sorts = [];
            this._isInvert = false;
        }
        Sort.prototype.desc = function (property) {
            this._sorts.push(new SortItemInfo(property, SortDir.desc));
            return this;
        };
        Sort.prototype.asc = function (property) {
            this._sorts.push(new SortItemInfo(property, SortDir.asc));
            return this;
        };
        Sort.prototype.custom = function (fun) {
            this._sorts.push(fun);
            return this;
        };
        Object.defineProperty(Sort.prototype, "sort", {
            get: function () {
                return this._sort.bind(this);
            },
            enumerable: true,
            configurable: true
        });
        Sort.prototype.reverse = function () {
            var r = [];
            var len = this._sorts.length;
            for (var i = 0; i < len; i++) {
                var oldInfo = this._sorts[(len - 1) - i];
                var newInfo = new SortItemInfo(oldInfo.property, oldInfo.type == SortDir.desc ? SortDir.asc : SortDir.desc);
                r.push(newInfo);
            }
            return r;
        };
        Sort.prototype._sort = function (a, b) {
            var sorts = this._isInvert ? this.reverse() : this._sorts;
            for (var i = 0; i < sorts.length; i++) {
                var info = sorts[i];
                var sort = null;
                if (info instanceof SortItemInfo) {
                    sort = info.sort.bind(info);
                }
                else {
                    sort = info;
                }
                var n = sort(a, b);
                if (n != 0) {
                    return n;
                }
            }
            return 0;
        };
        Sort.desc = function (property) {
            return new Sort().desc(property);
        };
        Sort.asc = function (property) {
            return new Sort().asc(property);
        };
        Sort.custom = function (fun) {
            return new Sort().custom(fun);
        };
        Sort.prototype.invert = function () {
            this._isInvert = true;
            return this;
        };
        return Sort;
    }());
    meru.Sort = Sort;
    __reflect(Sort.prototype, "meru.Sort");
})(meru || (meru = {}));
/**
 * Created by brucex on 9/1/14.
 */
var meru;
(function (meru) {
    var MultiProxy = (function (_super) {
        __extends(MultiProxy, _super);
        function MultiProxy() {
            var argmts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argmts[_i] = arguments[_i];
            }
            var _this = _super.call(this, null) || this;
            _this._subProxys = [];
            var args = [];
            if (argmts.length == 1 && Array.isArray(argmts[0])) {
                args = argmts[0];
            }
            else if (argmts.length > 0) {
                for (var i = 0; i < argmts.length; i++) {
                    args.push(argmts[i]);
                }
            }
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    _this.addSubProxy(args[i]);
                }
            }
            _this.addParam("m", 1);
            return _this;
        }
        MultiProxy.prototype.load = function () {
            if (this._subProxys.length == 0) {
                return;
            }
            _super.prototype.load.call(this);
        };
        MultiProxy.prototype.getParamString = function () {
            var arr = [];
            this._subProxys.forEach(function (proxy) {
                var ret = {};
                for (var key in proxy.params) {
                    if (meru.Proxy.frontProxyKeys.indexOf(key) == -1) {
                        ret[key] = proxy.params[key];
                    }
                }
                arr.push(ret);
            }, this);
            return JSON.stringify(arr);
        };
        MultiProxy.prototype.onResponse = function (data) {
            var _this = this;
            if (data) {
                this._responseData = data;
                this._subProxys.forEach(function (v) {
                    var smod = v.getParamByName("mod");
                    var sdo = v.getParamByName("do");
                    v.onResponse(_this.responseData[smod][sdo]);
                }, this);
                this._isRequestSucceed = true;
                this._isResponseSucceed = true;
                meru.postNotification(meru.ProxyAction.MULTIPROXY_SUCCEED, this);
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.RESPONSE_SUCCEED, this));
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.REQUEST_SUCCEED, this));
            }
            else {
                this._isRequestSucceed = true;
                this._isResponseSucceed = false;
                this._errorCode = -1000;
                meru.postNotification(meru.ProxyAction.MULTIPROXY_ERROR, this);
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.RESPONSE_ERROR, this));
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.REQUEST_SUCCEED, this));
                this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.ERROR, this));
            }
            this.proxyDone();
        };
        Object.defineProperty(MultiProxy.prototype, "subProxyList", {
            get: function () {
                return this._subProxys;
            },
            enumerable: true,
            configurable: true
        });
        MultiProxy.prototype.getParamByName = function (name) {
            for (var i = 0; i < this._subProxys.length; i++) {
                var ret = this._subProxys[i].getParamByName(name);
                if (ret != null) {
                    return ret;
                }
            }
            return null;
        };
        MultiProxy.prototype.addSubProxy = function (subProxy) {
            if (subProxy && subProxy.hasOwnProperty("moddo")) {
                var p1 = new meru.SingleProxy(subProxy);
                this._subProxys.push(p1);
            }
            else if (subProxy instanceof meru.SingleProxy) {
                this._subProxys.push(subProxy);
            }
            else if (subProxy instanceof MultiProxy) {
                var multiProxy = subProxy;
                var that = this;
                multiProxy._subProxys.forEach(function (v) {
                    that.addSubProxy(v);
                }, this);
            }
        };
        return MultiProxy;
    }(meru.Proxy));
    meru.MultiProxy = MultiProxy;
    __reflect(MultiProxy.prototype, "meru.MultiProxy");
    var AutoMergeProxy = (function (_super) {
        __extends(AutoMergeProxy, _super);
        function AutoMergeProxy(time) {
            var _this = _super.call(this) || this;
            _this._waitTime = 0;
            _this._waitTime = time;
            egret.setTimeout(_this.load, _this, _this._waitTime);
            return _this;
        }
        AutoMergeProxy.prototype.load = function () {
            AutoMergeProxy._cur = null;
            _super.prototype.load.call(this);
        };
        AutoMergeProxy.getProxy = function () {
            if (this._cur == null) {
                this._cur = new AutoMergeProxy(500);
            }
            return this._cur;
        };
        AutoMergeProxy._cur = null;
        return AutoMergeProxy;
    }(MultiProxy));
    meru.AutoMergeProxy = AutoMergeProxy;
    __reflect(AutoMergeProxy.prototype, "meru.AutoMergeProxy");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/9/1.
 *
 */
var meru;
(function (meru) {
    var BaseOperate = (function (_super) {
        __extends(BaseOperate, _super);
        function BaseOperate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseOperate.prototype.getIsComplete = function () {
            return true;
        };
        Object.defineProperty(BaseOperate.prototype, "isComplete", {
            get: function () {
                return this.getIsComplete();
            },
            enumerable: true,
            configurable: true
        });
        BaseOperate.prototype.serialize = function () {
            return null;
        };
        BaseOperate.prototype.unserialize = function (data) {
        };
        BaseOperate.prototype.setName = function (name) {
            this.__name = name;
            var r = this;
            return r;
        };
        BaseOperate.prototype.getName = function () {
            return this.__name;
        };
        BaseOperate.prototype.getType = function () {
            return 'none';
        };
        Object.defineProperty(BaseOperate.prototype, "type", {
            get: function () {
                return this.getType();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseOperate.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (value) {
                this._state = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseOperate.prototype.setComplete = function () {
        };
        BaseOperate.prototype.enter = function (component) {
        };
        BaseOperate.prototype.exit = function (component) {
        };
        return BaseOperate;
    }(egret.HashObject));
    meru.BaseOperate = BaseOperate;
    __reflect(BaseOperate.prototype, "meru.BaseOperate", ["meru.IComponentOperate"]);
})(meru || (meru = {}));
var meru;
(function (meru) {
    var ProxyAction = (function () {
        function ProxyAction() {
        }
        /**
         * 请求正在等待状态
         * @type {string}
         */
        ProxyAction.WAIT = "proxy_status_wait";
        /**
         * 请求正在响应状态
         * @type {string}
         */
        ProxyAction.RESPONSE = "proxy_status_response";
        /**
         * 开始加载
         * @type {string}
         */
        ProxyAction.BEGIN_LOAD = "load_proxy";
        /**
         * 请求前状态
         * @type {string}
         */
        ProxyAction.REQUEST = "proxy_status_reqeust";
        /**
         * 请求成功
         * @type {string}
         */
        ProxyAction.REQUEST_SUCCEED = "proxy_request_succeed";
        /**
         * 请求响应成功
         * @type {string}
         */
        ProxyAction.RESPONSE_SUCCEED = "proxy_response_succeed";
        /**
         * 请求失败
         * @type {string}
         */
        ProxyAction.REQUEST_ERROR = "proxy_request_error";
        /**
         * 请求响应错误
         * @type {string}
         */
        ProxyAction.RESPONSE_ERROR = "proxy_response_error";
        /**
         * 请求超时
         * @type {string}
         */
        ProxyAction.TIMEOUT = "proxy_timeout";
        /**
         * 多请求响应错误
         * @type {string}
         */
        ProxyAction.MULTIPROXY_ERROR = "multiproxy_response_error";
        /**
         * 多请求响应成功
         * @type {string}
         */
        ProxyAction.MULTIPROXY_SUCCEED = "multiproxy_response_succeed";
        return ProxyAction;
    }());
    meru.ProxyAction = ProxyAction;
    __reflect(ProxyAction.prototype, "meru.ProxyAction");
})(meru || (meru = {}));
/**
 * Created by brucex on 9/2/14.
 */
var meru;
(function (meru) {
    var ProxyCache = (function () {
        function ProxyCache() {
            this._cacheData = {};
        }
        Object.defineProperty(ProxyCache, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new ProxyCache();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        ProxyCache.prototype.reset = function () {
            var slist = this._cacheData["Server"]["getList"];
            this._cacheData = { "Server": { "getList": slist } };
        };
        ProxyCache.prototype.resetOne = function (smod, sdo) {
            if (sdo === void 0) { sdo = null; }
            var marr = this.formatParmas(smod, sdo);
            if (this._cacheData.hasOwnProperty(marr[0])) {
                delete this._cacheData[marr[0]][marr[1]];
            }
        };
        ProxyCache.prototype.setCache = function (proxy) {
            var params = proxy.params;
            if (params.hasOwnProperty("cache") && params["cache"] === true) {
                var data = proxy.responseData;
                var smod = proxy.getParamByName("mod");
                var sdo = proxy.getParamByName("do");
                if (!this._cacheData.hasOwnProperty(smod)) {
                    this._cacheData[smod] = {};
                }
                if (params.hasOwnProperty("dataMerge") && params["dataMerge"] === true) {
                    this._cacheData[smod][sdo] = this.dataMerge(this._cacheData[smod][sdo], data);
                }
                else {
                    this._cacheData[smod][sdo] = data;
                }
                meru.postNotification(meru.k.Cache(smod + "." + sdo), data);
                meru.postNotification(meru.k.All(smod + "." + sdo));
                meru.postNotification(meru.k.CacheChange, smod + "." + sdo, data);
            }
        };
        ProxyCache.prototype.dataMerge = function (dist, source) {
            var obj = dist || {};
            for (var key in source) {
                obj[key] = source[key];
            }
            return obj;
        };
        ProxyCache.prototype.getCache = function (smod, sdo) {
            if (smod === void 0) { smod = null; }
            if (sdo === void 0) { sdo = null; }
            if (smod == null) {
                return this._cacheData;
            }
            if (this.isCache(smod, sdo)) {
                var params = this.formatParmas(smod, sdo);
                return this._cacheData[params[0]][params[1]];
            }
            return null;
        };
        ProxyCache.prototype.formatParmas = function (smod, sdo) {
            if (sdo === void 0) { sdo = null; }
            if (sdo == null) {
                var arr = smod.split(".");
                smod = arr[0];
                sdo = arr[1];
            }
            return [smod, sdo];
        };
        ProxyCache.prototype.isCache = function (smod, sdo) {
            if (sdo === void 0) { sdo = null; }
            var params = this.formatParmas(smod, sdo);
            return this._cacheData.hasOwnProperty(params[0]) && this._cacheData[params[0]].hasOwnProperty(params[1]);
        };
        ProxyCache.setCache = function (proxy) {
            ProxyCache.instance.setCache(proxy);
        };
        /**
         * 获取缓存数据
         * @param moddo
         * @returns {Object}
         */
        ProxyCache.getCache = function (moddo) {
            if (moddo === void 0) { moddo = null; }
            return ProxyCache.instance.getCache(meru.k.getModDo(moddo));
        };
        ProxyCache.resetOne = function (moddo) {
            ProxyCache.instance.resetOne(meru.k.getModDo(moddo));
        };
        ProxyCache.reset = function () {
            return ProxyCache.instance.reset();
        };
        /**
         * 指定接口的数据是否已缓存
         * @param moddo
         * @returns {boolean}
         */
        ProxyCache.isCache = function (moddo) {
            return ProxyCache.instance.isCache(meru.k.getModDo(moddo));
        };
        ProxyCache._instance = null;
        return ProxyCache;
    }());
    meru.ProxyCache = ProxyCache;
    __reflect(ProxyCache.prototype, "meru.ProxyCache");
    function buildProxyInfo(moddo, params, cache, mask) {
        if (params === void 0) { params = {}; }
        if (cache === void 0) { cache = false; }
        if (mask === void 0) { mask = true; }
        var info = { moddo: moddo, mask: mask, cache: cache, params: params };
        return info;
    }
    meru.buildProxyInfo = buildProxyInfo;
    /**
     * @private
     */
    meru.___userInfo = buildProxyInfo("User.getInfo", {}, true);
    function User_getInfo() {
        return meru.___userInfo;
    }
    meru.User_getInfo = User_getInfo;
    /***
     * 获取指定服务器端接口缓存中的数据
     * @param propertyOrType 属性名称或服务器接口类型
     * @param defValOrType 默认值或服务器接口类型
     * @param defaultVal 默认值
     * @includeExample getCache.ts
     * @returns {any} 缓存数据
     */
    function getCache(propertyOrType, defValOrType, defaultVal) {
        var property;
        var type;
        var defVal;
        if (is.string(propertyOrType)) {
            property = propertyOrType;
        }
        else if (propertyOrType && propertyOrType.moddo) {
            type = propertyOrType;
        }
        if (is.truthy(defValOrType)) {
            if (defValOrType && defValOrType.moddo) {
                type = defValOrType;
            }
            else {
                defVal = defValOrType;
            }
        }
        if (is.falsy(defVal)) {
            defVal = defaultVal;
        }
        if (is.falsy(type)) {
            type = User_getInfo();
        }
        if (is.falsy(property)) {
            return ProxyCache.getCache(type.moddo);
        }
        else {
            var data = ProxyCache.getCache(type.moddo);
            if (data) {
                return meru.object.getValue(data, property, defVal);
            }
            return defVal;
        }
    }
    meru.getCache = getCache;
    /**
     * 获取指定链条接口表示的数据
     * @param where 链条接口
     * @param defVal
     * @returns {any}
     */
    function getWhereValue(where, defVal) {
        if (defVal === void 0) { defVal = null; }
        var whereArr = where.split('.');
        var info = { moddo: whereArr.slice(0, 2).join(".") };
        if (whereArr.length == 2) {
            return meru.getCache(info, defVal);
        }
        else {
            return meru.getCache(whereArr.slice(2).join("."), info, defVal);
        }
    }
    meru.getWhereValue = getWhereValue;
    /***
     * 指定服务器接口是否已经缓存了数据
     * @param type 服务器端接口类型,默认使用用户信息接口类型
     * @returns {boolean} 是否已经缓存了数据
     */
    function hasCache(type) {
        if (type === void 0) { type = User_getInfo(); }
        return ProxyCache.isCache(type.moddo);
    }
    meru.hasCache = hasCache;
})(meru || (meru = {}));
var meru;
(function (meru) {
    var ProxyEvent = (function (_super) {
        __extends(ProxyEvent, _super);
        function ProxyEvent(type, target, bubbles, cancelable) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this._responseData = target.responseData;
            _this._errorCode = target.errorCode;
            _this._errorMessage = target.errorMessage;
            _this._isRequestSucceed = target.isRequestSucceed;
            _this._isResponseSucceed = target.isResponseSucceed;
            return _this;
        }
        Object.defineProperty(ProxyEvent.prototype, "responseData", {
            get: function () {
                return this._responseData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProxyEvent.prototype, "errorCode", {
            get: function () {
                return this._errorCode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProxyEvent.prototype, "errorMessage", {
            get: function () {
                return this._errorMessage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProxyEvent.prototype, "isResponseSucceed", {
            get: function () {
                return this._isResponseSucceed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProxyEvent.prototype, "isRequestSucceed", {
            get: function () {
                return this._isRequestSucceed;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 请求中断
         * @type {number}
         */
        ProxyEvent.CANCEL = "cancel";
        /**
         * 请求成功
         * @type {number}
         */
        ProxyEvent.REQUEST_SUCCEED = "requestSucceed";
        /**
         * 请求失败
         * @type {number}
         */
        ProxyEvent.REQUEST_FAIL = "fail";
        /**
         * 响应结果成功
         * @type {number}
         */
        ProxyEvent.RESPONSE_SUCCEED = "respnseSucceed";
        /**
         * 响应结果失败
         * @type {number}
         */
        ProxyEvent.RESPONSE_ERROR = "error";
        ProxyEvent.ERROR = "global_error";
        ProxyEvent.TIME_OUT = "timeout";
        return ProxyEvent;
    }(egret.Event));
    meru.ProxyEvent = ProxyEvent;
    __reflect(ProxyEvent.prototype, "meru.ProxyEvent");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var ProxyStatus = (function () {
        function ProxyStatus() {
        }
        /**
         * 默认阶段
         * @type {number}
         */
        ProxyStatus.DEFAULT = 1 << 0;
        /**
         * 请求阶段
         * @type {number}
         */
        ProxyStatus.REQUEST = 1 << 1;
        /**
         * 请求中阶段
         * @type {number}
         */
        ProxyStatus.WAIT = 1 << 2;
        /**
         * 响应后阶段
         * @type {number}
         */
        ProxyStatus.RESPONSE = 1 << 3;
        return ProxyStatus;
    }());
    meru.ProxyStatus = ProxyStatus;
    __reflect(ProxyStatus.prototype, "meru.ProxyStatus");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var ProxyUpdate = (function () {
        function ProxyUpdate() {
        }
        Object.defineProperty(ProxyUpdate, "instance", {
            get: function () {
                if (this._instance == null) {
                    this._instance = new ProxyUpdate();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        ProxyUpdate.update = function (proxy, cache) {
            ProxyUpdate.instance.update(proxy, cache);
        };
        ProxyUpdate.prototype.isArray = function (key) {
            return key instanceof Array;
        };
        ProxyUpdate.prototype.isObject = function (obj) {
            var key = obj.toString();
            return key.indexOf("object") > -1;
        };
        ProxyUpdate.prototype.isNumeric = function (v) {
            return parseFloat(v).toString() == v.toString();
        };
        ProxyUpdate.customUpdate = function (pmod, obj) {
            ProxyUpdate.instance.customUpdate(pmod, obj);
        };
        ProxyUpdate.prototype.isNormal = function (key) {
            var isAt = key.indexOf("@") > -1;
            var isDot = key.indexOf(".") > -1;
            var isUnderline = key.indexOf("_") > -1;
            return (!isAt && !isDot && !isUnderline);
        };
        ProxyUpdate.prototype.isAddToArray = function (key) {
            return (key == "@a");
        };
        ProxyUpdate.prototype.isRemoveToArray = function (key) {
            var arr = key.split("_");
            return (arr.length <= 3 && arr[0] == "@d");
        };
        ProxyUpdate.prototype.isFilter = function (key) {
            var arr = key.split("_");
            return (arr[0] == "@f");
        };
        ProxyUpdate.prototype._updateObject = function (name, value, cacheData) {
            var arr = name.split(".");
            if (arr[0] == "@a" || arr[0] == "@s") {
                if (this.isArray(cacheData)) {
                    cacheData[parseInt(arr[1])] = value;
                }
                else {
                    cacheData[arr[1]] = value;
                }
            }
            else if (arr[0] == "@d") {
                delete cacheData[arr[1]];
            }
        };
        ProxyUpdate.prototype._getFilterObject = function (filter, cacheData) {
            if (cacheData) {
                var arr = filter.split("_");
                if (arr.length == 2 && arr[0] == "@f" && this.isArray(cacheData)) {
                    var idx = parseInt(arr[1]);
                    return cacheData[idx];
                }
                if (arr.length == 3 && arr[0] == "@f" && this.isArray(cacheData)) {
                    var key = arr[1];
                    var value = arr[2];
                    for (var i = 0; i < cacheData.length; i++) {
                        var v = cacheData[i];
                        if (arr.length == 3 && this.isObject(v)) {
                            var cacheValue = v[key];
                            if (cacheValue != null && cacheData != undefined) {
                                if (value[0] == "@") {
                                    value = value.replace("@", "");
                                }
                                if (value == cacheValue) {
                                    return v;
                                }
                            }
                        }
                    }
                }
            }
            return null;
        };
        ProxyUpdate.prototype._addObjectToArray = function (cacheData, changeValue) {
            if (this.isArray(changeValue)) {
                for (var i = 0; i < changeValue.length; i++) {
                    cacheData.push(changeValue[i]);
                }
            }
            else {
                cacheData.push(changeValue);
            }
        };
        ProxyUpdate.prototype._sliceCaceData = function (cacheData, idx) {
            var obj = cacheData[idx];
            cacheData.splice(idx, 1);
        };
        ProxyUpdate.prototype._removeObjectFromArray = function (cacheData, key, changeValue) {
            var arr = key.split("_");
            if (arr.length <= 3 && arr[0] == "@d") {
                if (this.isArray(cacheData)) {
                    var count = cacheData.length;
                    for (var i = count - 1; i >= 0; i--) {
                        var cacheDataItem = cacheData[i];
                        if (arr.length == 3) {
                            if (cacheDataItem.hasOwnProperty(arr[1])) {
                                var val = arr[2];
                                if (val[0] == "@") {
                                    val = val.replace("@", "");
                                }
                                if (val == cacheDataItem[arr[1]]) {
                                    this._sliceCaceData(cacheData, i);
                                }
                            }
                        }
                        else if (arr.length == 2 && cacheDataItem.hasOwnProperty(arr[1])) {
                            if (changeValue == cacheDataItem[arr[1]]) {
                                this._sliceCaceData(cacheData, i);
                            }
                        }
                        else if (arr.length == 1) {
                            if (changeValue == cacheDataItem) {
                                this._sliceCaceData(cacheData, i);
                            }
                        }
                    }
                }
            }
        };
        ProxyUpdate.prototype.update = function (proxy, dataCache) {
            var data = proxy.responseData["c"];
            var modArr = [];
            for (var k1 in data) {
                var v1 = data[k1];
                var arr = k1.split('.');
                var pmod = arr[0];
                var pdo = arr[1];
                if (dataCache.hasOwnProperty(pmod) && dataCache[pmod].hasOwnProperty(pdo)) {
                    meru.postNotification(meru.k.BeforeChange(pmod + "." + pdo), v1);
                    this._update(dataCache[pmod][pdo], v1);
                    this.postAction(pmod, pdo, v1);
                    modArr.push([pmod, pdo, v1]);
                }
            }
            for (var i = 0; i < modArr.length; i++) {
                var item = modArr[i];
                meru.postNotification(meru.k.AfterChange(item[0] + '.' + item[1]), item[2]);
            }
        };
        ProxyUpdate.prototype.postAction = function (pmod, pdo, v1) {
            meru.postNotification(meru.k.Change(pmod + "." + pdo), v1);
            meru.postNotification(meru.k.All(pmod + "." + pdo));
        };
        ProxyUpdate.prototype.customUpdate = function (pmod, obj) {
            var cacheObj = meru.ProxyCache.getCache(pmod);
            this._update(cacheObj, obj);
            var arr = pmod.split('.');
            this.postAction(arr[0], arr[1], obj);
        };
        ProxyUpdate.prototype._update = function (cacheData, changeData) {
            if (cacheData && changeData && this.isObject(changeData)) {
                for (var k in changeData) {
                    var v = changeData[k];
                    if (this.isNormal(k) && this.isObject(v)) {
                        if (cacheData.hasOwnProperty(k)) {
                            this._update(cacheData[k], v);
                        }
                    }
                    else if (this.isNormal(k) && this.isNumeric(v)) {
                        var cv = cacheData[k];
                        cacheData[k] = cv + v;
                    }
                    else if (this.isNormal(k)) {
                        cacheData[k] = v;
                    }
                    else if (this.isAddToArray(k)) {
                        this._addObjectToArray(cacheData, v);
                    }
                    else if (this.isRemoveToArray(k)) {
                        this._removeObjectFromArray(cacheData, k, v);
                    }
                    else if (this.isFilter(k)) {
                        var subCacheData = this._getFilterObject(k, cacheData);
                        if (subCacheData) {
                            this._update(subCacheData, v);
                        }
                    }
                    else {
                        this._updateObject(k, v, cacheData);
                    }
                }
            }
        };
        return ProxyUpdate;
    }());
    meru.ProxyUpdate = ProxyUpdate;
    __reflect(ProxyUpdate.prototype, "meru.ProxyUpdate");
})(meru || (meru = {}));
/**
 * Created by brucex on 9/1/14.
 */
var meru;
(function (meru) {
    var RequestStatus = (function () {
        function RequestStatus() {
        }
        /**
         * 请求成功
         * @type {number}
         */
        RequestStatus.SUCCEED = 1 << 0;
        /**
         * 请求失败
         * @type {number}
         */
        RequestStatus.ERROR = 1 << 1;
        return RequestStatus;
    }());
    meru.RequestStatus = RequestStatus;
    __reflect(RequestStatus.prototype, "meru.RequestStatus");
})(meru || (meru = {}));
/**
 * Created by brucex on 9/1/14.
 */
var meru;
(function (meru) {
    var ProxyTime = (function () {
        function ProxyTime() {
            this._tickObj = {};
            this._tickId = null;
            this.refreshTick();
        }
        ProxyTime.prototype.refreshTick = function () {
            if (this._tickId == null) {
                this._tickId = egret.setInterval(this.tick, this, 1000);
            }
        };
        ProxyTime.prototype.tick = function () {
            for (var key in this._tickObj) {
                this._tickObj[key]--;
                if (this._tickObj[key] <= 0) {
                    delete this._tickObj[key];
                }
            }
            if (Object.keys(this._tickObj).length == 0) {
                egret.clearInterval(this._tickId);
                this._tickId = null;
            }
        };
        ProxyTime.prototype.getLeftime = function (key) {
            if (this._tickObj.hasOwnProperty(key)) {
                return this._tickObj[key];
            }
            return 0;
        };
        ProxyTime.prototype.push = function (key, time) {
            this._tickObj[key] = time;
            this.refreshTick();
        };
        ProxyTime.getInstance = function () {
            if (ProxyTime._inst == null) {
                ProxyTime._inst = new ProxyTime();
            }
            return ProxyTime._inst;
        };
        return ProxyTime;
    }());
    meru.ProxyTime = ProxyTime;
    __reflect(ProxyTime.prototype, "meru.ProxyTime");
    var SingleProxy = (function (_super) {
        __extends(SingleProxy, _super);
        function SingleProxy(params) {
            if (params === void 0) { params = {}; }
            var _this = this;
            params = proxyInfo2param(params);
            _this = _super.call(this, params) || this;
            return _this;
        }
        SingleProxy.prototype.getParamString = function () {
            var ret = {};
            for (var key in this._params) {
                if (meru.Proxy.frontProxyKeys.indexOf(key) == -1) {
                    ret[key] = this._params[key];
                }
            }
            return JSON.stringify(ret);
        };
        SingleProxy.prototype.load = function () {
            if (this.getParamByName("autoMerge") == true) {
                meru.AutoMergeProxy.getProxy().addSubProxy(this);
            }
            else {
                var delayObj = this.getParamByName("delay");
                if (delayObj) {
                    var time = delayObj["time"];
                    var smod = this.getParamByName("mod");
                    var sdo = this.getParamByName("do");
                    var type = delayObj["type"] || "";
                    var key = smod + "." + sdo;
                    if (type != "") {
                        key += "." + type;
                    }
                    if (ProxyTime.getInstance().getLeftime(key) == 0) {
                        ProxyTime.getInstance().push(key, time);
                        _super.prototype.load.call(this);
                    }
                    else {
                        this.dispatchEvent(new meru.ProxyEvent(meru.ProxyEvent.RESPONSE_SUCCEED, this));
                    }
                }
                else {
                    _super.prototype.load.call(this);
                }
            }
        };
        return SingleProxy;
    }(meru.Proxy));
    meru.SingleProxy = SingleProxy;
    __reflect(SingleProxy.prototype, "meru.SingleProxy");
    function proxyInfo2param(type) {
        var proxyParams = {};
        if (type.moddo) {
            proxyParams["mod"] = type.moddo;
        }
        if (type.params) {
            proxyParams["p"] = type.params || {};
        }
        if (type.mask === true || typeof (type.mask) == 'undefined') {
            proxyParams["mask"] = true;
        }
        if (type.cache === true) {
            proxyParams["cache"] = true;
        }
        if (type.dataMerge === true) {
            proxyParams["dataMerge"] = true;
        }
        if (type.delay) {
            proxyParams["delay"] = type.delay;
        }
        return proxyParams;
    }
    /**
     * 发送合并网络请求
     * @param args 接口信息对象列表
     * @includeExample multirequest.ts
     * @returns {PromiseInterface<any>} 异步对象
     */
    function multiRequest() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var promise = new Promise(function (resolve, reject) {
            var multiProxy = new meru.MultiProxy();
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                multiProxy.addSubProxy(arg);
            }
            multiProxy.addEventListener(meru.ProxyEvent.REQUEST_SUCCEED, function (e) {
                if (false) {
                    try {
                        resolve(e.responseData);
                    }
                    catch (e) {
                    }
                }
                if (true) {
                    resolve(e.responseData);
                }
            }, _this);
            multiProxy.addEventListener(meru.ProxyEvent.ERROR, function (e) {
                if (false) {
                    try {
                        reject(e);
                    }
                    catch (e) {
                    }
                }
                if (true) {
                    reject(e);
                }
            }, _this);
            multiProxy.load();
        });
        return promise;
    }
    meru.multiRequest = multiRequest;
    /**
     * 发送网络请求
     * @param type 接口信息对象
     * @includeExample request.ts
     * @returns {PromiseInterface<any>} 异步对象
     */
    var __proxyMap = {};
    function request(type, singleProxy) {
        var _this = this;
        if (singleProxy === void 0) { singleProxy = false; }
        if (singleProxy) {
            if (__proxyMap[type.moddo]) {
                return __proxyMap[type.moddo];
            }
        }
        var promise = new Promise(function (resolve, reject) {
            var proxy = new SingleProxy(type);
            proxy.addEventListener(meru.ProxyEvent.RESPONSE_SUCCEED, function (e) {
                if (false) {
                    try {
                        resolve(e.responseData);
                    }
                    catch (e) { }
                }
                if (true) {
                    resolve(e.responseData);
                }
                if (singleProxy) {
                    delete __proxyMap[type.moddo];
                }
            }, _this);
            proxy.addEventListener(meru.ProxyEvent.ERROR, function (e) {
                if (false) {
                    try {
                        reject(e);
                    }
                    catch (e) { }
                }
                if (true) {
                    reject(e);
                }
                if (singleProxy) {
                    delete __proxyMap[type.moddo];
                }
            }, _this);
            proxy.load();
        });
        __proxyMap[type.moddo] = promise;
        return promise;
    }
    meru.request = request;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/14.
 */
var meru;
(function (meru) {
    var Button = (function (_super) {
        __extends(Button, _super);
        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个按钮实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        function Button() {
            var _this = _super.call(this) || this;
            _this._notice = '';
            _this._data = null;
            _this._dataMapArr = [];
            /**
             * @language en_US
             * [SkinPart] A skin part that defines the label of the button.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * [SkinPart] 按钮上的文本标签。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            _this.labelDisplay = null;
            /**
             * @private
             */
            _this._label = "";
            /**
             * @language en_US
             * [SkinPart] A skin part that defines an optional icon for the button.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * [SkinPart] 按钮上的图标显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            _this.iconDisplay = null;
            /**
             * @private
             */
            _this._icon = null;
            /**
             * @private
             * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
             */
            _this.touchCaptured = false;
            _this._isStop = false;
            _this._pt = new meru.Vec2d();
            _this._pt2 = new meru.Vec2d();
            _this.touchChildren = false;
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onEnter, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onExit, _this);
            return _this;
        }
        Button.prototype.onExit = function () {
            meru.removePullObject(meru.k.GET_BUTTON, this.getButton, this);
        };
        Button.prototype.onEnter = function () {
            meru.addPullObject(meru.k.GET_BUTTON, this.getButton, this);
        };
        Button.prototype.getButton = function (name) {
            if (meru.display.isVisible(this) && this.name == name) {
                return this;
            }
        };
        Object.defineProperty(Button.prototype, "notice", {
            get: function () {
                return this._notice;
            },
            set: function (notice) {
                this._notice = notice;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                if (value != null) {
                    this.addDataMap('data');
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
                this.dataChanged();
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.addDataMap = function (name) {
            if (this._dataMapArr.indexOf(name) == -1) {
                this._dataMapArr.push(name);
            }
        };
        Button.prototype.dataChanged = function () {
        };
        Object.defineProperty(Button.prototype, "label", {
            /**
             * @language en_US
             * Text to appear on the Button control.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要在按钮上显示的文本。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._label = value;
                if (this.labelDisplay) {
                    this.labelDisplay.text = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "icon", {
            /**
             * @language en_US
             * Icon to appear on the Button control.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要在按钮上显示的图标数据
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._icon;
            },
            set: function (value) {
                this._icon = value;
                if (this.iconDisplay) {
                    this.setIconSource(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language en_US
         * This method handles the touch events
         * @param  The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触碰事件处理。
         * @param event 事件 <code>egret.TouchEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.onTouchBegin = function (event) {
            this._isStop = false;
            this._pt.x = event.stageX;
            this._pt.y = event.stageY;
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        };
        Button.prototype.onStageTouchMove = function (e) {
            this._pt2.x = e.stageX;
            this._pt2.y = e.stageY;
            if (this._pt2.distance(this._pt) > 12) {
                var stage = e.currentTarget;
                this._isStop = true;
                stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
                stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
                this.onTouchEnd(e);
            }
        };
        /**
         * @private
         * 舞台上触摸弹起事件
         */
        Button.prototype.onStageTouchEnd = function (event) {
            var stage = event.currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            if (this.contains(event.target)) {
                this.buttonReleased();
                if (this.name) {
                    meru.postNotification(meru.k.CLICK_BUTTON, this.name, this);
                }
            }
            this.onTouchEnd(event);
        };
        Button.prototype.onTouchEnd = function (event) {
            this.touchCaptured = false;
            this.invalidateState();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.getCurrentState = function () {
            var oldState = this.skin.currentState;
            var newState = 'up';
            if (!this.enabled)
                newState = "disabled";
            if (this.touchCaptured)
                newState = "down";
            if (this.skin.hasState(newState)) {
                return newState;
            }
            return oldState;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.partAdded = function (partName, instance) {
            if (instance === this.labelDisplay) {
                this.labelDisplay.text = this._label;
            }
            else if (instance == this.iconDisplay) {
                this.setIconSource(this._icon);
            }
        };
        Button.prototype.setIconSource = function (icon) {
            if (this.iconDisplay && is.truthy(icon)) {
                this.iconDisplay.source = icon;
                this.iconDisplay.includeInLayout = this.iconDisplay.visible = true;
            }
            else if (this.iconDisplay) {
                this.iconDisplay.includeInLayout = this.iconDisplay.visible = false;
            }
        };
        Button.prototype.destoryData = function () {
            while (this._dataMapArr.length) {
                this[this._dataMapArr.shift()] = null;
            }
        };
        /**
         * @language en_US
         * This method is called when handling a <code>egret.TouchEvent.TOUCH_END</code> event
         * when the user touches on the button. It is only called when the button
         * is the target and when <code>touchCaptured</code> is <code>true</code>.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当在用户单击按钮之后处理 <code>egret.TouchEvent.TOUCH_END</code> 事件时，将调用此方法。
         * 仅当以按钮为目标，并且 <code>touchCaptured</code> 为 <code>true</code> 时，才会调用此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.buttonReleased = function () {
            if (is.truthy(this._notice)) {
                var data = this.data;
                if (!data) {
                    var host = meru.display.getHostComponent(this);
                    if (host) {
                        data = host.data;
                    }
                }
                meru.postNotification(meru.str.formatNotice(this._notice), data, host, this);
            }
        };
        return Button;
    }(eui.Component));
    meru.Button = Button;
    __reflect(Button.prototype, "meru.Button");
    var Button2 = (function (_super) {
        __extends(Button2, _super);
        function Button2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._lightable = true;
            return _this;
        }
        Button2.getLightFilter = function () {
            if (!Button2.__lightFilter) {
                Button2.__lightFilter = new egret.ColorMatrixFilter([
                    1.4, 0, 0, 0, 0,
                    0, 1.4, 0, 0, 0,
                    0, 0, 1.4, 0, 0,
                    0, 0, 0, 1.4, 0
                ]);
            }
            return Button2.__lightFilter;
        };
        Object.defineProperty(Button2.prototype, "lightable", {
            get: function () {
                return this._lightable;
            },
            set: function (val) {
                this._lightable = val;
            },
            enumerable: true,
            configurable: true
        });
        Button2.prototype.onTouchBegin = function (e) {
            _super.prototype.onTouchBegin.call(this, e);
            if (this.lightable) {
                this.filters = [Button2.getLightFilter()];
            }
        };
        Button2.prototype.onTouchEnd = function (e) {
            _super.prototype.onTouchEnd.call(this, e);
            if (this.lightable) {
                this.filters = [];
            }
        };
        Button2.prototype.onStageTouchEnd = function (e) {
            _super.prototype.onStageTouchEnd.call(this, e);
            if (this.lightable) {
                this.filters = [];
            }
        };
        return Button2;
    }(Button));
    meru.Button2 = Button2;
    __reflect(Button2.prototype, "meru.Button2");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/29.
 */
var meru;
(function (meru) {
    /**
     * 通知对象,服务于通知侦听相关的全局方法
     */
    var Notification = (function (_super) {
        __extends(Notification, _super);
        function Notification() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 发送通知
         * @param name 通知名称
         * @param args 通知参数列表
         */
        Notification.prototype.postNotification = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.postTypeNoticetion(name, args);
            this.postTypeNoticetion('ALL', [name].concat(args));
        };
        Notification.prototype.postTypeNoticetion = function (name, args) {
            var observers = this._nameObservers[name];
            if (observers) {
                var arr = [];
                for (var key in observers) {
                    var observerArr = observers[key];
                    arr = arr.concat(observerArr);
                }
                arr.sort(function (a, b) {
                    return b.priority - a.priority;
                });
                for (var i = 0; i < arr.length; i++) {
                    arr[i].sender.apply(arr[i].context, args);
                }
            }
        };
        return Notification;
    }(meru.BaseNotification));
    meru.Notification = Notification;
    __reflect(Notification.prototype, "meru.Notification");
    /**
     * 注册通知侦听
     * @param name 通知名称
     * @param sender 通知回调函数
     * @param context 通知回调对象
     */
    function addNotification(name, sender, context, priority) {
        if (priority === void 0) { priority = 0; }
        meru.singleton(Notification).addObserver(name, sender, context, priority);
    }
    meru.addNotification = addNotification;
    function onceNotification(name, sender, context, priority) {
        if (priority === void 0) { priority = 0; }
        meru.singleton(Notification).onceObserver(name, sender, context, priority);
    }
    meru.onceNotification = onceNotification;
    /**
     * 移除通知侦听
     * @param name 通知名称
     * @param sender 通知回调函数
     * @param context 通知回调对象
     */
    function removeNotification(name, sender, context) {
        meru.singleton(Notification).removeObserver(name, sender, context);
    }
    meru.removeNotification = removeNotification;
    /**
     * 发送通知
     * @param name 通知名称
     * @param args 通知参数列表
     */
    function postNotification(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var notification = meru.singleton(Notification);
        notification.postNotification.apply(notification, [name].concat(args));
    }
    meru.postNotification = postNotification;
    /**
     * 移除指定回调对象的所有通知侦听
     * @param obj 待移除侦听的回调对象
     */
    function removeNotificationByTarget(obj) {
        meru.singleton(Notification).removeObserverByObject(obj);
    }
    meru.removeNotificationByTarget = removeNotificationByTarget;
    /**
     * 移除指定通知名称的所有通知侦听
     * @param name 待移除侦听的通知名称
     */
    function removeNotificationByName(name) {
        meru.singleton(Notification).removeObserverByName(name);
    }
    meru.removeNotificationByName = removeNotificationByName;
    function removeNoticeAndPullByTarget(obj) {
        removeNotificationByTarget(obj);
        meru.removePullObjectByTarget(obj);
    }
    meru.removeNoticeAndPullByTarget = removeNoticeAndPullByTarget;
})(meru || (meru = {}));
var meru;
(function (meru) {
    var PullObject = (function (_super) {
        __extends(PullObject, _super);
        function PullObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PullObject.prototype.pullObject = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var ret = this._pullObject(name, args, 0);
            args[0] = ret;
            ret = this._pullObject('ALL', [name].concat(args), 1);
            return ret;
        };
        PullObject.prototype._pullObject = function (name, args, idx) {
            if (idx === void 0) { idx = 0; }
            var observers = this._nameObservers[name];
            for (var key in observers) {
                var observerArr = observers[key];
                for (var i = 0; i < observerArr.length; i++) {
                    var observer = observerArr[i];
                    var r = observer.sender.apply(observer.context, args);
                    if (typeof (r) != 'undefined') {
                        args[idx] = r;
                    }
                }
            }
            return args[idx];
        };
        return PullObject;
    }(meru.BaseNotification));
    meru.PullObject = PullObject;
    __reflect(PullObject.prototype, "meru.PullObject");
    /**
     * 添加对象拉取侦听
     * @param name 拉取对象名
     * @param sender 拉取回调函数
     * @param context 拉取回调对象
     */
    function addPullObject(name, sender, context, priority) {
        if (priority === void 0) { priority = 0; }
        meru.singleton(PullObject).addObserver(name, sender, context, priority);
    }
    meru.addPullObject = addPullObject;
    /**
     * 移除对象拉取侦听
     * @param name 拉取对象名
     * @param sender 拉取回调函数
     * @param context 拉取回调对象
     */
    function removePullObject(name, sender, context) {
        meru.singleton(PullObject).removeObserver(name, sender, context);
    }
    meru.removePullObject = removePullObject;
    /**
     * 拉取对象
     * @param name 拉取对象名
     * @param defaultValue 默认值
     * @returns {T} 当不存在该拉取对象时会返回默认值
     */
    function pullObject(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = meru.singleton(PullObject)).pullObject.apply(_a, [name].concat(args));
        var _a;
    }
    meru.pullObject = pullObject;
    /**
     * 移除指定对象所有的拉取对象侦听
     * @param context 待移除侦听的回调对象
     */
    function removePullObjectByTarget(context) {
        meru.singleton(PullObject).removeObserverByObject(context);
    }
    meru.removePullObjectByTarget = removePullObjectByTarget;
    /**
     * 移除指定侦听名的所有拉取对象侦听
     * @param name 待移除侦听的名称
     */
    function removePullObjectByName(name) {
        meru.singleton(PullObject).removeObserverByName(name);
    }
    meru.removePullObjectByName = removePullObjectByName;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/26.
 */
var meru;
(function (meru) {
    /**
     * 对象池
     */
    var Pool = (function () {
        function Pool(type) {
            /**
             * @private
             */
            this._totalArr = [];
            /**
             * @private
             */
            this._useArr = [];
            /**
             * @private
             */
            this._leftArr = [];
            this._type = type;
        }
        /**
         * 回收对象,当不需要使用对象池创建的对象时,使用该方法回收对象
         * @param inst
         */
        Pool.prototype.push = function (inst) {
            meru.array.remove(this._useArr, inst);
            if (this._leftArr.indexOf(inst) == -1) {
                this._leftArr.push(inst);
            }
        };
        /**
         * 拉取对象,如果对象池中不存在任何可供使用的对象,则会创建出新的对象
         * @param args 初始化对象的参数列表
         * @returns {any}
         */
        Pool.prototype.pop = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this._leftArr.length == 0) {
                var inst = new this._type();
                this._leftArr.push(inst);
                this._totalArr.push(inst);
            }
            var ret = this._leftArr.shift();
            if (is.fun(ret.init)) {
                ret.init.apply(ret, args);
            }
            this._useArr.push(ret);
            return ret;
        };
        /**
         * 获取指定类型的对象池
         * @param type 对象类型
         * @returns {any} 对象池对象
         */
        Pool.getPool = function (type) {
            var typeId = meru.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId)) {
                this._poolMap[typeId] = new Pool(type);
            }
            return this._poolMap[typeId];
        };
        Pool.getTypePool = function (name, type) {
            var typeId = name + meru.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId)) {
                this._poolMap[typeId] = new Pool(type);
            }
            return this._poolMap[typeId];
        };
        Pool._poolMap = {};
        return Pool;
    }());
    meru.Pool = Pool;
    __reflect(Pool.prototype, "meru.Pool");
    /**
     * 获取指定类型的对象池
     * @includeExample getPool.ts
     * @param type 指定的类型
     * @returns {Pool<T>} 类型对象池
     */
    function getPool(type) {
        return Pool.getPool(type);
    }
    meru.getPool = getPool;
    /**
     * 获取指定分组的类型对象池
     * @param name 组名
     * @param type 指定类型
     * @returns {any} 类型对象池
     * @includeExample getTypePool.ts
     */
    function getTypePool(name, type) {
        return Pool.getTypePool(name, type);
    }
    meru.getTypePool = getTypePool;
})(meru || (meru = {}));
/**
 *
 * Created by brucex on 16/8/3.
 */
var meru;
(function (meru) {
    var BaseData = (function (_super) {
        __extends(BaseData, _super);
        function BaseData(skinName) {
            if (skinName === void 0) { skinName = null; }
            var _this = _super.call(this) || this;
            _this._skinDataMap = {};
            _this._patternDataMap = {};
            _this._skinName = skinName;
            _this.init();
            return _this;
        }
        Object.defineProperty(BaseData.prototype, "name", {
            get: function () {
                return this.getName();
            },
            enumerable: true,
            configurable: true
        });
        BaseData.prototype.getName = function () {
            return '';
        };
        BaseData.prototype.getModelByName = function (name) {
            if (this.name == name) {
                return this;
            }
            return null;
        };
        BaseData.prototype.getData = function (skinName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (skinName == this._skinName) {
                return this;
            }
            var dataItem = this.scanDataItem(skinName);
            if (dataItem != null) {
                return dataItem.obj[dataItem.key].apply(this, args);
            }
        };
        BaseData.prototype.getModel = function (type) {
            if (egret.is(this, type.prototype.__class__)) {
                return this;
            }
            return null;
        };
        BaseData.prototype.scanDataItem = function (skinName) {
            if (this._skinDataMap.hasOwnProperty(skinName)) {
                return { obj: this._skinDataMap, key: skinName };
            }
            else {
                for (var pattern in this._patternDataMap) {
                    if (this.isMatch(pattern, skinName)) {
                        return { obj: this._patternDataMap, key: pattern };
                    }
                }
            }
            return null;
        };
        BaseData.prototype.isMatch = function (pattern, skinName) {
            var p = '^';
            for (var i = 0; i < pattern.length; i++) {
                var str = pattern[i];
                if (str == '*') {
                    p += '.*';
                }
                else if (str == '?') {
                    p += '.{0,1}';
                }
                else {
                    p += str;
                }
            }
            p += '$';
            return skinName.match(p) != null;
        };
        BaseData.prototype.has = function (skinName) {
            if (this._skinName == skinName) {
                return true;
            }
            return this.scanDataItem(skinName) != null;
        };
        BaseData.prototype.slot = function (skinName, fun) {
            var _this = this;
            var obj = (skinName.indexOf('?') > -1 ||
                skinName.indexOf('*') > -1) ? this._patternDataMap : this._skinDataMap;
            if (is.fun(fun)) {
                obj[skinName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return fun.apply(_this, args);
                };
            }
            else {
                obj[skinName] = function () {
                    return fun;
                };
            }
        };
        BaseData.prototype.init = function () {
        };
        return BaseData;
    }(egret.EventDispatcher));
    meru.BaseData = BaseData;
    __reflect(BaseData.prototype, "meru.BaseData", ["meru.IData"]);
    var GroupData = (function (_super) {
        __extends(GroupData, _super);
        function GroupData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupData.prototype.sub = function (model) {
            this.models.push(model);
        };
        GroupData.prototype.getModel = function (type) {
            var obj = _super.prototype.getModel.call(this, type);
            if (obj) {
                return obj;
            }
            for (var i = 0; i < this.models.length; i++) {
                obj = this.models[i].getModel(type);
                if (obj) {
                    return obj;
                }
            }
            return null;
        };
        GroupData.prototype.getModelByName = function (name) {
            var obj = this.getModelByName(name);
            if (obj) {
                return obj;
            }
            for (var i = 0; i < this.models.length; i++) {
                obj = this.models[i].getModelByName(name);
                if (obj) {
                    return obj;
                }
            }
            return obj;
        };
        GroupData.prototype.getData = function (skinName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var obj = _super.prototype.getData.apply(this, [skinName].concat(args));
            if (is.undefined(obj)) {
                for (var i = 0; i < this.models.length; i++) {
                    obj = (_a = this.models[i]).getData.apply(_a, [skinName].concat(args));
                    if (!is.undefined(obj)) {
                        return obj;
                    }
                }
            }
            return obj;
            var _a;
        };
        GroupData.prototype.has = function (skinName) {
            var r = _super.prototype.has.call(this, skinName);
            if (r) {
                return r;
            }
            for (var i = 0; i < this.models.length; i++) {
                if (this.models[i].has(skinName)) {
                    return true;
                }
            }
            return false;
        };
        Object.defineProperty(GroupData.prototype, "models", {
            get: function () {
                if (!this._modelArr) {
                    this._modelArr = [];
                }
                return this._modelArr;
            },
            enumerable: true,
            configurable: true
        });
        return GroupData;
    }(BaseData));
    meru.GroupData = GroupData;
    __reflect(GroupData.prototype, "meru.GroupData");
    var BaseMutation = (function () {
        function BaseMutation() {
            this._methodMap = {};
            this.init();
        }
        BaseMutation.prototype.on = function (notice, fun) {
            var _this = this;
            this._methodMap[notice] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                fun.apply(_this, args);
            };
        };
        BaseMutation.prototype.getMutation = function (type) {
            if (egret.is(this, type.prototype.__class__)) {
                return this;
            }
            return null;
        };
        BaseMutation.prototype.onNotice = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this._methodMap[type]) {
                (_a = this._methodMap)[type].apply(_a, args);
            }
            var _a;
        };
        BaseMutation.prototype.hasNotice = function (type) {
            return this._methodMap.hasOwnProperty(type);
        };
        BaseMutation.prototype.init = function () {
        };
        return BaseMutation;
    }());
    meru.BaseMutation = BaseMutation;
    __reflect(BaseMutation.prototype, "meru.BaseMutation", ["meru.IMutation"]);
    var GroupMutation = (function (_super) {
        __extends(GroupMutation, _super);
        function GroupMutation() {
            return _super.call(this) || this;
        }
        GroupMutation.prototype.onNotice = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            _super.prototype.onNotice.apply(this, [type].concat(args));
            var len = this.mutations.length;
            for (var i = 0; i < len; i++) {
                var item = this.mutations[i];
                if (item.hasNotice(type)) {
                    item.onNotice.apply(item, [type].concat(args));
                }
            }
        };
        GroupMutation.prototype.getModel = function (type) {
            var obj = _super.prototype.getMutation.call(this, type);
            if (obj) {
                return obj;
            }
            for (var i = 0; i < this._mutationArr.length; i++) {
                obj = this._mutationArr[i].getMutation(type);
                if (obj) {
                    return obj;
                }
            }
            return null;
        };
        GroupMutation.prototype.hasNotice = function (type) {
            return true;
        };
        Object.defineProperty(GroupMutation.prototype, "mutations", {
            get: function () {
                if (!this._mutationArr) {
                    this._mutationArr = [];
                }
                return this._mutationArr;
            },
            enumerable: true,
            configurable: true
        });
        GroupMutation.prototype.sub = function (mutation) {
            this.mutations.push(mutation);
        };
        GroupMutation.prototype.init = function () {
        };
        return GroupMutation;
    }(BaseMutation));
    meru.GroupMutation = GroupMutation;
    __reflect(GroupMutation.prototype, "meru.GroupMutation");
    var Struct = (function () {
        function Struct(name) {
            this._name = name;
        }
        Object.defineProperty(Struct.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Struct.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (val) {
                this._data = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Struct.prototype, "mutation", {
            get: function () {
                return this._mutation;
            },
            set: function (val) {
                this._mutation = val;
            },
            enumerable: true,
            configurable: true
        });
        return Struct;
    }());
    meru.Struct = Struct;
    __reflect(Struct.prototype, "meru.Struct");
    function propertyChange(obj) {
        var propList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            propList[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < propList.length; i++) {
            eui.PropertyEvent.dispatchPropertyEvent(obj, eui.PropertyEvent.PROPERTY_CHANGE, propList[i]);
        }
    }
    meru.propertyChange = propertyChange;
    function dependProperty(host, obj, chain, watchers) {
        if (chain === void 0) { chain = []; }
        if (watchers === void 0) { watchers = []; }
        var register = function (host, chain, dependProperty) {
            var w = eui.Binding.bindHandler(host, chain, function () {
                var obj = host;
                if (is.fun(dependProperty)) {
                    dependProperty();
                }
                else {
                    var pArr2 = dependProperty.split('.');
                    var len2 = pArr2.length;
                    if (pArr2.length > 1) {
                        var idx = 0;
                        while (obj && idx <= len2 - 2) {
                            obj = obj[pArr2[idx]];
                            idx++;
                        }
                    }
                    eui.PropertyEvent.dispatchPropertyEvent(obj, eui.PropertyEvent.PROPERTY_CHANGE, pArr2[len2 - 1]);
                }
            }, this);
            watchers.push(w);
        };
        for (var key in obj) {
            var val = obj[key];
            if (typeof (val) == 'string') {
                val = [val];
            }
            var newChain = chain.concat(key);
            if (Array.isArray(val)) {
                var len = val.length;
                while (len--) {
                    register(host, newChain.concat([]), val[len]);
                }
            }
            else {
                dependProperty(host, val, newChain, watchers);
            }
        }
        return watchers;
    }
    meru.dependProperty = dependProperty;
    function changeDataProperty(host, name) {
        if (host['$_' + name]) {
            host['$_' + name] = null;
        }
        meru.propertyChange(host, name);
    }
    meru.changeDataProperty = changeDataProperty;
    function getDataProperty(host, name, type) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (!host['$_' + name]) {
            args = args.map(function (item) {
                if (is.fun(item)) {
                    return item();
                }
                return item;
            });
            host['$_' + name] = new (type.bind.apply(type, [void 0].concat(args)))();
        }
        return host['$_' + name];
    }
    meru.getDataProperty = getDataProperty;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/3.
 */
var meru;
(function (meru) {
    var StructCenter = (function () {
        function StructCenter() {
        }
        StructCenter.init = function () {
            if (!this._intialized) {
                this._intialized = true;
                meru.addNotification("ALL", this.onListener, this);
                meru.addPullObject('getSkinData', this.pullObject, this);
                meru.addPullObject('ALL', this.getAllData, this);
            }
        };
        StructCenter.onListener = function (type) {
            var argArr = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argArr[_i - 1] = arguments[_i];
            }
            var skip = meru.pullObject.apply(meru, [meru.k.SKIP_MUTATION, type].concat(argArr));
            if (skip === true) {
                return;
            }
            var args = type.split('|');
            var arr = args[0].split('.');
            args = [args.slice(1).join('|')];
            if (arr.length >= 2) {
                if (this._moduleMap.hasOwnProperty(arr[0])) {
                    var d = this._moduleMap[arr[0]];
                    args = [arr.slice(1).join('.')].concat(argArr, args);
                    d.mutation.onNotice.apply(d.mutation, args);
                }
            }
            else {
                if (this._moduleMap.hasOwnProperty('COMMON')) {
                    var d = this._moduleMap['COMMON'];
                    args = [arr[0]].concat(argArr, args);
                    d.mutation.onNotice.apply(d.mutation, args);
                }
            }
        };
        StructCenter.getAllData = function (type) {
            var argArr = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argArr[_i - 1] = arguments[_i];
            }
            var arr = type.split('.');
            if (arr.length >= 2) {
                if (this._moduleMap.hasOwnProperty(arr[0]) && this._moduleMap[arr[0]].data) {
                    var d = this._moduleMap[arr[0]];
                    argArr = [arr.slice(1).join('.')].concat(argArr);
                    return d.data.getData.apply(d.data, argArr);
                }
            }
        };
        StructCenter.pullObject = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var key in this._moduleMap) {
                var d = this._moduleMap[key].data;
                if (d && d.has(args[0])) {
                    return d.getData.apply(d, args);
                }
            }
            return null;
        };
        StructCenter.getData = function (type) {
            var typeId = meru.getTypeId(type);
            if (!this._dataMap.hasOwnProperty(typeId)) {
                for (var key in this._moduleMap) {
                    var data = this._moduleMap[key];
                    if (data.data) {
                        var obj = data.data.getModel(type);
                        if (obj) {
                            this._dataMap[typeId] = obj;
                            break;
                        }
                    }
                }
            }
            return this._dataMap[typeId];
        };
        StructCenter.getMutation = function (type) {
            var typeId = meru.getTypeId(type);
            if (!this._mutationMap.hasOwnProperty(typeId)) {
                for (var key in this._moduleMap) {
                    var data = this._moduleMap[key];
                    if (data.mutation) {
                        var obj = data.mutation.getMutation(type);
                        if (obj) {
                            this._mutationMap[typeId] = obj;
                            break;
                        }
                    }
                }
            }
            return this._mutationMap[typeId];
        };
        StructCenter.getStruct = function (name) {
            return this._moduleMap[name];
        };
        StructCenter.injectionData = function (moduleName, data) {
            this.init();
            if (!this._moduleMap.hasOwnProperty(moduleName)) {
                this._moduleMap[moduleName] = new meru.Struct(moduleName);
            }
            this._moduleMap[moduleName].data = new data();
        };
        StructCenter.injectionMutation = function (moduleName, mutation) {
            this.init();
            if (!this._moduleMap.hasOwnProperty(moduleName)) {
                this._moduleMap[moduleName] = new meru.Struct(moduleName);
            }
            this._moduleMap[moduleName].mutation = new mutation();
        };
        StructCenter._moduleMap = {};
        StructCenter._intialized = false;
        StructCenter._dataMap = {};
        StructCenter._mutationMap = {};
        return StructCenter;
    }());
    meru.StructCenter = StructCenter;
    __reflect(StructCenter.prototype, "meru.StructCenter");
    function injectionData(moduleName, data) {
        StructCenter.injectionData(moduleName, data);
    }
    meru.injectionData = injectionData;
    function injectionMutation(moduleName, data) {
        StructCenter.injectionMutation(moduleName, data);
    }
    meru.injectionMutation = injectionMutation;
    function getStruct(name) {
        return StructCenter.getStruct(name);
    }
    meru.getStruct = getStruct;
    function getDataSlot(type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return StructCenter.pullObject.apply(StructCenter, [type].concat(args));
    }
    meru.getDataSlot = getDataSlot;
    function notifyDataChange(host) {
        var propertys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            propertys[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < propertys.length; i++) {
            eui.PropertyEvent.dispatchPropertyEvent(host, eui.PropertyEvent.PROPERTY_CHANGE, propertys[i]);
        }
    }
    meru.notifyDataChange = notifyDataChange;
    function getMutation(type) {
        return StructCenter.getMutation(type);
    }
    meru.getMutation = getMutation;
    function getData(type) {
        return StructCenter.getData(type);
    }
    meru.getData = getData;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/13.
 */
var meru;
(function (meru) {
    var factory = (function () {
        function factory() {
            this._classList = [];
        }
        factory.prototype.injection = function (types, classType, priority) {
            var info = { types: types.split(' '), classType: classType, priority: priority };
            this._classList.push(info);
            this._classList.sort(function (a, b) {
                return b.priority - a.priority;
            });
        };
        factory.prototype.checkValue = function (item, key) {
            var keyArr = key.split('=');
            if (keyArr.length > 1) {
                return meru.object.getValue(item, keyArr[0]) == keyArr[1];
            }
            else {
                return meru.object.hasValue(item, keyArr[0]);
            }
        };
        factory.prototype.getClass = function (objItem) {
            var _this = this;
            var ret;
            if (is.string(objItem)) {
                ret = meru.array.find(this._classList, function (item) {
                    return item.types.every(function (key) {
                        return key.split('|').indexOf(objItem) > -1;
                    });
                });
            }
            else {
                ret = meru.array.find(this._classList, function (item) {
                    return item.types.every(function (key) {
                        if (key.indexOf("|") > -1) {
                            var arr = key.split("|");
                            return arr.some(function (subKey) {
                                return _this.checkValue(objItem, subKey);
                            });
                        }
                        else {
                            return _this.checkValue(objItem, key);
                        }
                    });
                });
            }
            if (is.truthy(ret)) {
                return ret.classType;
            }
            return null;
        };
        /**
         * 通过给定的数据对象,获取类型
         * @param name 类型工厂名称
         * @param object 数据对象
         * @includeExample getClass.ts
         * @returns {any}
         */
        factory.get = function (name, object) {
            return meru.typeSingleton(name, factory).getClass(object);
        };
        /**
         * 通过给定的数据对象,获取实现
         * @param name 类型工厂名称
         * @param object 数据对象
         * @param args 构建参数列表
         * @returns {T} 实例
         */
        factory.instance = function (name, object) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var t = this.get(name, object);
            if (t) {
                return new (t.bind.apply(t, [void 0].concat(args)))();
            }
            return null;
        };
        /**
         * 注入类型到类型工厂
         * @param name 类型工厂名称
         * @param types 类型关键字
         * @includeExample injectionClass.ts
         * @param classType 类型
         */
        factory.injection = function (name, types, classType, priority) {
            if (priority === void 0) { priority = 1; }
            meru.typeSingleton(name, factory).injection(types, classType, priority);
        };
        return factory;
    }());
    meru.factory = factory;
    __reflect(factory.prototype, "meru.factory");
})(meru || (meru = {}));
// var __egret_register = egret.registerClass;
// egret.registerClass = function(type:any, className:string, interfaceNames?:string[]) {
//     type.__meru_class__ = className;
//     __egret_register(type, className, interfaceNames);
// }
/**
 * Created by brucex on 16/7/7.
 */
var meru;
(function (meru) {
    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    function getDefinitionType(name, defaultType) {
        if (is.truthy(name)) {
            var t = egret.getDefinitionByName(name);
            if (is.truthy(t)) {
                return t;
            }
        }
        return defaultType;
    }
    meru.getDefinitionType = getDefinitionType;
    /**
     * 获取指定类的实例
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    function getDefinitionInstance(name, defaultType) {
        if (defaultType === void 0) { defaultType = null; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var define = getDefinitionType(name, defaultType);
        if (is.truthy(define)) {
            return new (define.bind.apply(define, [void 0].concat(args)))();
        }
        return null;
    }
    meru.getDefinitionInstance = getDefinitionInstance;
})(meru || (meru = {}));
var meru;
(function (meru) {
    var _type_id_ = 1;
    var _type_key_name = "__meru_type_id__";
    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    function getTypeId(type) {
        if (!type.hasOwnProperty(_type_key_name)) {
            type[_type_key_name] = _type_id_++;
        }
        return type[_type_key_name];
    }
    meru.getTypeId = getTypeId;
    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type) {
        return is.truthy(type) && type.hasOwnProperty(_type_key_name);
    }
    meru.hasTypeId = hasTypeId;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/19.
 */
var meru;
(function (meru) {
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CheckBox;
    }(meru.ToggleButton));
    meru.CheckBox = CheckBox;
    __reflect(CheckBox.prototype, "meru.CheckBox");
})(meru || (meru = {}));
/**
 * Created by brucex on 9/24/15.
 */
var meru;
(function (meru) {
    var localStorage = (function () {
        function localStorage() {
        }
        localStorage.setPrefix = function (prefix) {
            this._prefix = prefix;
            this._enable = egret.localStorage.setItem("enabled", "1");
        };
        localStorage.isSetPrefix = function () {
            return this._prefix != null;
        };
        localStorage.check = function () {
            if (this._prefix == null) {
                throw new Error("请设置 localStorage.setPrefix");
            }
        };
        localStorage.getItemKey = function (key) {
            key = this._prefix + "-" + key;
            return key;
        };
        localStorage.getItem = function (key, defVal) {
            if (defVal === void 0) { defVal = null; }
            this.check();
            if (this._enable) {
                return egret.localStorage.getItem(this.getItemKey(key)) || defVal;
            }
            else {
                return this._localStorage[this.getItemKey(key)] || defVal;
            }
        };
        localStorage.setItem = function (key, val) {
            this.check();
            if (this._enable) {
                egret.localStorage.setItem(this.getItemKey(key), val);
            }
            else {
                this._localStorage[this.getItemKey(key)] = val;
            }
        };
        localStorage.removeItem = function (key) {
            this.check();
            if (this._enable) {
                egret.localStorage.removeItem(this.getItemKey(key));
            }
            else {
                delete this._localStorage[this.getItemKey(key)];
            }
        };
        localStorage.getUserKey = function (key) {
            var id = meru.getCache("i.id");
            key = this._prefix + '-' + id + '-' + key;
            return key;
        };
        localStorage.getUserItem = function (key, defVal) {
            if (defVal === void 0) { defVal = null; }
            this.check();
            if (this._enable) {
                return egret.localStorage.getItem(this.getUserKey(key)) || defVal;
            }
            else {
                return this._localStorage[this.getUserKey(key)] || defVal;
            }
        };
        localStorage.setUserItem = function (key, val) {
            this.check();
            if (this._enable) {
                egret.localStorage.setItem(this.getUserKey(key), val);
            }
            else {
                this._localStorage[this.getUserKey(key)] = val;
            }
        };
        localStorage.removeUserItem = function (key) {
            this.check();
            if (this._enable) {
                egret.localStorage.removeItem(this.getUserKey(key));
            }
            else {
                delete this._localStorage[this.getUserKey(key)];
            }
        };
        localStorage._prefix = null;
        localStorage._enable = true;
        localStorage._localStorage = {};
        return localStorage;
    }());
    meru.localStorage = localStorage;
    __reflect(localStorage.prototype, "meru.localStorage");
})(meru || (meru = {}));
/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
* Digest Algorithm, as defined in RFC 1321.
* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
* Distributed under the BSD License
* See http://pajhome.org.uk/crypt/md5 for more info.
*/
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var meru;
(function (meru) {
    var md5 = (function () {
        function md5() {
            this.hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
            this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        }
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
        md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
        /*
         * Perform a simple self-test to see if the VM is working
         */
        md5.prototype.md5_vm_test = function () {
            return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        };
        /*
         * Calculate the MD5 of a raw string
         */
        md5.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        md5.prototype.rstr_hmac_md5 = function (key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        /*
         * Convert a raw string to a hex string
         */
        md5.prototype.rstr2hex = function (input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    + hex_tab.charAt(x & 0x0F);
            }
            return output;
        };
        /*
         * Convert a raw string to a base-64 string
         */
        md5.prototype.rstr2b64 = function (input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        };
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        md5.prototype.rstr2any = function (input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        };
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        md5.prototype.str2rstr_utf8 = function (input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        };
        /*
         * Encode a string as utf-16
         */
        md5.prototype.str2rstr_utf16le = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        };
        md5.prototype.str2rstr_utf16be = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            return output;
        };
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        md5.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            return output;
        };
        /*
         * Convert an array of little-endian words to a string
         */
        md5.prototype.binl2rstr = function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            return output;
        };
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        md5.prototype.binl_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        };
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };
        md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };
        md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        md5.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        md5.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return md5;
    }());
    meru.md5 = md5;
    __reflect(md5.prototype, "meru.md5");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/6/15.
 */
var meru;
(function (meru) {
    var PlatformFunType;
    (function (PlatformFunType) {
        PlatformFunType[PlatformFunType["SendToDesktop"] = 1] = "SendToDesktop";
        PlatformFunType[PlatformFunType["TencentLogin"] = 2] = "TencentLogin";
        PlatformFunType[PlatformFunType["InvitorFriend"] = 3] = "InvitorFriend";
        PlatformFunType[PlatformFunType["OpenBBS"] = 4] = "OpenBBS";
        PlatformFunType[PlatformFunType["Share"] = 5] = "Share";
    })(PlatformFunType = meru.PlatformFunType || (meru.PlatformFunType = {}));
    /**
     * 返回当前运行环境的平台对象
     * @returns {null}
     */
    function getPlatform() {
        var platform = meru.extra.platform || "bj";
        return meru.factory.instance('pf', platform);
    }
    meru.getPlatform = getPlatform;
})(meru || (meru = {}));
var meru;
(function (meru) {
    function listenerReport() {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            var errorMap = {};
            window.onerror = function (msg, uri, line, column, errObj) {
                var stackMsg = "" + errObj.stack;
                if (stackMsg.indexOf("onResourceItemComp") == -1 && !errorMap[stackMsg]) {
                    errorMap[stackMsg] = true;
                    meru.request({ "moddo": "User.uploadLog", "params": { "logStr": stackMsg } });
                }
            };
        }
    }
    meru.listenerReport = listenerReport;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/8/10.
 */
var meru;
(function (meru) {
    var res = (function () {
        function res() {
        }
        res.getResVersion = function () {
            var resVer = egret.getOption("resVer");
            var arr = resVer.split('.');
            return arr[0];
        };
        res.getThemeVersion = function () {
            var resVer = egret.getOption("resVer");
            var arr = resVer.split('.');
            return arr[1];
        };
        res.loadRes = function (prefix_path, is_dev_res) {
            if (prefix_path === void 0) { prefix_path = 'resource'; }
            if (is_dev_res === void 0) { is_dev_res = false; }
            var resPath = prefix_path + "/default.res.json";
            if (is_dev_res) {
                resPath = prefix_path + "/default.res_dev.json";
            }
            if (egret.Capabilities.runtimeType != egret.RuntimeType.NATIVE) {
                var resVer = this.getResVersion();
                if (is.truthy(resVer)) {
                    resPath = prefix_path + "/resource_" + resVer + ".json";
                }
            }
            RES.loadConfig(resPath, prefix_path + "/");
        };
        res.loadTheme = function (stage, is_dev_thm, completeFun, context, prefix_path) {
            if (context === void 0) { context = null; }
            if (prefix_path === void 0) { prefix_path = 'resource'; }
            var resPath = prefix_path + "/default.thm.json";
            if (egret.Capabilities.runtimeType != egret.RuntimeType.NATIVE) {
                var resVer = this.getThemeVersion();
                if (is_dev_thm && true) {
                    resPath = prefix_path + "/default.thm_dev.json";
                }
                if (is.truthy(resVer)) {
                    resPath = prefix_path + "/theme_" + resVer + ".json";
                }
            }
            var theme = new eui.Theme(resPath, stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, completeFun, context);
        };
        return res;
    }());
    meru.res = res;
    __reflect(res.prototype, "meru.res");
})(meru || (meru = {}));
/**
 * Created by brucex on 16/9/10.
 */
var meru;
(function (meru) {
    var SeqInfo = (function () {
        function SeqInfo(sel, context) {
            if (context === void 0) { context = null; }
            this._runDone = false;
            this._args = [];
            this._sel = sel;
            this._context = context;
        }
        SeqInfo.prototype.invoke = function () {
            if (this._sel) {
                this._sel.call(this._context, this.callback.bind(this));
            }
        };
        Object.defineProperty(SeqInfo.prototype, "runDone", {
            get: function () {
                return this._runDone;
            },
            set: function (value) {
                this._runDone = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SeqInfo.prototype, "args", {
            get: function () {
                return this._args;
            },
            set: function (value) {
                this._args = value;
            },
            enumerable: true,
            configurable: true
        });
        SeqInfo.prototype.callback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.host) {
                this.runDone = true;
                this._args = args;
                this.host.runDone();
            }
        };
        Object.defineProperty(SeqInfo.prototype, "host", {
            get: function () {
                return this._host;
            },
            set: function (value) {
                this._host = value;
            },
            enumerable: true,
            configurable: true
        });
        return SeqInfo;
    }());
    __reflect(SeqInfo.prototype, "SeqInfo");
    var Seq = (function () {
        function Seq() {
            this._seqArr = [];
            this._seqCount = 0;
        }
        Seq.prototype.run = function (sel, context) {
            if (context === void 0) { context = null; }
            var item = new SeqInfo(sel, context);
            item.host = this;
            this._seqArr.push(item);
            item.invoke();
            return this;
        };
        Seq.prototype.runDone = function () {
            this._seqCount++;
            if (this._seqCount >= this._seqArr.length) {
                if (this._sel) {
                    this._sel.call(this._context, this.getArgs());
                }
            }
        };
        Seq.prototype.getArgs = function () {
            return this._seqArr.map(function (item) { return item.args; });
        };
        Seq.prototype.done = function (sel, context) {
            if (context === void 0) { context = null; }
            this._sel = sel;
            this._context = context;
            return this;
        };
        Seq.run = function (sel, context) {
            if (context === void 0) { context = null; }
            return new Seq().run(sel, context);
        };
        Seq.done = function (sel, context) {
            if (context === void 0) { context = null; }
            return new Seq().done(sel, context);
        };
        return Seq;
    }());
    meru.Seq = Seq;
    __reflect(Seq.prototype, "meru.Seq");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var _singletonMap = {};
    /**
     * 返回指定类型的单例
     * @includeExample singleton.ts
     * @param type 需要单例化的类型
     * @returns {any} 类型的单例
     */
    function singleton(type) {
        var typeId = meru.getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
        }
        return _singletonMap[typeId];
    }
    meru.singleton = singleton;
    /**
     * 返回指定分类的类型单例
     * @param name 分类名称
     * @param type 单例化的类型
     * @includeExample typesingleton.ts
     * @returns {any} 单例对象
     */
    function typeSingleton(name, type) {
        var typeId = name + meru.getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
        }
        return _singletonMap[typeId];
    }
    meru.typeSingleton = typeSingleton;
})(meru || (meru = {}));
/**
 * Created by brucex on 16/5/25.
 */
var meru;
(function (meru) {
    var StopWatch = (function () {
        function StopWatch() {
            this._startTime = this._now();
            this._stopTime = -1;
        }
        StopWatch.prototype.stop = function () {
            this._stopTime = this._now();
        };
        StopWatch.prototype.elapsed = function () {
            if (this._stopTime !== -1) {
                return this._stopTime - this._startTime;
            }
            return this._now() - this._startTime;
        };
        StopWatch.prototype._now = function () {
            return new Date().getTime();
        };
        return StopWatch;
    }());
    meru.StopWatch = StopWatch;
    __reflect(StopWatch.prototype, "meru.StopWatch");
})(meru || (meru = {}));
/**
 *
 * Created by brucex on 16/6/23.
 */
// var __meru_global__ = this;
var meru;
(function (meru) {
    /**
     * 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
     * @param callback 调用的函数
     * @param context 函数的作用域
     * @param time 时间周期
     * @param args 函数参数列表
     * @returns {number} intervalId
     */
    function setInterval(callback, thisObj, time) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        // if (__meru_global__.hasOwnProperty("setInterval")) {
        //     return __meru_global__.setInterval(callback.bind(context), time, ...args);
        // } else {
        return egret.setInterval.apply(egret, [callback, thisObj, time].concat(args));
        // }
    }
    meru.setInterval = setInterval;
    /**
     * 取消由 setInterval() 设置的 timeout
     * @param timeId intervalId
     */
    function clearInterval(timeId) {
        // if (__meru_global__.hasOwnProperty("clearInterval")) {
        //     __meru_global__.clearInterval(timeId);
        // } else {
        egret.clearInterval(timeId);
        // }
    }
    meru.clearInterval = clearInterval;
    /**
     * 方法用于在指定的毫秒数后调用函数或计算表达式。
     * @param callback 调用的函数
     * @param context 函数的作用域
     * @param time 时间周期
     * @param args 函数的参数列表
     * @returns {number} timeoutId
     */
    function setTimeout(callback, thisObj, time) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return egret.setTimeout.apply(egret, [callback, thisObj, time].concat(args));
    }
    meru.setTimeout = setTimeout;
    /**
     * 方法可取消由 setTimeout() 方法设置的 timeout
     * @param timeId timeoutId
     */
    function clearTimeout(timeId) {
        // if (__meru_global__.hasOwnProperty("clearTimeout")) {
        //     __meru_global__.clearTimeout(timeId);
        // } else {
        egret.clearTimeout(timeId);
        // }
    }
    meru.clearTimeout = clearTimeout;
    /**
     * 基于<code>User.getInfo.i.nowTime</code>计算当前剩余时间(倒计时)
     * @param distTime 目标时间戳
     * @returns {number} 剩余秒数
     */
    function getLeftTime(distTime) {
        if (is.truthy(distTime)) {
            var nowTime = meru.getCache("i.nowTime");
            var t = distTime - nowTime;
            return t > 0 ? t : 0;
        }
        return 0;
    }
    meru.getLeftTime = getLeftTime;
    var timestamp = /^\d{10}$|^\d{13}$/;
    /**
     * 指定的时间数值是否为时间戳
     * @param time 时间数值
     * @returns {boolean}
     */
    function isTimestamp(time) {
        return timestamp.test(time.toString());
    }
    meru.isTimestamp = isTimestamp;
})(meru || (meru = {}));
var meru;
(function (meru) {
    var TimeRecorder = (function () {
        function TimeRecorder() {
            this._lastDate = -1;
            this._offsetTime = 0;
            this._tickNum = 0;
        }
        Object.defineProperty(TimeRecorder.prototype, "tickNum", {
            get: function () {
                return this._tickNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeRecorder.prototype, "seconds", {
            get: function () {
                return this._seconds;
            },
            enumerable: true,
            configurable: true
        });
        TimeRecorder.prototype.tick = function () {
            var seconds = 1;
            this._date = new Date();
            var t = this._date.getTime();
            if (this._lastDate != -1) {
                var v = (t - this._lastDate) / 1000;
                seconds = Math.floor(v);
                if (seconds < 1) {
                    seconds = 1;
                }
                this._offsetTime += (v - seconds);
                if (this._offsetTime >= 1) {
                    v = Math.floor(this._offsetTime);
                    seconds += v;
                    this._offsetTime = this._offsetTime - v;
                }
            }
            this._lastDate = t;
            this._tickNum += seconds;
            this._seconds = seconds;
            return seconds;
        };
        return TimeRecorder;
    }());
    meru.TimeRecorder = TimeRecorder;
    __reflect(TimeRecorder.prototype, "meru.TimeRecorder");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var DisplayVehicleInfo = (function () {
        function DisplayVehicleInfo(sel, offsetObj, vehicleArr, context) {
            if (offsetObj === void 0) { offsetObj = DisplayVehicle.emptyOffset; }
            if (vehicleArr === void 0) { vehicleArr = []; }
            if (context === void 0) { context = null; }
            this.sel = sel;
            this.offsetObj = offsetObj;
            this.vehicleArr = vehicleArr;
            this.context = context;
        }
        return DisplayVehicleInfo;
    }());
    meru.DisplayVehicleInfo = DisplayVehicleInfo;
    __reflect(DisplayVehicleInfo.prototype, "meru.DisplayVehicleInfo");
    var DisplayVehicle = (function (_super) {
        __extends(DisplayVehicle, _super);
        function DisplayVehicle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DisplayVehicle.prototype.init = function (display, canRotate) {
            if (canRotate === void 0) { canRotate = true; }
            this._canRotation = canRotate;
            this.x = display.x;
            this.y = display.y;
            this._display = display;
            this._display.visible = false;
            if (display.parent) {
                display.parent.addChild(this);
            }
            display.x = 0;
            display.y = 0;
            this.addChild(display);
            this._vehicle = new meru.Vehicle(this.x, this.y);
            this._vehicle.maxForce = 10;
            this._vehicle.maxSpeed = 10;
        };
        DisplayVehicle.prototype.follow = function (path) {
            var _this = this;
            this.removeEnterEvent();
            var fun = function () {
                if (!path.isComplete) {
                    _this._vehicle.follow(path);
                    _this._vehicle.separate(_this.getInfo().vehicleArr);
                    _this._vehicle.update();
                    _this.render();
                }
            };
            this.addEventListener(egret.Event.ENTER_FRAME, fun, this);
            this._enterFun = fun;
        };
        DisplayVehicle.prototype.arrive = function (target) {
            var _this = this;
            this.removeEnterEvent();
            var fun = function () {
                _this._vehicle.arrive(target);
                _this._vehicle.update();
                _this.render(_this.getInfo().offsetObj);
                if (_this._vehicle.location.distance(target) < 4) {
                    if (_this.getInfo().sel) {
                        _this.getInfo().sel.call(_this.getInfo().context);
                    }
                }
            };
            this.addEventListener(egret.Event.ENTER_FRAME, fun, this);
            this._enterFun = fun;
        };
        DisplayVehicle.prototype.getInfo = function () {
            if (this._info == null) {
                this._info = new DisplayVehicleInfo(null);
            }
            return this._info;
        };
        DisplayVehicle.prototype.setInfo = function (sel, context, vehicleArr, offsetObj) {
            if (context === void 0) { context = null; }
            if (vehicleArr === void 0) { vehicleArr = []; }
            if (offsetObj === void 0) { offsetObj = DisplayVehicle.emptyOffset; }
            this._info = new DisplayVehicleInfo(sel, offsetObj, vehicleArr, context);
        };
        DisplayVehicle.createFromDisplay = function (display, canRotate) {
            if (canRotate === void 0) { canRotate = true; }
            var vehicle = new DisplayVehicle();
            vehicle.init(display, canRotate);
            return vehicle;
        };
        DisplayVehicle.prototype.separate = function (vecArr) {
        };
        DisplayVehicle.prototype.isEqual = function (vehicle) {
            if (vehicle instanceof DisplayVehicle) {
                return this._vehicle == vehicle._vehicle;
            }
            return this._vehicle == vehicle;
        };
        Object.defineProperty(DisplayVehicle.prototype, "radius", {
            get: function () {
                return this._vehicle.radius;
            },
            set: function (radius) {
                this._vehicle.radius = radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "location", {
            get: function () {
                return this._vehicle.location;
            },
            enumerable: true,
            configurable: true
        });
        DisplayVehicle.prototype.render = function (offset) {
            if (offset === void 0) { offset = DisplayVehicle.emptyOffset; }
            this.x = this._vehicle.location.x + offset.x;
            this.y = this._vehicle.location.y + offset.y;
            if (this._canRotation) {
                this.rotation = (this._vehicle.velocity.heading()) * 180 / Math.PI;
            }
            this._display.visible = true;
        };
        DisplayVehicle.prototype.removeEnterEvent = function () {
            if (this._enterFun) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this._enterFun, this);
                this._enterFun = null;
            }
        };
        Object.defineProperty(DisplayVehicle.prototype, "vec", {
            get: function () {
                return this._vehicle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "wanderInfo", {
            get: function () {
                return this._vehicle.wanderInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "cohesionInfo", {
            get: function () {
                return this._vehicle.cohesionInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "alignInfo", {
            get: function () {
                return this._vehicle.alignInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "separationInfo", {
            get: function () {
                return this._vehicle.separationInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "localtion", {
            get: function () {
                return this._vehicle.location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "velocity", {
            get: function () {
                return this._vehicle.velocity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "maxSpeed", {
            get: function () {
                return this._vehicle.maxSpeed;
            },
            set: function (maxSpeed) {
                this._vehicle.maxSpeed = maxSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayVehicle.prototype, "maxForce", {
            get: function () {
                return this._vehicle.maxForce;
            },
            set: function (maxForce) {
                this._vehicle.maxForce = maxForce;
            },
            enumerable: true,
            configurable: true
        });
        DisplayVehicle.prototype.dispose = function () {
            this.removeEnterEvent();
        };
        DisplayVehicle.emptyOffset = { x: 0, y: 0 };
        return DisplayVehicle;
    }(egret.DisplayObjectContainer));
    meru.DisplayVehicle = DisplayVehicle;
    __reflect(DisplayVehicle.prototype, "meru.DisplayVehicle", ["meru.IVehicle"]);
})(meru || (meru = {}));
var meru;
(function (meru) {
    var Path = (function () {
        function Path(nodes) {
            if (nodes === void 0) { nodes = []; }
            this._pathWidth = 20;
            this._nodes = nodes;
            this._currentIdx = 0;
            this._isLooping = true;
        }
        Path.prototype.add = function (vector) {
            this._nodes.push(vector);
        };
        Path.prototype.next = function () {
            if (this._currentIdx < this._nodes.length) {
                var i = this._currentIdx;
                this._currentIdx++;
                if (this._isLooping && this._currentIdx >= this._nodes.length) {
                    this._currentIdx = 0;
                }
                return this._nodes[i];
            }
            return undefined;
        };
        Object.defineProperty(Path.prototype, "isComplete", {
            get: function () {
                return this._currentIdx >= this._nodes.length && this._nodes.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Path.prototype, "pathWidth", {
            get: function () {
                return this._pathWidth;
            },
            set: function (value) {
                this._pathWidth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Path.prototype, "isLooping", {
            get: function () {
                return this._isLooping;
            },
            set: function (value) {
                this._isLooping = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Path.prototype, "current", {
            get: function () {
                return this._nodes[this._currentIdx];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Path.prototype, "first", {
            get: function () {
                return this._nodes[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Path.prototype, "last", {
            get: function () {
                return this._nodes[this._nodes.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Path.prototype.clear = function () {
            this._nodes = [];
        };
        return Path;
    }());
    meru.Path = Path;
    __reflect(Path.prototype, "meru.Path");
})(meru || (meru = {}));
var meru;
(function (meru) {
    var Vec2d = (function () {
        function Vec2d(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Vec2d.prototype, "length", {
            get: function () {
                return Math.sqrt(this.lengthSq);
            },
            enumerable: true,
            configurable: true
        });
        Vec2d.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vec2d.prototype.equals = function (toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y;
        };
        Vec2d.prototype.copyFrom = function (sourcePoint) {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        };
        Vec2d.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Vec2d.prototype.add = function (vec2d) {
            this.x += vec2d.x;
            this.y += vec2d.y;
            return this;
        };
        Object.defineProperty(Vec2d.prototype, "lengthSq", {
            get: function () {
                return (this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        Vec2d.prototype.limit = function (max) {
            if (this.lengthSq > max * max) {
                this.normalize();
                this.mul(max);
            }
            return this;
        };
        Vec2d.prototype.div = function (num) {
            this.x /= num;
            this.y /= num;
            return this;
        };
        Vec2d.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vec2d.prototype.mul = function (n) {
            this.x *= n;
            this.y *= n;
            return this;
        };
        Vec2d.prototype.getAngle2 = function (vec2d) {
            var a = this.normalize();
            var b = vec2d.normalize();
            return Math.acos(a.dot(b));
        };
        Vec2d.prototype.getAngle = function (vec2d) {
            var dx = vec2d.x - this.x;
            var dy = vec2d.y - this.y;
            return Math.atan2(dy, dx);
        };
        Vec2d.prototype.heading = function () {
            return Math.atan2(this.y, this.x);
        };
        Vec2d.prototype.dot = function (vec) {
            return this.x * vec.x + this.y * vec.y;
        };
        Vec2d.prototype.normalize = function () {
            var len = this.length;
            if (len > 1) {
                this.x /= len;
                this.y /= len;
            }
            return this;
        };
        Vec2d.prototype.clone = function () {
            return new Vec2d(this.x, this.y);
        };
        Vec2d.prototype.distance = function (vec) {
            var x = vec.x - this.x;
            var y = vec.y - this.y;
            return Math.sqrt(x * x + y * y);
        };
        Vec2d.prototype.copy = function () {
            return new Vec2d(this.x, this.y);
        };
        Vec2d.prototype.isNormalized = function () {
            return this.length == 1.0;
        };
        Vec2d.prototype.rotate = function (angle, point) {
            if (point === void 0) { point = Vec2d.rotateEmpty; }
            var sin = Math.sin(angle);
            var cos = Math.cos(angle);
            if (point.x == 0 && point.y == 0) {
                var tmpX = this.x * cos - this.y * sin;
                this.y = this.y * cos + this.x * sin;
                this.x = tmpX;
            }
            else {
                var tmpX = this.x - point.x;
                var tmpY = this.y - point.y;
                this.x = tmpX * cos - tmpY * sin + point.x;
                this.y = tmpY * cos + tmpX * sin + point.y;
            }
            return this;
        };
        Vec2d.pointInTriangle = function (a, b, c, p) {
            var v0 = c.copy().subtract(a);
            var v1 = b.copy().subtract(a);
            var v2 = p.copy().subtract(a);
            var dot00 = v0.dot(v0);
            var dot01 = v0.dot(v1);
            var dot02 = v0.dot(v2);
            var dot11 = v1.dot(v1);
            var dot12 = v1.dot(v2);
            var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            if (u < 0 || u > 1) {
                return false;
            }
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
            if (v < 0 || v > 1) {
                return false;
            }
            return u + v <= 1;
        };
        Vec2d.get = function (ve2d) {
            var ret = null;
            if (ve2d instanceof Vec2d) {
                ret = ve2d.copy();
            }
            else {
                ret = new Vec2d(ve2d.x, ve2d.y);
            }
            return ret;
        };
        Vec2d.normalize = function (ve2d) {
            return this.get(ve2d).normalize();
        };
        Vec2d.add = function (target1, target2) {
            return this.get(target1).add(target2);
        };
        Vec2d.mul = function (target, num) {
            return this.get(target).mul(num);
        };
        Vec2d.sub = function (target1, target2) {
            return this.get(target1).subtract(target2);
        };
        Vec2d.rotateEmpty = { x: 0, y: 0 };
        return Vec2d;
    }());
    meru.Vec2d = Vec2d;
    __reflect(Vec2d.prototype, "meru.Vec2d");
})(meru || (meru = {}));
var ___math___ = Math;
var meru;
(function (meru) {
    var math = (function () {
        function math() {
        }
        math.roundAwayFromZero = function (val) {
            return (val > 0) ? ___math___.ceil(val) : ___math___.floor(val);
        };
        return math;
    }());
    meru.math = math;
    __reflect(math.prototype, "meru.math");
})(meru || (meru = {}));
