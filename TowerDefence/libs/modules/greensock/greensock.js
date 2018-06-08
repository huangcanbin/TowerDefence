/*!
 * VERSION: 1.19.0
 * DATE: 2016-07-16
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function (window, moduleName) {
    "use strict";
    var _exports = {}, _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
    if (_globals.TweenLite) {
        return; //in case the core set of classes is already loaded, don't instantiate twice.
    }
    var _namespace = function (ns) {
        var a = ns.split("."), p = _globals, i;
        for (i = 0; i < a.length; i++) {
            p[a[i]] = p = p[a[i]] || {};
        }
        return p;
    }, gs = _namespace("com.greensock"), _tinyNum = 0.0000000001, _slice = function (a) {
        var b = [], l = a.length, i;
        for (i = 0; i !== l; b.push(a[i++])) { }
        return b;
    }, _emptyFunc = function () { }, _isArray = (function () {
        var toString = Object.prototype.toString, array = toString.call([]);
        return function (obj) {
            return obj != null && (obj instanceof Array || (typeof (obj) === "object" && !!obj.push && toString.call(obj) === array));
        };
    }()), a, i, p, _ticker, _tickerActive, _defLookup = {}, 
    /**
     * @constructor
     * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
     * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
     * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
     * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
     *
     * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
     * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
     * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
     * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
     * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
     * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
     * sandbox the banner one like:
     *
     * <script>
     *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
     * </script>
     * <script src="js/greensock/v1.7/TweenMax.js"></script>
     * <script>
     *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
     * </script>
     * <script src="js/greensock/v1.6/TweenMax.js"></script>
     * <script>
     *     gs.TweenLite.to(...); //would use v1.7
     *     TweenLite.to(...); //would use v1.6
     * </script>
     *
     * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
     * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
     * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
     * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
     */
    Definition = function (ns, dependencies, func, global) {
        this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
        _defLookup[ns] = this;
        this.gsClass = null;
        this.func = func;
        var _classes = [];
        this.check = function (init) {
            var i = dependencies.length, missing = i, cur, a, n, cl, hasModule;
            while (--i > -1) {
                if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
                    _classes[i] = cur.gsClass;
                    missing--;
                }
                else if (init) {
                    cur.sc.push(this);
                }
            }
            if (missing === 0 && func) {
                a = ("com.greensock." + ns).split(".");
                n = a.pop();
                cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);
                //exports to multiple environments
                if (global) {
                    _globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
                    hasModule = (typeof (module) !== "undefined" && module.exports);
                    if (!hasModule && typeof (define) === "function" && define.amd) {
                        define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function () { return cl; });
                    }
                    else if (hasModule) {
                        if (ns === moduleName) {
                            module.exports = _exports[moduleName] = cl;
                            for (i in _exports) {
                                cl[i] = _exports[i];
                            }
                        }
                        else if (_exports[moduleName]) {
                            _exports[moduleName][n] = cl;
                        }
                    }
                }
                for (i = 0; i < this.sc.length; i++) {
                    this.sc[i].check();
                }
            }
        };
        this.check(true);
    }, 
    //used to create Definition instances (which basically registers a class that has dependencies).
    _gsDefine = window._gsDefine = function (ns, dependencies, func, global) {
        return new Definition(ns, dependencies, func, global);
    }, 
    //a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
    _class = gs._class = function (ns, func, global) {
        func = func || function () { };
        _gsDefine(ns, [], function () { return func; }, global);
        return func;
    };
    _gsDefine.globals = _globals;
    /*
     * ----------------------------------------------------------------
     * Ease
     * ----------------------------------------------------------------
     */
    var _baseParams = [0, 0, 1, 1], _blankArray = [], Ease = _class("easing.Ease", function (func, extraParams, type, power) {
        this._func = func;
        this._type = type || 0;
        this._power = power || 0;
        this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
    }, true), _easeMap = Ease.map = {}, _easeReg = Ease.register = function (ease, names, types, create) {
        var na = names.split(","), i = na.length, ta = (types || "easeIn,easeOut,easeInOut").split(","), e, name, j, type;
        while (--i > -1) {
            name = na[i];
            e = create ? _class("easing." + name, null, true) : gs.easing[name] || {};
            j = ta.length;
            while (--j > -1) {
                type = ta[j];
                _easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
            }
        }
    };
    p = Ease.prototype;
    p._calcEnd = false;
    p.getRatio = function (p) {
        if (this._func) {
            this._params[0] = p;
            return this._func.apply(null, this._params);
        }
        var t = this._type, pw = this._power, r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
        if (pw === 1) {
            r *= r;
        }
        else if (pw === 2) {
            r *= r * r;
        }
        else if (pw === 3) {
            r *= r * r * r;
        }
        else if (pw === 4) {
            r *= r * r * r * r;
        }
        return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
    };
    //create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
    a = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"];
    i = a.length;
    while (--i > -1) {
        p = a[i] + ",Power" + i;
        _easeReg(new Ease(null, null, 1, i), p, "easeOut", true);
        _easeReg(new Ease(null, null, 2, i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
        _easeReg(new Ease(null, null, 3, i), p, "easeInOut");
    }
    _easeMap.linear = gs.easing.Linear.easeIn;
    _easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks
    /*
     * ----------------------------------------------------------------
     * EventDispatcher
     * ----------------------------------------------------------------
     */
    var EventDispatcher = _class("events.EventDispatcher", function (target) {
        this._listeners = {};
        this._eventTarget = target || this;
    });
    p = EventDispatcher.prototype;
    p.addEventListener = function (type, callback, scope, useParam, priority) {
        priority = priority || 0;
        var list = this._listeners[type], index = 0, listener, i;
        if (this === _ticker && !_tickerActive) {
            _ticker.wake();
        }
        if (list == null) {
            this._listeners[type] = list = [];
        }
        i = list.length;
        while (--i > -1) {
            listener = list[i];
            if (listener.c === callback && listener.s === scope) {
                list.splice(i, 1);
            }
            else if (index === 0 && listener.pr < priority) {
                index = i + 1;
            }
        }
        list.splice(index, 0, { c: callback, s: scope, up: useParam, pr: priority });
    };
    p.removeEventListener = function (type, callback) {
        var list = this._listeners[type], i;
        if (list) {
            i = list.length;
            while (--i > -1) {
                if (list[i].c === callback) {
                    list.splice(i, 1);
                    return;
                }
            }
        }
    };
    p.dispatchEvent = function (type) {
        var list = this._listeners[type], i, t, listener;
        if (list) {
            i = list.length;
            if (i > 1) {
                list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
            }
            t = this._eventTarget;
            while (--i > -1) {
                listener = list[i];
                if (listener) {
                    if (listener.up) {
                        listener.c.call(listener.s || t, { type: type, target: t });
                    }
                    else {
                        listener.c.call(listener.s || t);
                    }
                }
            }
        }
    };
    /*
     * ----------------------------------------------------------------
     * Ticker
     * ----------------------------------------------------------------
     */
    var _reqAnimFrame = window.requestAnimationFrame, _cancelAnimFrame = window.cancelAnimationFrame, _getTime = Date.now || function () { return new Date().getTime(); }, _lastUpdate = _getTime();
    //now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
    a = ["ms", "moz", "webkit", "o"];
    i = a.length;
    while (--i > -1 && !_reqAnimFrame) {
        _reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
        _cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
    }
    _class("Ticker", function (fps, useRAF) {
        var _self = this, _startTime = _getTime(), _useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false, _lagThreshold = 500, _adjustedLag = 33, _tickWord = "tick", //helps reduce gc burden
        _fps, _req, _id, _gap, _nextTime, _tick = function (manual) {
            var elapsed = _getTime() - _lastUpdate, overlap, dispatch;
            if (elapsed > _lagThreshold) {
                _startTime += elapsed - _adjustedLag;
            }
            _lastUpdate += elapsed;
            _self.time = (_lastUpdate - _startTime) / 1000;
            overlap = _self.time - _nextTime;
            if (!_fps || overlap > 0 || manual === true) {
                _self.frame++;
                _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
                dispatch = true;
            }
            if (manual !== true) {
                _id = _req(_tick);
            }
            if (dispatch) {
                _self.dispatchEvent(_tickWord);
            }
        };
        EventDispatcher.call(_self);
        _self.time = _self.frame = 0;
        _self.tick = function () {
            _tick(true);
        };
        _self.lagSmoothing = function (threshold, adjustedLag) {
            _lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
            _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
        };
        _self.sleep = function () {
            if (_id == null) {
                return;
            }
            if (!_useRAF || !_cancelAnimFrame) {
                clearTimeout(_id);
            }
            else {
                _cancelAnimFrame(_id);
            }
            _req = _emptyFunc;
            _id = null;
            if (_self === _ticker) {
                _tickerActive = false;
            }
        };
        _self.wake = function (seamless) {
            if (_id !== null) {
                _self.sleep();
            }
            else if (seamless) {
                _startTime += -_lastUpdate + (_lastUpdate = _getTime());
            }
            else if (_self.frame > 10) {
                _lastUpdate = _getTime() - _lagThreshold + 5;
            }
            _req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function (f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
            if (_self === _ticker) {
                _tickerActive = true;
            }
            _tick(2);
        };
        _self.fps = function (value) {
            if (!arguments.length) {
                return _fps;
            }
            _fps = value;
            _gap = 1 / (_fps || 60);
            _nextTime = this.time + _gap;
            _self.wake();
        };
        _self.useRAF = function (value) {
            if (!arguments.length) {
                return _useRAF;
            }
            _self.sleep();
            _useRAF = value;
            _self.fps(_fps);
        };
        _self.fps(fps);
        //a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
        setTimeout(function () {
            if (_useRAF === "auto" && _self.frame < 5 && document.visibilityState !== "hidden") {
                _self.useRAF(false);
            }
        }, 1500);
    });
    p = gs.Ticker.prototype = new gs.events.EventDispatcher();
    p.constructor = gs.Ticker;
    /*
     * ----------------------------------------------------------------
     * Animation
     * ----------------------------------------------------------------
     */
    var Animation = _class("core.Animation", function (duration, vars) {
        this.vars = vars = vars || {};
        this._duration = this._totalDuration = duration || 0;
        this._delay = Number(vars.delay) || 0;
        this._timeScale = 1;
        this._active = (vars.immediateRender === true);
        this.data = vars.data;
        this._reversed = (vars.reversed === true);
        if (!_rootTimeline) {
            return;
        }
        if (!_tickerActive) {
            _ticker.wake();
        }
        var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
        tl.add(this, tl._time);
        if (this.vars.paused) {
            this.paused(true);
        }
    });
    _ticker = Animation.ticker = new gs.Ticker();
    p = Animation.prototype;
    p._dirty = p._gc = p._initted = p._paused = false;
    p._totalTime = p._time = 0;
    p._rawPrevTime = -1;
    p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
    p._paused = false;
    //some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
    var _checkTimeout = function () {
        if (_tickerActive && _getTime() - _lastUpdate > 2000) {
            _ticker.wake();
        }
        setTimeout(_checkTimeout, 2000);
    };
    _checkTimeout();
    p.play = function (from, suppressEvents) {
        if (from != null) {
            this.seek(from, suppressEvents);
        }
        return this.reversed(false).paused(false);
    };
    p.pause = function (atTime, suppressEvents) {
        if (atTime != null) {
            this.seek(atTime, suppressEvents);
        }
        return this.paused(true);
    };
    p.resume = function (from, suppressEvents) {
        if (from != null) {
            this.seek(from, suppressEvents);
        }
        return this.paused(false);
    };
    p.seek = function (time, suppressEvents) {
        return this.totalTime(Number(time), suppressEvents !== false);
    };
    p.restart = function (includeDelay, suppressEvents) {
        return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
    };
    p.reverse = function (from, suppressEvents) {
        if (from != null) {
            this.seek((from || this.totalDuration()), suppressEvents);
        }
        return this.reversed(true).paused(false);
    };
    p.render = function (time, suppressEvents, force) {
        //stub - we override this method in subclasses.
    };
    p.invalidate = function () {
        this._time = this._totalTime = 0;
        this._initted = this._gc = false;
        this._rawPrevTime = -1;
        if (this._gc || !this.timeline) {
            this._enabled(true);
        }
        return this;
    };
    p.isActive = function () {
        var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
        startTime = this._startTime, rawTime;
        return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
    };
    p._enabled = function (enabled, ignoreTimeline) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        this._gc = !enabled;
        this._active = this.isActive();
        if (ignoreTimeline !== true) {
            if (enabled && !this.timeline) {
                this._timeline.add(this, this._startTime - this._delay);
            }
            else if (!enabled && this.timeline) {
                this._timeline._remove(this, true);
            }
        }
        return false;
    };
    p._kill = function (vars, target) {
        return this._enabled(false, false);
    };
    p.kill = function (vars, target) {
        this._kill(vars, target);
        return this;
    };
    p._uncache = function (includeSelf) {
        var tween = includeSelf ? this : this.timeline;
        while (tween) {
            tween._dirty = true;
            tween = tween.timeline;
        }
        return this;
    };
    p._swapSelfInParams = function (params) {
        var i = params.length, copy = params.concat();
        while (--i > -1) {
            if (params[i] === "{self}") {
                copy[i] = this;
            }
        }
        return copy;
    };
    p._callback = function (type) {
        var v = this.vars, callback = v[type], params = v[type + "Params"], scope = v[type + "Scope"] || v.callbackScope || this, l = params ? params.length : 0;
        switch (l) {
            case 0:
                callback.call(scope);
                break;
            case 1:
                callback.call(scope, params[0]);
                break;
            case 2:
                callback.call(scope, params[0], params[1]);
                break;
            default: callback.apply(scope, params);
        }
    };
    //----Animation getters/setters --------------------------------------------------------
    p.eventCallback = function (type, callback, params, scope) {
        if ((type || "").substr(0, 2) === "on") {
            var v = this.vars;
            if (arguments.length === 1) {
                return v[type];
            }
            if (callback == null) {
                delete v[type];
            }
            else {
                v[type] = callback;
                v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
                v[type + "Scope"] = scope;
            }
            if (type === "onUpdate") {
                this._onUpdate = callback;
            }
        }
        return this;
    };
    p.delay = function (value) {
        if (!arguments.length) {
            return this._delay;
        }
        if (this._timeline.smoothChildTiming) {
            this.startTime(this._startTime + value - this._delay);
        }
        this._delay = value;
        return this;
    };
    p.duration = function (value) {
        if (!arguments.length) {
            this._dirty = false;
            return this._duration;
        }
        this._duration = this._totalDuration = value;
        this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
        if (this._timeline.smoothChildTiming)
            if (this._time > 0)
                if (this._time < this._duration)
                    if (value !== 0) {
                        this.totalTime(this._totalTime * (value / this._duration), true);
                    }
        return this;
    };
    p.totalDuration = function (value) {
        this._dirty = false;
        return (!arguments.length) ? this._totalDuration : this.duration(value);
    };
    p.time = function (value, suppressEvents) {
        if (!arguments.length) {
            return this._time;
        }
        if (this._dirty) {
            this.totalDuration();
        }
        return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
    };
    p.totalTime = function (time, suppressEvents, uncapped) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        if (!arguments.length) {
            return this._totalTime;
        }
        if (this._timeline) {
            if (time < 0 && !uncapped) {
                time += this.totalDuration();
            }
            if (this._timeline.smoothChildTiming) {
                if (this._dirty) {
                    this.totalDuration();
                }
                var totalDuration = this._totalDuration, tl = this._timeline;
                if (time > totalDuration && !uncapped) {
                    time = totalDuration;
                }
                this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
                if (!tl._dirty) {
                    this._uncache(false);
                }
                //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
                if (tl._timeline) {
                    while (tl._timeline) {
                        if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
                            tl.totalTime(tl._totalTime, true);
                        }
                        tl = tl._timeline;
                    }
                }
            }
            if (this._gc) {
                this._enabled(true, false);
            }
            if (this._totalTime !== time || this._duration === 0) {
                if (_lazyTweens.length) {
                    _lazyRender();
                }
                this.render(time, suppressEvents, false);
                if (_lazyTweens.length) {
                    _lazyRender();
                }
            }
        }
        return this;
    };
    p.progress = p.totalProgress = function (value, suppressEvents) {
        var duration = this.duration();
        return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
    };
    p.startTime = function (value) {
        if (!arguments.length) {
            return this._startTime;
        }
        if (value !== this._startTime) {
            this._startTime = value;
            if (this.timeline)
                if (this.timeline._sortChildren) {
                    this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
                }
        }
        return this;
    };
    p.endTime = function (includeRepeats) {
        return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
    };
    p.timeScale = function (value) {
        if (!arguments.length) {
            return this._timeScale;
        }
        value = value || _tinyNum; //can't allow zero because it'll throw the math off
        if (this._timeline && this._timeline.smoothChildTiming) {
            var pauseTime = this._pauseTime, t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
            this._startTime = t - ((t - this._startTime) * this._timeScale / value);
        }
        this._timeScale = value;
        return this._uncache(false);
    };
    p.reversed = function (value) {
        if (!arguments.length) {
            return this._reversed;
        }
        if (value != this._reversed) {
            this._reversed = value;
            this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
        }
        return this;
    };
    p.paused = function (value) {
        if (!arguments.length) {
            return this._paused;
        }
        var tl = this._timeline, raw, elapsed;
        if (value != this._paused)
            if (tl) {
                if (!_tickerActive && !value) {
                    _ticker.wake();
                }
                raw = tl.rawTime();
                elapsed = raw - this._pauseTime;
                if (!value && tl.smoothChildTiming) {
                    this._startTime += elapsed;
                    this._uncache(false);
                }
                this._pauseTime = value ? raw : null;
                this._paused = value;
                this._active = this.isActive();
                if (!value && elapsed !== 0 && this._initted && this.duration()) {
                    raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
                    this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
                }
            }
        if (this._gc && !value) {
            this._enabled(true, false);
        }
        return this;
    };
    /*
     * ----------------------------------------------------------------
     * SimpleTimeline
     * ----------------------------------------------------------------
     */
    var SimpleTimeline = _class("core.SimpleTimeline", function (vars) {
        Animation.call(this, 0, vars);
        this.autoRemoveChildren = this.smoothChildTiming = true;
    });
    p = SimpleTimeline.prototype = new Animation();
    p.constructor = SimpleTimeline;
    p.kill()._gc = false;
    p._first = p._last = p._recent = null;
    p._sortChildren = false;
    p.add = p.insert = function (child, position, align, stagger) {
        var prevTween, st;
        child._startTime = Number(position || 0) + child._delay;
        if (child._paused)
            if (this !== child._timeline) {
                child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
            }
        if (child.timeline) {
            child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
        }
        child.timeline = child._timeline = this;
        if (child._gc) {
            child._enabled(true, true);
        }
        prevTween = this._last;
        if (this._sortChildren) {
            st = child._startTime;
            while (prevTween && prevTween._startTime > st) {
                prevTween = prevTween._prev;
            }
        }
        if (prevTween) {
            child._next = prevTween._next;
            prevTween._next = child;
        }
        else {
            child._next = this._first;
            this._first = child;
        }
        if (child._next) {
            child._next._prev = child;
        }
        else {
            this._last = child;
        }
        child._prev = prevTween;
        this._recent = child;
        if (this._timeline) {
            this._uncache(true);
        }
        return this;
    };
    p._remove = function (tween, skipDisable) {
        if (tween.timeline === this) {
            if (!skipDisable) {
                tween._enabled(false, true);
            }
            if (tween._prev) {
                tween._prev._next = tween._next;
            }
            else if (this._first === tween) {
                this._first = tween._next;
            }
            if (tween._next) {
                tween._next._prev = tween._prev;
            }
            else if (this._last === tween) {
                this._last = tween._prev;
            }
            tween._next = tween._prev = tween.timeline = null;
            if (tween === this._recent) {
                this._recent = this._last;
            }
            if (this._timeline) {
                this._uncache(true);
            }
        }
        return this;
    };
    p.render = function (time, suppressEvents, force) {
        var tween = this._first, next;
        this._totalTime = this._time = this._rawPrevTime = time;
        while (tween) {
            next = tween._next; //record it here because the value could change after rendering...
            if (tween._active || (time >= tween._startTime && !tween._paused)) {
                if (!tween._reversed) {
                    tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                }
                else {
                    tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                }
            }
            tween = next;
        }
    };
    p.rawTime = function () {
        if (!_tickerActive) {
            _ticker.wake();
        }
        return this._totalTime;
    };
    /*
     * ----------------------------------------------------------------
     * TweenLite
     * ----------------------------------------------------------------
     */
    var TweenLite = _class("TweenLite", function (target, duration, vars) {
        Animation.call(this, duration, vars);
        this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
        if (target == null) {
            throw "Cannot tween a null target.";
        }
        this.target = target = (typeof (target) !== "string") ? target : TweenLite.selector(target) || target;
        var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))), overwrite = this.vars.overwrite, i, targ, targets;
        this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof (overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];
        if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof (target[0]) !== "number") {
            this._targets = targets = _slice(target); //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
            this._propLookup = [];
            this._siblings = [];
            for (i = 0; i < targets.length; i++) {
                targ = targets[i];
                if (!targ) {
                    targets.splice(i--, 1);
                    continue;
                }
                else if (typeof (targ) === "string") {
                    targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
                    if (typeof (targ) === "string") {
                        targets.splice(i + 1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
                    }
                    continue;
                }
                else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) {
                    targets.splice(i--, 1);
                    this._targets = targets = targets.concat(_slice(targ));
                    continue;
                }
                this._siblings[i] = _register(targ, this, false);
                if (overwrite === 1)
                    if (this._siblings[i].length > 1) {
                        _applyOverwrite(targ, this, null, 1, this._siblings[i]);
                    }
            }
        }
        else {
            this._propLookup = {};
            this._siblings = _register(target, this, false);
            if (overwrite === 1)
                if (this._siblings.length > 1) {
                    _applyOverwrite(target, this, null, 1, this._siblings);
                }
        }
        if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
            this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
            this.render(Math.min(0, -this._delay)); //in case delay is negative
        }
    }, true), _isSelector = function (v) {
        return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
    }, _autoCSS = function (vars, target) {
        var css = {}, p;
        for (p in vars) {
            if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) {
                css[p] = vars[p];
                delete vars[p];
            }
        }
        vars.css = css;
    };
    p = TweenLite.prototype = new Animation();
    p.constructor = TweenLite;
    p.kill()._gc = false;
    //----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------
    p.ratio = 0;
    p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
    p._notifyPluginsOfEnabled = p._lazy = false;
    TweenLite.version = "1.19.0";
    TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
    TweenLite.defaultOverwrite = "auto";
    TweenLite.ticker = _ticker;
    TweenLite.autoSleep = 120;
    TweenLite.lagSmoothing = function (threshold, adjustedLag) {
        _ticker.lagSmoothing(threshold, adjustedLag);
    };
    TweenLite.selector = window.$ || window.jQuery || function (e) {
        var selector = window.$ || window.jQuery;
        if (selector) {
            TweenLite.selector = selector;
            return selector(e);
        }
        return (typeof (document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
    };
    var _lazyTweens = [], _lazyLookup = {}, _numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig, 
    //_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
    _setRatio = function (v) {
        var pt = this._firstPT, min = 0.000001, val;
        while (pt) {
            val = !pt.blob ? pt.c * v + pt.s : v ? this.join("") : this.start;
            if (pt.m) {
                val = pt.m(val, this._target || pt.t);
            }
            else if (val < min)
                if (val > -min) {
                    val = 0;
                }
            if (!pt.f) {
                pt.t[pt.p] = val;
            }
            else if (pt.fp) {
                pt.t[pt.p](pt.fp, val);
            }
            else {
                pt.t[pt.p](val);
            }
            pt = pt._next;
        }
    }, 
    //compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
    _blobDif = function (start, end, filter, pt) {
        var a = [start, end], charIndex = 0, s = "", color = 0, startNums, endNums, num, i, l, nonNumbers, currentNum;
        a.start = start;
        if (filter) {
            filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
            start = a[0];
            end = a[1];
        }
        a.length = 0;
        startNums = start.match(_numbersExp) || [];
        endNums = end.match(_numbersExp) || [];
        if (pt) {
            pt._next = null;
            pt.blob = 1;
            a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
        }
        l = endNums.length;
        for (i = 0; i < l; i++) {
            currentNum = endNums[i];
            nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex) - charIndex);
            s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            charIndex += nonNumbers.length;
            if (color) {
                color = (color + 1) % 5;
            }
            else if (nonNumbers.substr(-5) === "rgba(") {
                color = 1;
            }
            if (currentNum === startNums[i] || startNums.length <= i) {
                s += currentNum;
            }
            else {
                if (s) {
                    a.push(s);
                    s = "";
                }
                num = parseFloat(startNums[i]);
                a.push(num);
                a._firstPT = { _next: a._firstPT, t: a, p: a.length - 1, s: num, c: ((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f: 0, m: (color && color < 4) ? Math.round : 0 };
            }
            charIndex += currentNum.length;
        }
        s += end.substr(charIndex);
        if (s) {
            a.push(s);
        }
        a.setRatio = _setRatio;
        return a;
    }, 
    //note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
    _addPropTween = function (target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
        if (typeof (end) === "function") {
            end = end(index || 0, target);
        }
        var s = (start === "get") ? target[prop] : start, type = typeof (target[prop]), isRelative = (typeof (end) === "string" && end.charAt(1) === "="), pt = { t: target, p: prop, s: s, f: (type === "function"), pg: 0, n: overwriteProp || prop, m: (!mod ? 0 : (typeof (mod) === "function") ? mod : Math.round), pr: 0, c: isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0 }, blob, getterName;
        if (type !== "number") {
            if (type === "function" && start === "get") {
                getterName = ((prop.indexOf("set") || typeof (target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3));
                pt.s = s = funcParam ? target[getterName](funcParam) : target[getterName]();
            }
            if (typeof (s) === "string" && (funcParam || isNaN(s))) {
                //a blob (string that has multiple numbers in it)
                pt.fp = funcParam;
                blob = _blobDif(s, end, stringFilter || TweenLite.defaultStringFilter, pt);
                pt = { t: blob, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: overwriteProp || prop, pr: 0, m: 0 }; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
            }
            else if (!isRelative) {
                pt.s = parseFloat(s);
                pt.c = (parseFloat(end) - pt.s) || 0;
            }
        }
        if (pt.c) {
            if ((pt._next = this._firstPT)) {
                pt._next._prev = pt;
            }
            this._firstPT = pt;
            return pt;
        }
    }, _internals = TweenLite._internals = { isArray: _isArray, isSelector: _isSelector, lazyTweens: _lazyTweens, blobDif: _blobDif }, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
    _plugins = TweenLite._plugins = {}, _tweenLookup = _internals.tweenLookup = {}, _tweenLookupNum = 0, _reservedProps = _internals.reservedProps = { ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, immediateRender: 1, repeat: 1, repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1, lazy: 1, onOverwrite: 1, callbackScope: 1, stringFilter: 1, id: 1 }, _overwriteLookup = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0 }, _rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(), _rootTimeline = Animation._rootTimeline = new SimpleTimeline(), _nextGCFrame = 30, _lazyRender = _internals.lazyRender = function () {
        var i = _lazyTweens.length, tween;
        _lazyLookup = {};
        while (--i > -1) {
            tween = _lazyTweens[i];
            if (tween && tween._lazy !== false) {
                tween.render(tween._lazy[0], tween._lazy[1], true);
                tween._lazy = false;
            }
        }
        _lazyTweens.length = 0;
    };
    _rootTimeline._startTime = _ticker.time;
    _rootFramesTimeline._startTime = _ticker.frame;
    _rootTimeline._active = _rootFramesTimeline._active = true;
    setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".
    Animation._updateRoot = TweenLite.render = function () {
        var i, a, p;
        if (_lazyTweens.length) {
            _lazyRender();
        }
        _rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
        _rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
        if (_lazyTweens.length) {
            _lazyRender();
        }
        if (_ticker.frame >= _nextGCFrame) {
            _nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
            for (p in _tweenLookup) {
                a = _tweenLookup[p].tweens;
                i = a.length;
                while (--i > -1) {
                    if (a[i]._gc) {
                        a.splice(i, 1);
                    }
                }
                if (a.length === 0) {
                    delete _tweenLookup[p];
                }
            }
            //if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
            p = _rootTimeline._first;
            if (!p || p._paused)
                if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
                    while (p && p._paused) {
                        p = p._next;
                    }
                    if (!p) {
                        _ticker.sleep();
                    }
                }
        }
    };
    _ticker.addEventListener("tick", Animation._updateRoot);
    var _register = function (target, tween, scrub) {
        var id = target._gsTweenID, a, i;
        if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
            _tweenLookup[id] = { target: target, tweens: [] };
        }
        if (tween) {
            a = _tweenLookup[id].tweens;
            a[(i = a.length)] = tween;
            if (scrub) {
                while (--i > -1) {
                    if (a[i] === tween) {
                        a.splice(i, 1);
                    }
                }
            }
        }
        return _tweenLookup[id].tweens;
    }, _onOverwrite = function (overwrittenTween, overwritingTween, target, killedProps) {
        var func = overwrittenTween.vars.onOverwrite, r1, r2;
        if (func) {
            r1 = func(overwrittenTween, overwritingTween, target, killedProps);
        }
        func = TweenLite.onOverwrite;
        if (func) {
            r2 = func(overwrittenTween, overwritingTween, target, killedProps);
        }
        return (r1 !== false && r2 !== false);
    }, _applyOverwrite = function (target, tween, props, mode, siblings) {
        var i, changed, curTween, l;
        if (mode === 1 || mode >= 4) {
            l = siblings.length;
            for (i = 0; i < l; i++) {
                if ((curTween = siblings[i]) !== tween) {
                    if (!curTween._gc) {
                        if (curTween._kill(null, target, tween)) {
                            changed = true;
                        }
                    }
                }
                else if (mode === 5) {
                    break;
                }
            }
            return changed;
        }
        //NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
        var startTime = tween._startTime + _tinyNum, overlaps = [], oCount = 0, zeroDur = (tween._duration === 0), globalStart;
        i = siblings.length;
        while (--i > -1) {
            if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
            }
            else if (curTween._timeline !== tween._timeline) {
                globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
                if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
                    overlaps[oCount++] = curTween;
                }
            }
            else if (curTween._startTime <= startTime)
                if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime)
                    if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
                        overlaps[oCount++] = curTween;
                    }
        }
        i = oCount;
        while (--i > -1) {
            curTween = overlaps[i];
            if (mode === 2)
                if (curTween._kill(props, target, tween)) {
                    changed = true;
                }
            if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
                if (mode !== 2 && !_onOverwrite(curTween, tween)) {
                    continue;
                }
                if (curTween._enabled(false, false)) {
                    changed = true;
                }
            }
        }
        return changed;
    }, _checkOverlap = function (tween, reference, zeroDur) {
        var tl = tween._timeline, ts = tl._timeScale, t = tween._startTime;
        while (tl._timeline) {
            t += tl._startTime;
            ts *= tl._timeScale;
            if (tl._paused) {
                return -100;
            }
            tl = tl._timeline;
        }
        t /= ts;
        return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
    };
    //---- TweenLite instance methods -----------------------------------------------------------------------------
    p._init = function () {
        var v = this.vars, op = this._overwrittenProps, dur = this._duration, immediate = !!v.immediateRender, ease = v.ease, i, initPlugins, pt, p, startVars, l;
        if (v.startAt) {
            if (this._startAt) {
                this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
                this._startAt.kill();
            }
            startVars = {};
            for (p in v.startAt) {
                startVars[p] = v.startAt[p];
            }
            startVars.overwrite = false;
            startVars.immediateRender = true;
            startVars.lazy = (immediate && v.lazy !== false);
            startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
            this._startAt = TweenLite.to(this.target, 0, startVars);
            if (immediate) {
                if (this._time > 0) {
                    this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
                }
                else if (dur !== 0) {
                    return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
                }
            }
        }
        else if (v.runBackwards && dur !== 0) {
            //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
            if (this._startAt) {
                this._startAt.render(-1, true);
                this._startAt.kill();
                this._startAt = null;
            }
            else {
                if (this._time !== 0) {
                    immediate = false;
                }
                pt = {};
                for (p in v) {
                    if (!_reservedProps[p] || p === "autoCSS") {
                        pt[p] = v[p];
                    }
                }
                pt.overwrite = 0;
                pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
                pt.lazy = (immediate && v.lazy !== false);
                pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
                this._startAt = TweenLite.to(this.target, 0, pt);
                if (!immediate) {
                    this._startAt._init(); //ensures that the initial values are recorded
                    this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
                    if (this.vars.immediateRender) {
                        this._startAt = null;
                    }
                }
                else if (this._time === 0) {
                    return;
                }
            }
        }
        this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof (ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
        if (v.easeParams instanceof Array && ease.config) {
            this._ease = ease.config.apply(ease, v.easeParams);
        }
        this._easeType = this._ease._type;
        this._easePower = this._ease._power;
        this._firstPT = null;
        if (this._targets) {
            l = this._targets.length;
            for (i = 0; i < l; i++) {
                if (this._initProps(this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null), i)) {
                    initPlugins = true;
                }
            }
        }
        else {
            initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
        }
        if (initPlugins) {
            TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
        }
        if (op)
            if (!this._firstPT)
                if (typeof (this.target) !== "function") {
                    this._enabled(false, false);
                }
        if (v.runBackwards) {
            pt = this._firstPT;
            while (pt) {
                pt.s += pt.c;
                pt.c = -pt.c;
                pt = pt._next;
            }
        }
        this._onUpdate = v.onUpdate;
        this._initted = true;
    };
    p._initProps = function (target, propLookup, siblings, overwrittenProps, index) {
        var p, i, initPlugins, plugin, pt, v;
        if (target == null) {
            return false;
        }
        if (_lazyLookup[target._gsTweenID]) {
            _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
        }
        if (!this.vars.css)
            if (target.style)
                if (target !== window && target.nodeType)
                    if (_plugins.css)
                        if (this.vars.autoCSS !== false) {
                            _autoCSS(this.vars, target);
                        }
        for (p in this.vars) {
            v = this.vars[p];
            if (_reservedProps[p]) {
                if (v)
                    if ((v instanceof Array) || (v.push && _isArray(v)))
                        if (v.join("").indexOf("{self}") !== -1) {
                            this.vars[p] = v = this._swapSelfInParams(v, this);
                        }
            }
            else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {
                //t - target 		[object]
                //p - property 		[string]
                //s - start			[number]
                //c - change		[number]
                //f - isFunction	[boolean]
                //n - name			[string]
                //pg - isPlugin 	[boolean]
                //pr - priority		[number]
                //m - mod           [function | 0]
                this._firstPT = pt = { _next: this._firstPT, t: plugin, p: "setRatio", s: 0, c: 1, f: 1, n: p, pg: 1, pr: plugin._priority, m: 0 };
                i = plugin._overwriteProps.length;
                while (--i > -1) {
                    propLookup[plugin._overwriteProps[i]] = this._firstPT;
                }
                if (plugin._priority || plugin._onInitAllProps) {
                    initPlugins = true;
                }
                if (plugin._onDisable || plugin._onEnable) {
                    this._notifyPluginsOfEnabled = true;
                }
                if (pt._next) {
                    pt._next._prev = pt;
                }
            }
            else {
                propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
            }
        }
        if (overwrittenProps)
            if (this._kill(overwrittenProps, target)) {
                return this._initProps(target, propLookup, siblings, overwrittenProps, index);
            }
        if (this._overwrite > 1)
            if (this._firstPT)
                if (siblings.length > 1)
                    if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
                        this._kill(propLookup, target);
                        return this._initProps(target, propLookup, siblings, overwrittenProps, index);
                    }
        if (this._firstPT)
            if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) {
                _lazyLookup[target._gsTweenID] = true;
            }
        return initPlugins;
    };
    p.render = function (time, suppressEvents, force) {
        var prevTime = this._time, duration = this._duration, prevRawPrevTime = this._rawPrevTime, isComplete, callback, pt, rawPrevTime;
        if (time >= duration - 0.0000001) {
            this._totalTime = this._time = duration;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
            if (!this._reversed) {
                isComplete = true;
                callback = "onComplete";
                force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
            }
            if (duration === 0)
                if (this._initted || !this.vars.lazy || force) {
                    if (this._startTime === this._timeline._duration) {
                        time = 0;
                    }
                    if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause"))
                        if (prevRawPrevTime !== time) {
                            force = true;
                            if (prevRawPrevTime > _tinyNum) {
                                callback = "onReverseComplete";
                            }
                        }
                    this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                }
        }
        else if (time < 0.0000001) {
            this._totalTime = this._time = 0;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
            if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
                callback = "onReverseComplete";
                isComplete = this._reversed;
            }
            if (time < 0) {
                this._active = false;
                if (duration === 0)
                    if (this._initted || !this.vars.lazy || force) {
                        if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
                            force = true;
                        }
                        this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                    }
            }
            if (!this._initted) {
                force = true;
            }
        }
        else {
            this._totalTime = this._time = time;
            if (this._easeType) {
                var r = time / duration, type = this._easeType, pow = this._easePower;
                if (type === 1 || (type === 3 && r >= 0.5)) {
                    r = 1 - r;
                }
                if (type === 3) {
                    r *= 2;
                }
                if (pow === 1) {
                    r *= r;
                }
                else if (pow === 2) {
                    r *= r * r;
                }
                else if (pow === 3) {
                    r *= r * r * r;
                }
                else if (pow === 4) {
                    r *= r * r * r * r;
                }
                if (type === 1) {
                    this.ratio = 1 - r;
                }
                else if (type === 2) {
                    this.ratio = r;
                }
                else if (time / duration < 0.5) {
                    this.ratio = r / 2;
                }
                else {
                    this.ratio = 1 - (r / 2);
                }
            }
            else {
                this.ratio = this._ease.getRatio(time / duration);
            }
        }
        if (this._time === prevTime && !force) {
            return;
        }
        else if (!this._initted) {
            this._init();
            if (!this._initted || this._gc) {
                return;
            }
            else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
                this._time = this._totalTime = prevTime;
                this._rawPrevTime = prevRawPrevTime;
                _lazyTweens.push(this);
                this._lazy = [time, suppressEvents];
                return;
            }
            //_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
            if (this._time && !isComplete) {
                this.ratio = this._ease.getRatio(this._time / duration);
            }
            else if (isComplete && this._ease._calcEnd) {
                this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
            }
        }
        if (this._lazy !== false) {
            this._lazy = false;
        }
        if (!this._active)
            if (!this._paused && this._time !== prevTime && time >= 0) {
                this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
            }
        if (prevTime === 0) {
            if (this._startAt) {
                if (time >= 0) {
                    this._startAt.render(time, suppressEvents, force);
                }
                else if (!callback) {
                    callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
                }
            }
            if (this.vars.onStart)
                if (this._time !== 0 || duration === 0)
                    if (!suppressEvents) {
                        this._callback("onStart");
                    }
        }
        pt = this._firstPT;
        while (pt) {
            if (pt.f) {
                pt.t[pt.p](pt.c * this.ratio + pt.s);
            }
            else {
                pt.t[pt.p] = pt.c * this.ratio + pt.s;
            }
            pt = pt._next;
        }
        if (this._onUpdate) {
            if (time < 0)
                if (this._startAt && time !== -0.0001) {
                    this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
                }
            if (!suppressEvents)
                if (this._time !== prevTime || isComplete || force) {
                    this._callback("onUpdate");
                }
        }
        if (callback)
            if (!this._gc || force) {
                if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) {
                    this._startAt.render(time, suppressEvents, force);
                }
                if (isComplete) {
                    if (this._timeline.autoRemoveChildren) {
                        this._enabled(false, false);
                    }
                    this._active = false;
                }
                if (!suppressEvents && this.vars[callback]) {
                    this._callback(callback);
                }
                if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) {
                    this._rawPrevTime = 0;
                }
            }
    };
    p._kill = function (vars, target, overwritingTween) {
        if (vars === "all") {
            vars = null;
        }
        if (vars == null)
            if (target == null || target === this.target) {
                this._lazy = false;
                return this._enabled(false, false);
            }
        target = (typeof (target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
        var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline), i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
        if ((_isArray(target) || _isSelector(target)) && typeof (target[0]) !== "number") {
            i = target.length;
            while (--i > -1) {
                if (this._kill(vars, target[i], overwritingTween)) {
                    changed = true;
                }
            }
        }
        else {
            if (this._targets) {
                i = this._targets.length;
                while (--i > -1) {
                    if (target === this._targets[i]) {
                        propLookup = this._propLookup[i] || {};
                        this._overwrittenProps = this._overwrittenProps || [];
                        overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
                        break;
                    }
                }
            }
            else if (target !== this.target) {
                return false;
            }
            else {
                propLookup = this._propLookup;
                overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
            }
            if (propLookup) {
                killProps = vars || propLookup;
                record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof (vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
                if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
                    for (p in killProps) {
                        if (propLookup[p]) {
                            if (!killed) {
                                killed = [];
                            }
                            killed.push(p);
                        }
                    }
                    if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) {
                        return false;
                    }
                }
                for (p in killProps) {
                    if ((pt = propLookup[p])) {
                        if (simultaneousOverwrite) {
                            if (pt.f) {
                                pt.t[pt.p](pt.s);
                            }
                            else {
                                pt.t[pt.p] = pt.s;
                            }
                            changed = true;
                        }
                        if (pt.pg && pt.t._kill(killProps)) {
                            changed = true; //some plugins need to be notified so they can perform cleanup tasks first
                        }
                        if (!pt.pg || pt.t._overwriteProps.length === 0) {
                            if (pt._prev) {
                                pt._prev._next = pt._next;
                            }
                            else if (pt === this._firstPT) {
                                this._firstPT = pt._next;
                            }
                            if (pt._next) {
                                pt._next._prev = pt._prev;
                            }
                            pt._next = pt._prev = null;
                        }
                        delete propLookup[p];
                    }
                    if (record) {
                        overwrittenProps[p] = 1;
                    }
                }
                if (!this._firstPT && this._initted) {
                    this._enabled(false, false);
                }
            }
        }
        return changed;
    };
    p.invalidate = function () {
        if (this._notifyPluginsOfEnabled) {
            TweenLite._onPluginEvent("_onDisable", this);
        }
        this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
        this._notifyPluginsOfEnabled = this._active = this._lazy = false;
        this._propLookup = (this._targets) ? {} : [];
        Animation.prototype.invalidate.call(this);
        if (this.vars.immediateRender) {
            this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
            this.render(Math.min(0, -this._delay)); //in case delay is negative.
        }
        return this;
    };
    p._enabled = function (enabled, ignoreTimeline) {
        if (!_tickerActive) {
            _ticker.wake();
        }
        if (enabled && this._gc) {
            var targets = this._targets, i;
            if (targets) {
                i = targets.length;
                while (--i > -1) {
                    this._siblings[i] = _register(targets[i], this, true);
                }
            }
            else {
                this._siblings = _register(this.target, this, true);
            }
        }
        Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
        if (this._notifyPluginsOfEnabled)
            if (this._firstPT) {
                return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
            }
        return false;
    };
    //----TweenLite static methods -----------------------------------------------------
    TweenLite.to = function (target, duration, vars) {
        return new TweenLite(target, duration, vars);
    };
    TweenLite.from = function (target, duration, vars) {
        vars.runBackwards = true;
        vars.immediateRender = (vars.immediateRender != false);
        return new TweenLite(target, duration, vars);
    };
    TweenLite.fromTo = function (target, duration, fromVars, toVars) {
        toVars.startAt = fromVars;
        toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
        return new TweenLite(target, duration, toVars);
    };
    TweenLite.delayedCall = function (delay, callback, params, scope, useFrames) {
        return new TweenLite(callback, 0, { delay: delay, onComplete: callback, onCompleteParams: params, callbackScope: scope, onReverseComplete: callback, onReverseCompleteParams: params, immediateRender: false, lazy: false, useFrames: useFrames, overwrite: 0 });
    };
    TweenLite.set = function (target, vars) {
        return new TweenLite(target, 0, vars);
    };
    TweenLite.getTweensOf = function (target, onlyActive) {
        if (target == null) {
            return [];
        }
        target = (typeof (target) !== "string") ? target : TweenLite.selector(target) || target;
        var i, a, j, t;
        if ((_isArray(target) || _isSelector(target)) && typeof (target[0]) !== "number") {
            i = target.length;
            a = [];
            while (--i > -1) {
                a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
            }
            i = a.length;
            //now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
            while (--i > -1) {
                t = a[i];
                j = i;
                while (--j > -1) {
                    if (t === a[j]) {
                        a.splice(i, 1);
                    }
                }
            }
        }
        else {
            a = _register(target).concat();
            i = a.length;
            while (--i > -1) {
                if (a[i]._gc || (onlyActive && !a[i].isActive())) {
                    a.splice(i, 1);
                }
            }
        }
        return a;
    };
    TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function (target, onlyActive, vars) {
        if (typeof (onlyActive) === "object") {
            vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
            onlyActive = false;
        }
        var a = TweenLite.getTweensOf(target, onlyActive), i = a.length;
        while (--i > -1) {
            a[i]._kill(vars, target);
        }
    };
    /*
     * ----------------------------------------------------------------
     * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
     * ----------------------------------------------------------------
     */
    var TweenPlugin = _class("plugins.TweenPlugin", function (props, priority) {
        this._overwriteProps = (props || "").split(",");
        this._propName = this._overwriteProps[0];
        this._priority = priority || 0;
        this._super = TweenPlugin.prototype;
    }, true);
    p = TweenPlugin.prototype;
    TweenPlugin.version = "1.19.0";
    TweenPlugin.API = 2;
    p._firstPT = null;
    p._addTween = _addPropTween;
    p.setRatio = _setRatio;
    p._kill = function (lookup) {
        var a = this._overwriteProps, pt = this._firstPT, i;
        if (lookup[this._propName] != null) {
            this._overwriteProps = [];
        }
        else {
            i = a.length;
            while (--i > -1) {
                if (lookup[a[i]] != null) {
                    a.splice(i, 1);
                }
            }
        }
        while (pt) {
            if (lookup[pt.n] != null) {
                if (pt._next) {
                    pt._next._prev = pt._prev;
                }
                if (pt._prev) {
                    pt._prev._next = pt._next;
                    pt._prev = null;
                }
                else if (this._firstPT === pt) {
                    this._firstPT = pt._next;
                }
            }
            pt = pt._next;
        }
        return false;
    };
    p._mod = p._roundProps = function (lookup) {
        var pt = this._firstPT, val;
        while (pt) {
            val = lookup[this._propName] || (pt.n != null && lookup[pt.n.split(this._propName + "_").join("")]);
            if (val && typeof (val) === "function") {
                if (pt.f === 2) {
                    pt.t._applyPT.m = val;
                }
                else {
                    pt.m = val;
                }
            }
            pt = pt._next;
        }
    };
    TweenLite._onPluginEvent = function (type, tween) {
        var pt = tween._firstPT, changed, pt2, first, last, next;
        if (type === "_onInitAllProps") {
            //sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
            while (pt) {
                next = pt._next;
                pt2 = first;
                while (pt2 && pt2.pr > pt.pr) {
                    pt2 = pt2._next;
                }
                if ((pt._prev = pt2 ? pt2._prev : last)) {
                    pt._prev._next = pt;
                }
                else {
                    first = pt;
                }
                if ((pt._next = pt2)) {
                    pt2._prev = pt;
                }
                else {
                    last = pt;
                }
                pt = next;
            }
            pt = tween._firstPT = first;
        }
        while (pt) {
            if (pt.pg)
                if (typeof (pt.t[type]) === "function")
                    if (pt.t[type]()) {
                        changed = true;
                    }
            pt = pt._next;
        }
        return changed;
    };
    TweenPlugin.activate = function (plugins) {
        var i = plugins.length;
        while (--i > -1) {
            if (plugins[i].API === TweenPlugin.API) {
                _plugins[(new plugins[i]())._propName] = plugins[i];
            }
        }
        return true;
    };
    //provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
    _gsDefine.plugin = function (config) {
        if (!config || !config.propName || !config.init || !config.API) {
            throw "illegal plugin definition.";
        }
        var propName = config.propName, priority = config.priority || 0, overwriteProps = config.overwriteProps, map = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_mod", mod: "_mod", initAll: "_onInitAllProps" }, Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin", function () {
            TweenPlugin.call(this, propName, priority);
            this._overwriteProps = overwriteProps || [];
        }, (config.global === true)), p = Plugin.prototype = new TweenPlugin(propName), prop;
        p.constructor = Plugin;
        Plugin.API = config.API;
        for (prop in map) {
            if (typeof (config[prop]) === "function") {
                p[map[prop]] = config[prop];
            }
        }
        Plugin.version = config.version;
        TweenPlugin.activate([Plugin]);
        return Plugin;
    };
    //now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
    a = window._gsQueue;
    if (a) {
        for (i = 0; i < a.length; i++) {
            a[i]();
        }
        for (p in _defLookup) {
            if (!_defLookup[p].func) {
                window.console.log("GSAP encountered missing dependency: " + p);
            }
        }
    }
    _tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated
})((typeof (module) !== "undefined" && module.exports && typeof (global) !== "undefined") ? global : this || window, "TweenLite");
/*!
 * VERSION: 1.18.6
 * DATE: 2016-07-08
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof (module) !== "undefined" && module.exports && typeof (global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
    "use strict";
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (Animation, SimpleTimeline, TweenLite) {
        var TimelineLite = function (vars) {
            SimpleTimeline.call(this, vars);
            this._labels = {};
            this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
            this.smoothChildTiming = (this.vars.smoothChildTiming === true);
            this._sortChildren = true;
            this._onUpdate = this.vars.onUpdate;
            var v = this.vars, val, p;
            for (p in v) {
                val = v[p];
                if (_isArray(val))
                    if (val.join("").indexOf("{self}") !== -1) {
                        v[p] = this._swapSelfInParams(val);
                    }
            }
            if (_isArray(v.tweens)) {
                this.add(v.tweens, 0, v.align, v.stagger);
            }
        }, _tinyNum = 0.0000000001, TweenLiteInternals = TweenLite._internals, _internals = TimelineLite._internals = {}, _isSelector = TweenLiteInternals.isSelector, _isArray = TweenLiteInternals.isArray, _lazyTweens = TweenLiteInternals.lazyTweens, _lazyRender = TweenLiteInternals.lazyRender, _globals = _gsScope._gsDefine.globals, _copy = function (vars) {
            var copy = {}, p;
            for (p in vars) {
                copy[p] = vars[p];
            }
            return copy;
        }, _applyCycle = function (vars, targets, i) {
            var alt = vars.cycle, p, val;
            for (p in alt) {
                val = alt[p];
                vars[p] = (typeof (val) === "function") ? val(i, targets[i]) : val[i % val.length];
            }
            delete vars.cycle;
        }, _pauseCallback = _internals.pauseCallback = function () { }, _slice = function (a) {
            var b = [], l = a.length, i;
            for (i = 0; i !== l; b.push(a[i++]))
                ;
            return b;
        }, p = TimelineLite.prototype = new SimpleTimeline();
        TimelineLite.version = "1.19.0";
        p.constructor = TimelineLite;
        p.kill()._gc = p._forcingPlayhead = p._hasPause = false;
        /* might use later...
        //translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
        function localToGlobal(time, animation) {
            while (animation) {
                time = (time / animation._timeScale) + animation._startTime;
                animation = animation.timeline;
            }
            return time;
        }

        //translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
        function globalToLocal(time, animation) {
            var scale = 1;
            time -= localToGlobal(0, animation);
            while (animation) {
                scale *= animation._timeScale;
                animation = animation.timeline;
            }
            return time * scale;
        }
        */
        p.to = function (target, duration, vars, position) {
            var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(new Engine(target, duration, vars), position) : this.set(target, vars, position);
        };
        p.from = function (target, duration, vars, position) {
            return this.add(((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
        };
        p.fromTo = function (target, duration, fromVars, toVars, position) {
            var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
        };
        p.staggerTo = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            var tl = new TimelineLite({ onComplete: onCompleteAll, onCompleteParams: onCompleteAllParams, callbackScope: onCompleteAllScope, smoothChildTiming: this.smoothChildTiming }), cycle = vars.cycle, copy, i;
            if (typeof (targets) === "string") {
                targets = TweenLite.selector(targets) || targets;
            }
            targets = targets || [];
            if (_isSelector(targets)) {
                targets = _slice(targets);
            }
            stagger = stagger || 0;
            if (stagger < 0) {
                targets = _slice(targets);
                targets.reverse();
                stagger *= -1;
            }
            for (i = 0; i < targets.length; i++) {
                copy = _copy(vars);
                if (copy.startAt) {
                    copy.startAt = _copy(copy.startAt);
                    if (copy.startAt.cycle) {
                        _applyCycle(copy.startAt, targets, i);
                    }
                }
                if (cycle) {
                    _applyCycle(copy, targets, i);
                    if (copy.duration != null) {
                        duration = copy.duration;
                        delete copy.duration;
                    }
                }
                tl.to(targets[i], duration, copy, i * stagger);
            }
            return this.add(tl, position);
        };
        p.staggerFrom = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            vars.immediateRender = (vars.immediateRender != false);
            vars.runBackwards = true;
            return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.staggerFromTo = function (targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            toVars.startAt = fromVars;
            toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
            return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.call = function (callback, params, scope, position) {
            return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
        };
        p.set = function (target, vars, position) {
            position = this._parseTimeOrLabel(position, 0, true);
            if (vars.immediateRender == null) {
                vars.immediateRender = (position === this._time && !this._paused);
            }
            return this.add(new TweenLite(target, 0, vars), position);
        };
        TimelineLite.exportRoot = function (vars, ignoreDelayedCalls) {
            vars = vars || {};
            if (vars.smoothChildTiming == null) {
                vars.smoothChildTiming = true;
            }
            var tl = new TimelineLite(vars), root = tl._timeline, tween, next;
            if (ignoreDelayedCalls == null) {
                ignoreDelayedCalls = true;
            }
            root._remove(tl, true);
            tl._startTime = 0;
            tl._rawPrevTime = tl._time = tl._totalTime = root._time;
            tween = root._first;
            while (tween) {
                next = tween._next;
                if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
                    tl.add(tween, tween._startTime - tween._delay);
                }
                tween = next;
            }
            root.add(tl, 0);
            return tl;
        };
        p.add = function (value, position, align, stagger) {
            var curTime, l, i, child, tl, beforeRawTime;
            if (typeof (position) !== "number") {
                position = this._parseTimeOrLabel(position, 0, true, value);
            }
            if (!(value instanceof Animation)) {
                if ((value instanceof Array) || (value && value.push && _isArray(value))) {
                    align = align || "normal";
                    stagger = stagger || 0;
                    curTime = position;
                    l = value.length;
                    for (i = 0; i < l; i++) {
                        if (_isArray(child = value[i])) {
                            child = new TimelineLite({ tweens: child });
                        }
                        this.add(child, curTime);
                        if (typeof (child) !== "string" && typeof (child) !== "function") {
                            if (align === "sequence") {
                                curTime = child._startTime + (child.totalDuration() / child._timeScale);
                            }
                            else if (align === "start") {
                                child._startTime -= child.delay();
                            }
                        }
                        curTime += stagger;
                    }
                    return this._uncache(true);
                }
                else if (typeof (value) === "string") {
                    return this.addLabel(value, position);
                }
                else if (typeof (value) === "function") {
                    value = TweenLite.delayedCall(0, value);
                }
                else {
                    throw ("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
                }
            }
            SimpleTimeline.prototype.add.call(this, value, position);
            //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
            if (this._gc || this._time === this._duration)
                if (!this._paused)
                    if (this._duration < this.duration()) {
                        //in case any of the ancestors had completed but should now be enabled...
                        tl = this;
                        beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
                        while (tl._timeline) {
                            if (beforeRawTime && tl._timeline.smoothChildTiming) {
                                tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
                            }
                            else if (tl._gc) {
                                tl._enabled(true, false);
                            }
                            tl = tl._timeline;
                        }
                    }
            return this;
        };
        p.remove = function (value) {
            if (value instanceof Animation) {
                this._remove(value, false);
                var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
                value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
                return this;
            }
            else if (value instanceof Array || (value && value.push && _isArray(value))) {
                var i = value.length;
                while (--i > -1) {
                    this.remove(value[i]);
                }
                return this;
            }
            else if (typeof (value) === "string") {
                return this.removeLabel(value);
            }
            return this.kill(null, value);
        };
        p._remove = function (tween, skipDisable) {
            SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
            var last = this._last;
            if (!last) {
                this._time = this._totalTime = this._duration = this._totalDuration = 0;
            }
            else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
                this._time = this.duration();
                this._totalTime = this._totalDuration;
            }
            return this;
        };
        p.append = function (value, offsetOrLabel) {
            return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
        };
        p.insert = p.insertMultiple = function (value, position, align, stagger) {
            return this.add(value, position || 0, align, stagger);
        };
        p.appendMultiple = function (tweens, offsetOrLabel, align, stagger) {
            return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
        };
        p.addLabel = function (label, position) {
            this._labels[label] = this._parseTimeOrLabel(position);
            return this;
        };
        p.addPause = function (position, callback, params, scope) {
            var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
            t.vars.onComplete = t.vars.onReverseComplete = callback;
            t.data = "isPause";
            this._hasPause = true;
            return this.add(t, position);
        };
        p.removeLabel = function (label) {
            delete this._labels[label];
            return this;
        };
        p.getLabelTime = function (label) {
            return (this._labels[label] != null) ? this._labels[label] : -1;
        };
        p._parseTimeOrLabel = function (timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
            var i;
            //if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
            if (ignore instanceof Animation && ignore.timeline === this) {
                this.remove(ignore);
            }
            else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
                i = ignore.length;
                while (--i > -1) {
                    if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
                        this.remove(ignore[i]);
                    }
                }
            }
            if (typeof (offsetOrLabel) === "string") {
                return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof (timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
            }
            offsetOrLabel = offsetOrLabel || 0;
            if (typeof (timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) {
                i = timeOrLabel.indexOf("=");
                if (i === -1) {
                    if (this._labels[timeOrLabel] == null) {
                        return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
                    }
                    return this._labels[timeOrLabel] + offsetOrLabel;
                }
                offsetOrLabel = parseInt(timeOrLabel.charAt(i - 1) + "1", 10) * Number(timeOrLabel.substr(i + 1));
                timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i - 1), 0, appendIfAbsent) : this.duration();
            }
            else if (timeOrLabel == null) {
                timeOrLabel = this.duration();
            }
            return Number(timeOrLabel) + offsetOrLabel;
        };
        p.seek = function (position, suppressEvents) {
            return this.totalTime((typeof (position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
        };
        p.stop = function () {
            return this.paused(true);
        };
        p.gotoAndPlay = function (position, suppressEvents) {
            return this.play(position, suppressEvents);
        };
        p.gotoAndStop = function (position, suppressEvents) {
            return this.pause(position, suppressEvents);
        };
        p.render = function (time, suppressEvents, force) {
            if (this._gc) {
                this._enabled(true, false);
            }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(), prevTime = this._time, prevStart = this._startTime, prevTimeScale = this._timeScale, prevPaused = this._paused, tween, isComplete, next, callback, internalForce, pauseTween, curTime;
            if (time >= totalDur - 0.0000001) {
                this._totalTime = this._time = totalDur;
                if (!this._reversed)
                    if (!this._hasPausedChild()) {
                        isComplete = true;
                        callback = "onComplete";
                        internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
                        if (this._duration === 0)
                            if ((time <= 0 && time >= -0.0000001) || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum)
                                if (this._rawPrevTime !== time && this._first) {
                                    internalForce = true;
                                    if (this._rawPrevTime > _tinyNum) {
                                        callback = "onReverseComplete";
                                    }
                                }
                    }
                this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.
            }
            else if (time < 0.0000001) {
                this._totalTime = this._time = 0;
                if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (this._timeline.autoRemoveChildren && this._reversed) {
                        internalForce = isComplete = true;
                        callback = "onReverseComplete";
                    }
                    else if (this._rawPrevTime >= 0 && this._first) {
                        internalForce = true;
                    }
                    this._rawPrevTime = time;
                }
                else {
                    this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                    if (time === 0 && isComplete) {
                        tween = this._first;
                        while (tween && tween._startTime === 0) {
                            if (!tween._duration) {
                                isComplete = false;
                            }
                            tween = tween._next;
                        }
                    }
                    time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
                    if (!this._initted) {
                        internalForce = true;
                    }
                }
            }
            else {
                if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
                    if (time >= prevTime) {
                        tween = this._first;
                        while (tween && tween._startTime <= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
                                    pauseTween = tween;
                                }
                            tween = tween._next;
                        }
                    }
                    else {
                        tween = this._last;
                        while (tween && tween._startTime >= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && tween._rawPrevTime > 0) {
                                    pauseTween = tween;
                                }
                            tween = tween._prev;
                        }
                    }
                    if (pauseTween) {
                        this._time = time = pauseTween._startTime;
                        this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
                    }
                }
                this._totalTime = this._time = this._rawPrevTime = time;
            }
            if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
                return;
            }
            else if (!this._initted) {
                this._initted = true;
            }
            if (!this._active)
                if (!this._paused && this._time !== prevTime && time > 0) {
                    this._active = true; //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
                }
            if (prevTime === 0)
                if (this.vars.onStart)
                    if (this._time !== 0 || !this._duration)
                        if (!suppressEvents) {
                            this._callback("onStart");
                        }
            curTime = this._time;
            if (curTime >= prevTime) {
                tween = this._first;
                while (tween) {
                    next = tween._next; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            else {
                tween = this._last;
                while (tween) {
                    next = tween._prev; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
                            while (pauseTween && pauseTween.endTime() > this._time) {
                                pauseTween.render((pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
                                pauseTween = pauseTween._prev;
                            }
                            pauseTween = null;
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            if (this._onUpdate)
                if (!suppressEvents) {
                    if (_lazyTweens.length) {
                        _lazyRender();
                    }
                    this._callback("onUpdate");
                }
            if (callback)
                if (!this._gc)
                    if (prevStart === this._startTime || prevTimeScale !== this._timeScale)
                        if (this._time === 0 || totalDur >= this.totalDuration()) {
                            if (isComplete) {
                                if (_lazyTweens.length) {
                                    _lazyRender();
                                }
                                if (this._timeline.autoRemoveChildren) {
                                    this._enabled(false, false);
                                }
                                this._active = false;
                            }
                            if (!suppressEvents && this.vars[callback]) {
                                this._callback(callback);
                            }
                        }
        };
        p._hasPausedChild = function () {
            var tween = this._first;
            while (tween) {
                if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
                    return true;
                }
                tween = tween._next;
            }
            return false;
        };
        p.getChildren = function (nested, tweens, timelines, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || -9999999999;
            var a = [], tween = this._first, cnt = 0;
            while (tween) {
                if (tween._startTime < ignoreBeforeTime) {
                }
                else if (tween instanceof TweenLite) {
                    if (tweens !== false) {
                        a[cnt++] = tween;
                    }
                }
                else {
                    if (timelines !== false) {
                        a[cnt++] = tween;
                    }
                    if (nested !== false) {
                        a = a.concat(tween.getChildren(true, tweens, timelines));
                        cnt = a.length;
                    }
                }
                tween = tween._next;
            }
            return a;
        };
        p.getTweensOf = function (target, nested) {
            var disabled = this._gc, a = [], cnt = 0, tweens, i;
            if (disabled) {
                this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
            }
            tweens = TweenLite.getTweensOf(target);
            i = tweens.length;
            while (--i > -1) {
                if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
                    a[cnt++] = tweens[i];
                }
            }
            if (disabled) {
                this._enabled(false, true);
            }
            return a;
        };
        p.recent = function () {
            return this._recent;
        };
        p._contains = function (tween) {
            var tl = tween.timeline;
            while (tl) {
                if (tl === this) {
                    return true;
                }
                tl = tl.timeline;
            }
            return false;
        };
        p.shiftChildren = function (amount, adjustLabels, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || 0;
            var tween = this._first, labels = this._labels, p;
            while (tween) {
                if (tween._startTime >= ignoreBeforeTime) {
                    tween._startTime += amount;
                }
                tween = tween._next;
            }
            if (adjustLabels) {
                for (p in labels) {
                    if (labels[p] >= ignoreBeforeTime) {
                        labels[p] += amount;
                    }
                }
            }
            return this._uncache(true);
        };
        p._kill = function (vars, target) {
            if (!vars && !target) {
                return this._enabled(false, false);
            }
            var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target), i = tweens.length, changed = false;
            while (--i > -1) {
                if (tweens[i]._kill(vars, target)) {
                    changed = true;
                }
            }
            return changed;
        };
        p.clear = function (labels) {
            var tweens = this.getChildren(false, true, true), i = tweens.length;
            this._time = this._totalTime = 0;
            while (--i > -1) {
                tweens[i]._enabled(false, false);
            }
            if (labels !== false) {
                this._labels = {};
            }
            return this._uncache(true);
        };
        p.invalidate = function () {
            var tween = this._first;
            while (tween) {
                tween.invalidate();
                tween = tween._next;
            }
            return Animation.prototype.invalidate.call(this);
            ;
        };
        p._enabled = function (enabled, ignoreTimeline) {
            if (enabled === this._gc) {
                var tween = this._first;
                while (tween) {
                    tween._enabled(enabled, true);
                    tween = tween._next;
                }
            }
            return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
        };
        p.totalTime = function (time, suppressEvents, uncapped) {
            this._forcingPlayhead = true;
            var val = Animation.prototype.totalTime.apply(this, arguments);
            this._forcingPlayhead = false;
            return val;
        };
        p.duration = function (value) {
            if (!arguments.length) {
                if (this._dirty) {
                    this.totalDuration(); //just triggers recalculation
                }
                return this._duration;
            }
            if (this.duration() !== 0 && value !== 0) {
                this.timeScale(this._duration / value);
            }
            return this;
        };
        p.totalDuration = function (value) {
            if (!arguments.length) {
                if (this._dirty) {
                    var max = 0, tween = this._last, prevStart = 999999999999, prev, end;
                    while (tween) {
                        prev = tween._prev; //record it here in case the tween changes position in the sequence...
                        if (tween._dirty) {
                            tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
                        }
                        if (tween._startTime > prevStart && this._sortChildren && !tween._paused) {
                            this.add(tween, tween._startTime - tween._delay);
                        }
                        else {
                            prevStart = tween._startTime;
                        }
                        if (tween._startTime < 0 && !tween._paused) {
                            max -= tween._startTime;
                            if (this._timeline.smoothChildTiming) {
                                this._startTime += tween._startTime / this._timeScale;
                            }
                            this.shiftChildren(-tween._startTime, false, -9999999999);
                            prevStart = 0;
                        }
                        end = tween._startTime + (tween._totalDuration / tween._timeScale);
                        if (end > max) {
                            max = end;
                        }
                        tween = prev;
                    }
                    this._duration = this._totalDuration = max;
                    this._dirty = false;
                }
                return this._totalDuration;
            }
            return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
        };
        p.paused = function (value) {
            if (!value) {
                var tween = this._first, time = this._time;
                while (tween) {
                    if (tween._startTime === time && tween.data === "isPause") {
                        tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
                    }
                    tween = tween._next;
                }
            }
            return Animation.prototype.paused.apply(this, arguments);
        };
        p.usesFrames = function () {
            var tl = this._timeline;
            while (tl._timeline) {
                tl = tl._timeline;
            }
            return (tl === Animation._rootFramesTimeline);
        };
        p.rawTime = function () {
            return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
        };
        return TimelineLite;
    }, true);
});
if (_gsScope._gsDefine) {
    _gsScope._gsQueue.pop()();
}
//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
(function (name) {
    "use strict";
    var getGlobal = function () {
        return (_gsScope.GreenSockGlobals || _gsScope)[name];
    };
    if (typeof (define) === "function" && define.amd) {
        define(["TweenLite"], getGlobal);
    }
    else if (typeof (module) !== "undefined" && module.exports) {
        require("./TweenLite.js"); //dependency
        module.exports = getGlobal();
    }
}("TimelineLite"));
/*!
 * VERSION: 1.18.6
 * DATE: 2016-07-12
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof (module) !== "undefined" && module.exports && typeof (global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
    "use strict";
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (TimelineLite, TweenLite, Ease) {
        var TimelineMax = function (vars) {
            TimelineLite.call(this, vars);
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._cycle = 0;
            this._yoyo = (this.vars.yoyo === true);
            this._dirty = true;
        }, _tinyNum = 0.0000000001, TweenLiteInternals = TweenLite._internals, _lazyTweens = TweenLiteInternals.lazyTweens, _lazyRender = TweenLiteInternals.lazyRender, _globals = _gsScope._gsDefine.globals, _easeNone = new Ease(null, null, 1, 0), p = TimelineMax.prototype = new TimelineLite();
        p.constructor = TimelineMax;
        p.kill()._gc = false;
        TimelineMax.version = "1.19.0";
        p.invalidate = function () {
            this._yoyo = (this.vars.yoyo === true);
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._uncache(true);
            return TimelineLite.prototype.invalidate.call(this);
        };
        p.addCallback = function (callback, position, params, scope) {
            return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
        };
        p.removeCallback = function (callback, position) {
            if (callback) {
                if (position == null) {
                    this._kill(null, callback);
                }
                else {
                    var a = this.getTweensOf(callback, false), i = a.length, time = this._parseTimeOrLabel(position);
                    while (--i > -1) {
                        if (a[i]._startTime === time) {
                            a[i]._enabled(false, false);
                        }
                    }
                }
            }
            return this;
        };
        p.removePause = function (position) {
            return this.removeCallback(TimelineLite._internals.pauseCallback, position);
        };
        p.tweenTo = function (position, vars) {
            vars = vars || {};
            var copy = { ease: _easeNone, useFrames: this.usesFrames(), immediateRender: false }, Engine = (vars.repeat && _globals.TweenMax) || TweenLite, duration, p, t;
            for (p in vars) {
                copy[p] = vars[p];
            }
            copy.time = this._parseTimeOrLabel(position);
            duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
            t = new Engine(this, duration, copy);
            copy.onStart = function () {
                t.target.paused(true);
                if (t.vars.time !== t.target.time() && duration === t.duration()) {
                    t.duration(Math.abs(t.vars.time - t.target.time()) / t.target._timeScale);
                }
                if (vars.onStart) {
                    t._callback("onStart");
                }
            };
            return t;
        };
        p.tweenFromTo = function (fromPosition, toPosition, vars) {
            vars = vars || {};
            fromPosition = this._parseTimeOrLabel(fromPosition);
            vars.startAt = { onComplete: this.seek, onCompleteParams: [fromPosition], callbackScope: this };
            vars.immediateRender = (vars.immediateRender !== false);
            var t = this.tweenTo(toPosition, vars);
            return t.duration((Math.abs(t.vars.time - fromPosition) / this._timeScale) || 0.001);
        };
        p.render = function (time, suppressEvents, force) {
            if (this._gc) {
                this._enabled(true, false);
            }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(), dur = this._duration, prevTime = this._time, prevTotalTime = this._totalTime, prevStart = this._startTime, prevTimeScale = this._timeScale, prevRawPrevTime = this._rawPrevTime, prevPaused = this._paused, prevCycle = this._cycle, tween, isComplete, next, callback, internalForce, cycleDuration, pauseTween, curTime;
            if (time >= totalDur - 0.0000001) {
                if (!this._locked) {
                    this._totalTime = totalDur;
                    this._cycle = this._repeat;
                }
                if (!this._reversed)
                    if (!this._hasPausedChild()) {
                        isComplete = true;
                        callback = "onComplete";
                        internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
                        if (this._duration === 0)
                            if ((time <= 0 && time >= -0.0000001) || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum)
                                if (prevRawPrevTime !== time && this._first) {
                                    internalForce = true;
                                    if (prevRawPrevTime > _tinyNum) {
                                        callback = "onReverseComplete";
                                    }
                                }
                    }
                this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                if (this._yoyo && (this._cycle & 1) !== 0) {
                    this._time = time = 0;
                }
                else {
                    this._time = dur;
                    time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
                }
            }
            else if (time < 0.0000001) {
                if (!this._locked) {
                    this._totalTime = this._cycle = 0;
                }
                this._time = 0;
                if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (this._timeline.autoRemoveChildren && this._reversed) {
                        internalForce = isComplete = true;
                        callback = "onReverseComplete";
                    }
                    else if (prevRawPrevTime >= 0 && this._first) {
                        internalForce = true;
                    }
                    this._rawPrevTime = time;
                }
                else {
                    this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                    if (time === 0 && isComplete) {
                        tween = this._first;
                        while (tween && tween._startTime === 0) {
                            if (!tween._duration) {
                                isComplete = false;
                            }
                            tween = tween._next;
                        }
                    }
                    time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
                    if (!this._initted) {
                        internalForce = true;
                    }
                }
            }
            else {
                if (dur === 0 && prevRawPrevTime < 0) {
                    internalForce = true;
                }
                this._time = this._rawPrevTime = time;
                if (!this._locked) {
                    this._totalTime = time;
                    if (this._repeat !== 0) {
                        cycleDuration = dur + this._repeatDelay;
                        this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
                        if (this._cycle !== 0)
                            if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
                                this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
                            }
                        this._time = this._totalTime - (this._cycle * cycleDuration);
                        if (this._yoyo)
                            if ((this._cycle & 1) !== 0) {
                                this._time = dur - this._time;
                            }
                        if (this._time > dur) {
                            this._time = dur;
                            time = dur + 0.0001; //to avoid occasional floating point rounding error
                        }
                        else if (this._time < 0) {
                            this._time = time = 0;
                        }
                        else {
                            time = this._time;
                        }
                    }
                }
                if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
                    time = this._time;
                    if (time >= prevTime) {
                        tween = this._first;
                        while (tween && tween._startTime <= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
                                    pauseTween = tween;
                                }
                            tween = tween._next;
                        }
                    }
                    else {
                        tween = this._last;
                        while (tween && tween._startTime >= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && tween._rawPrevTime > 0) {
                                    pauseTween = tween;
                                }
                            tween = tween._prev;
                        }
                    }
                    if (pauseTween) {
                        this._time = time = pauseTween._startTime;
                        this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
                    }
                }
            }
            if (this._cycle !== prevCycle)
                if (!this._locked) {
                    /*
                    make sure children at the end/beginning of the timeline are rendered properly. If, for example,
                    a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
                    would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
                    could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
                    we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
                    ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
                    */
                    var backwards = (this._yoyo && (prevCycle & 1) !== 0), wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)), recTotalTime = this._totalTime, recCycle = this._cycle, recRawPrevTime = this._rawPrevTime, recTime = this._time;
                    this._totalTime = prevCycle * dur;
                    if (this._cycle < prevCycle) {
                        backwards = !backwards;
                    }
                    else {
                        this._totalTime += dur;
                    }
                    this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.
                    this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
                    this._cycle = prevCycle;
                    this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
                    prevTime = (backwards) ? 0 : dur;
                    this.render(prevTime, suppressEvents, (dur === 0));
                    if (!suppressEvents)
                        if (!this._gc) {
                            if (this.vars.onRepeat) {
                                this._callback("onRepeat");
                            }
                        }
                    if (prevTime !== this._time) {
                        return;
                    }
                    if (wrap) {
                        prevTime = (backwards) ? dur + 0.0001 : -0.0001;
                        this.render(prevTime, true, false);
                    }
                    this._locked = false;
                    if (this._paused && !prevPaused) {
                        return;
                    }
                    this._time = recTime;
                    this._totalTime = recTotalTime;
                    this._cycle = recCycle;
                    this._rawPrevTime = recRawPrevTime;
                }
            if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
                if (prevTotalTime !== this._totalTime)
                    if (this._onUpdate)
                        if (!suppressEvents) {
                            this._callback("onUpdate");
                        }
                return;
            }
            else if (!this._initted) {
                this._initted = true;
            }
            if (!this._active)
                if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
                    this._active = true; //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
                }
            if (prevTotalTime === 0)
                if (this.vars.onStart)
                    if (this._totalTime !== 0 || !this._totalDuration)
                        if (!suppressEvents) {
                            this._callback("onStart");
                        }
            curTime = this._time;
            if (curTime >= prevTime) {
                tween = this._first;
                while (tween) {
                    next = tween._next; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            else {
                tween = this._last;
                while (tween) {
                    next = tween._prev; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
                            while (pauseTween && pauseTween.endTime() > this._time) {
                                pauseTween.render((pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
                                pauseTween = pauseTween._prev;
                            }
                            pauseTween = null;
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            if (this._onUpdate)
                if (!suppressEvents) {
                    if (_lazyTweens.length) {
                        _lazyRender();
                    }
                    this._callback("onUpdate");
                }
            if (callback)
                if (!this._locked)
                    if (!this._gc)
                        if (prevStart === this._startTime || prevTimeScale !== this._timeScale)
                            if (this._time === 0 || totalDur >= this.totalDuration()) {
                                if (isComplete) {
                                    if (_lazyTweens.length) {
                                        _lazyRender();
                                    }
                                    if (this._timeline.autoRemoveChildren) {
                                        this._enabled(false, false);
                                    }
                                    this._active = false;
                                }
                                if (!suppressEvents && this.vars[callback]) {
                                    this._callback(callback);
                                }
                            }
        };
        p.getActive = function (nested, tweens, timelines) {
            if (nested == null) {
                nested = true;
            }
            if (tweens == null) {
                tweens = true;
            }
            if (timelines == null) {
                timelines = false;
            }
            var a = [], all = this.getChildren(nested, tweens, timelines), cnt = 0, l = all.length, i, tween;
            for (i = 0; i < l; i++) {
                tween = all[i];
                if (tween.isActive()) {
                    a[cnt++] = tween;
                }
            }
            return a;
        };
        p.getLabelAfter = function (time) {
            if (!time)
                if (time !== 0) {
                    time = this._time;
                }
            var labels = this.getLabelsArray(), l = labels.length, i;
            for (i = 0; i < l; i++) {
                if (labels[i].time > time) {
                    return labels[i].name;
                }
            }
            return null;
        };
        p.getLabelBefore = function (time) {
            if (time == null) {
                time = this._time;
            }
            var labels = this.getLabelsArray(), i = labels.length;
            while (--i > -1) {
                if (labels[i].time < time) {
                    return labels[i].name;
                }
            }
            return null;
        };
        p.getLabelsArray = function () {
            var a = [], cnt = 0, p;
            for (p in this._labels) {
                a[cnt++] = { time: this._labels[p], name: p };
            }
            a.sort(function (a, b) {
                return a.time - b.time;
            });
            return a;
        };
        //---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------
        p.progress = function (value, suppressEvents) {
            return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
        };
        p.totalProgress = function (value, suppressEvents) {
            return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime(this.totalDuration() * value, suppressEvents);
        };
        p.totalDuration = function (value) {
            if (!arguments.length) {
                if (this._dirty) {
                    TimelineLite.prototype.totalDuration.call(this); //just forces refresh
                    //Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
                    this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
                }
                return this._totalDuration;
            }
            return (this._repeat === -1 || !value) ? this : this.timeScale(this.totalDuration() / value);
        };
        p.time = function (value, suppressEvents) {
            if (!arguments.length) {
                return this._time;
            }
            if (this._dirty) {
                this.totalDuration();
            }
            if (value > this._duration) {
                value = this._duration;
            }
            if (this._yoyo && (this._cycle & 1) !== 0) {
                value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
            }
            else if (this._repeat !== 0) {
                value += this._cycle * (this._duration + this._repeatDelay);
            }
            return this.totalTime(value, suppressEvents);
        };
        p.repeat = function (value) {
            if (!arguments.length) {
                return this._repeat;
            }
            this._repeat = value;
            return this._uncache(true);
        };
        p.repeatDelay = function (value) {
            if (!arguments.length) {
                return this._repeatDelay;
            }
            this._repeatDelay = value;
            return this._uncache(true);
        };
        p.yoyo = function (value) {
            if (!arguments.length) {
                return this._yoyo;
            }
            this._yoyo = value;
            return this;
        };
        p.currentLabel = function (value) {
            if (!arguments.length) {
                return this.getLabelBefore(this._time + 0.00000001);
            }
            return this.seek(value, true);
        };
        return TimelineMax;
    }, true);
    /*
     * ----------------------------------------------------------------
     * TimelineLite
     * ----------------------------------------------------------------
     */
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (Animation, SimpleTimeline, TweenLite) {
        var TimelineLite = function (vars) {
            SimpleTimeline.call(this, vars);
            this._labels = {};
            this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
            this.smoothChildTiming = (this.vars.smoothChildTiming === true);
            this._sortChildren = true;
            this._onUpdate = this.vars.onUpdate;
            var v = this.vars, val, p;
            for (p in v) {
                val = v[p];
                if (_isArray(val))
                    if (val.join("").indexOf("{self}") !== -1) {
                        v[p] = this._swapSelfInParams(val);
                    }
            }
            if (_isArray(v.tweens)) {
                this.add(v.tweens, 0, v.align, v.stagger);
            }
        }, _tinyNum = 0.0000000001, TweenLiteInternals = TweenLite._internals, _internals = TimelineLite._internals = {}, _isSelector = TweenLiteInternals.isSelector, _isArray = TweenLiteInternals.isArray, _lazyTweens = TweenLiteInternals.lazyTweens, _lazyRender = TweenLiteInternals.lazyRender, _globals = _gsScope._gsDefine.globals, _copy = function (vars) {
            var copy = {}, p;
            for (p in vars) {
                copy[p] = vars[p];
            }
            return copy;
        }, _applyCycle = function (vars, targets, i) {
            var alt = vars.cycle, p, val;
            for (p in alt) {
                val = alt[p];
                vars[p] = (typeof (val) === "function") ? val.call(targets[i], i) : val[i % val.length];
            }
            delete vars.cycle;
        }, _pauseCallback = _internals.pauseCallback = function () { }, _slice = function (a) {
            var b = [], l = a.length, i;
            for (i = 0; i !== l; b.push(a[i++]))
                ;
            return b;
        }, p = TimelineLite.prototype = new SimpleTimeline();
        TimelineLite.version = "1.19.0";
        p.constructor = TimelineLite;
        p.kill()._gc = p._forcingPlayhead = p._hasPause = false;
        /* might use later...
        //translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
        function localToGlobal(time, animation) {
            while (animation) {
                time = (time / animation._timeScale) + animation._startTime;
                animation = animation.timeline;
            }
            return time;
        }

        //translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
        function globalToLocal(time, animation) {
            var scale = 1;
            time -= localToGlobal(0, animation);
            while (animation) {
                scale *= animation._timeScale;
                animation = animation.timeline;
            }
            return time * scale;
        }
        */
        p.to = function (target, duration, vars, position) {
            var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(new Engine(target, duration, vars), position) : this.set(target, vars, position);
        };
        p.from = function (target, duration, vars, position) {
            return this.add(((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
        };
        p.fromTo = function (target, duration, fromVars, toVars, position) {
            var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
            return duration ? this.add(Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
        };
        p.staggerTo = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            var tl = new TimelineLite({ onComplete: onCompleteAll, onCompleteParams: onCompleteAllParams, callbackScope: onCompleteAllScope, smoothChildTiming: this.smoothChildTiming }), cycle = vars.cycle, copy, i;
            if (typeof (targets) === "string") {
                targets = TweenLite.selector(targets) || targets;
            }
            targets = targets || [];
            if (_isSelector(targets)) {
                targets = _slice(targets);
            }
            stagger = stagger || 0;
            if (stagger < 0) {
                targets = _slice(targets);
                targets.reverse();
                stagger *= -1;
            }
            for (i = 0; i < targets.length; i++) {
                copy = _copy(vars);
                if (copy.startAt) {
                    copy.startAt = _copy(copy.startAt);
                    if (copy.startAt.cycle) {
                        _applyCycle(copy.startAt, targets, i);
                    }
                }
                if (cycle) {
                    _applyCycle(copy, targets, i);
                    if (copy.duration != null) {
                        duration = copy.duration;
                        delete copy.duration;
                    }
                }
                tl.to(targets[i], duration, copy, i * stagger);
            }
            return this.add(tl, position);
        };
        p.staggerFrom = function (targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            vars.immediateRender = (vars.immediateRender != false);
            vars.runBackwards = true;
            return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.staggerFromTo = function (targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
            toVars.startAt = fromVars;
            toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
            return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
        };
        p.call = function (callback, params, scope, position) {
            return this.add(TweenLite.delayedCall(0, callback, params, scope), position);
        };
        p.set = function (target, vars, position) {
            position = this._parseTimeOrLabel(position, 0, true);
            if (vars.immediateRender == null) {
                vars.immediateRender = (position === this._time && !this._paused);
            }
            return this.add(new TweenLite(target, 0, vars), position);
        };
        TimelineLite.exportRoot = function (vars, ignoreDelayedCalls) {
            vars = vars || {};
            if (vars.smoothChildTiming == null) {
                vars.smoothChildTiming = true;
            }
            var tl = new TimelineLite(vars), root = tl._timeline, tween, next;
            if (ignoreDelayedCalls == null) {
                ignoreDelayedCalls = true;
            }
            root._remove(tl, true);
            tl._startTime = 0;
            tl._rawPrevTime = tl._time = tl._totalTime = root._time;
            tween = root._first;
            while (tween) {
                next = tween._next;
                if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
                    tl.add(tween, tween._startTime - tween._delay);
                }
                tween = next;
            }
            root.add(tl, 0);
            return tl;
        };
        p.add = function (value, position, align, stagger) {
            var curTime, l, i, child, tl, beforeRawTime;
            if (typeof (position) !== "number") {
                position = this._parseTimeOrLabel(position, 0, true, value);
            }
            if (!(value instanceof Animation)) {
                if ((value instanceof Array) || (value && value.push && _isArray(value))) {
                    align = align || "normal";
                    stagger = stagger || 0;
                    curTime = position;
                    l = value.length;
                    for (i = 0; i < l; i++) {
                        if (_isArray(child = value[i])) {
                            child = new TimelineLite({ tweens: child });
                        }
                        this.add(child, curTime);
                        if (typeof (child) !== "string" && typeof (child) !== "function") {
                            if (align === "sequence") {
                                curTime = child._startTime + (child.totalDuration() / child._timeScale);
                            }
                            else if (align === "start") {
                                child._startTime -= child.delay();
                            }
                        }
                        curTime += stagger;
                    }
                    return this._uncache(true);
                }
                else if (typeof (value) === "string") {
                    return this.addLabel(value, position);
                }
                else if (typeof (value) === "function") {
                    value = TweenLite.delayedCall(0, value);
                }
                else {
                    throw ("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
                }
            }
            SimpleTimeline.prototype.add.call(this, value, position);
            //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
            if (this._gc || this._time === this._duration)
                if (!this._paused)
                    if (this._duration < this.duration()) {
                        //in case any of the ancestors had completed but should now be enabled...
                        tl = this;
                        beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
                        while (tl._timeline) {
                            if (beforeRawTime && tl._timeline.smoothChildTiming) {
                                tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
                            }
                            else if (tl._gc) {
                                tl._enabled(true, false);
                            }
                            tl = tl._timeline;
                        }
                    }
            return this;
        };
        p.remove = function (value) {
            if (value instanceof Animation) {
                this._remove(value, false);
                var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
                value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
                return this;
            }
            else if (value instanceof Array || (value && value.push && _isArray(value))) {
                var i = value.length;
                while (--i > -1) {
                    this.remove(value[i]);
                }
                return this;
            }
            else if (typeof (value) === "string") {
                return this.removeLabel(value);
            }
            return this.kill(null, value);
        };
        p._remove = function (tween, skipDisable) {
            SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
            var last = this._last;
            if (!last) {
                this._time = this._totalTime = this._duration = this._totalDuration = 0;
            }
            else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
                this._time = this.duration();
                this._totalTime = this._totalDuration;
            }
            return this;
        };
        p.append = function (value, offsetOrLabel) {
            return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
        };
        p.insert = p.insertMultiple = function (value, position, align, stagger) {
            return this.add(value, position || 0, align, stagger);
        };
        p.appendMultiple = function (tweens, offsetOrLabel, align, stagger) {
            return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
        };
        p.addLabel = function (label, position) {
            this._labels[label] = this._parseTimeOrLabel(position);
            return this;
        };
        p.addPause = function (position, callback, params, scope) {
            var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
            t.vars.onComplete = t.vars.onReverseComplete = callback;
            t.data = "isPause";
            this._hasPause = true;
            return this.add(t, position);
        };
        p.removeLabel = function (label) {
            delete this._labels[label];
            return this;
        };
        p.getLabelTime = function (label) {
            return (this._labels[label] != null) ? this._labels[label] : -1;
        };
        p._parseTimeOrLabel = function (timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
            var i;
            //if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
            if (ignore instanceof Animation && ignore.timeline === this) {
                this.remove(ignore);
            }
            else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
                i = ignore.length;
                while (--i > -1) {
                    if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
                        this.remove(ignore[i]);
                    }
                }
            }
            if (typeof (offsetOrLabel) === "string") {
                return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof (timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
            }
            offsetOrLabel = offsetOrLabel || 0;
            if (typeof (timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) {
                i = timeOrLabel.indexOf("=");
                if (i === -1) {
                    if (this._labels[timeOrLabel] == null) {
                        return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
                    }
                    return this._labels[timeOrLabel] + offsetOrLabel;
                }
                offsetOrLabel = parseInt(timeOrLabel.charAt(i - 1) + "1", 10) * Number(timeOrLabel.substr(i + 1));
                timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i - 1), 0, appendIfAbsent) : this.duration();
            }
            else if (timeOrLabel == null) {
                timeOrLabel = this.duration();
            }
            return Number(timeOrLabel) + offsetOrLabel;
        };
        p.seek = function (position, suppressEvents) {
            return this.totalTime((typeof (position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
        };
        p.stop = function () {
            return this.paused(true);
        };
        p.gotoAndPlay = function (position, suppressEvents) {
            return this.play(position, suppressEvents);
        };
        p.gotoAndStop = function (position, suppressEvents) {
            return this.pause(position, suppressEvents);
        };
        p.render = function (time, suppressEvents, force) {
            if (this._gc) {
                this._enabled(true, false);
            }
            var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(), prevTime = this._time, prevStart = this._startTime, prevTimeScale = this._timeScale, prevPaused = this._paused, tween, isComplete, next, callback, internalForce, pauseTween, curTime;
            if (time >= totalDur - 0.0000001) {
                this._totalTime = this._time = totalDur;
                if (!this._reversed)
                    if (!this._hasPausedChild()) {
                        isComplete = true;
                        callback = "onComplete";
                        internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
                        if (this._duration === 0)
                            if ((time <= 0 && time >= -0.0000001) || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum)
                                if (this._rawPrevTime !== time && this._first) {
                                    internalForce = true;
                                    if (this._rawPrevTime > _tinyNum) {
                                        callback = "onReverseComplete";
                                    }
                                }
                    }
                this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.
            }
            else if (time < 0.0000001) {
                this._totalTime = this._time = 0;
                if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
                    callback = "onReverseComplete";
                    isComplete = this._reversed;
                }
                if (time < 0) {
                    this._active = false;
                    if (this._timeline.autoRemoveChildren && this._reversed) {
                        internalForce = isComplete = true;
                        callback = "onReverseComplete";
                    }
                    else if (this._rawPrevTime >= 0 && this._first) {
                        internalForce = true;
                    }
                    this._rawPrevTime = time;
                }
                else {
                    this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
                    if (time === 0 && isComplete) {
                        tween = this._first;
                        while (tween && tween._startTime === 0) {
                            if (!tween._duration) {
                                isComplete = false;
                            }
                            tween = tween._next;
                        }
                    }
                    time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
                    if (!this._initted) {
                        internalForce = true;
                    }
                }
            }
            else {
                if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
                    if (time >= prevTime) {
                        tween = this._first;
                        while (tween && tween._startTime <= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
                                    pauseTween = tween;
                                }
                            tween = tween._next;
                        }
                    }
                    else {
                        tween = this._last;
                        while (tween && tween._startTime >= time && !pauseTween) {
                            if (!tween._duration)
                                if (tween.data === "isPause" && tween._rawPrevTime > 0) {
                                    pauseTween = tween;
                                }
                            tween = tween._prev;
                        }
                    }
                    if (pauseTween) {
                        this._time = time = pauseTween._startTime;
                        this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
                    }
                }
                this._totalTime = this._time = this._rawPrevTime = time;
            }
            if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
                return;
            }
            else if (!this._initted) {
                this._initted = true;
            }
            if (!this._active)
                if (!this._paused && this._time !== prevTime && time > 0) {
                    this._active = true; //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
                }
            if (prevTime === 0)
                if (this.vars.onStart)
                    if (this._time !== 0 || !this._duration)
                        if (!suppressEvents) {
                            this._callback("onStart");
                        }
            curTime = this._time;
            if (curTime >= prevTime) {
                tween = this._first;
                while (tween) {
                    next = tween._next; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            else {
                tween = this._last;
                while (tween) {
                    next = tween._prev; //record it here because the value could change after rendering...
                    if (curTime !== this._time || (this._paused && !prevPaused)) {
                        break;
                    }
                    else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
                        if (pauseTween === tween) {
                            pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
                            while (pauseTween && pauseTween.endTime() > this._time) {
                                pauseTween.render((pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
                                pauseTween = pauseTween._prev;
                            }
                            pauseTween = null;
                            this.pause();
                        }
                        if (!tween._reversed) {
                            tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
                        }
                        else {
                            tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
                        }
                    }
                    tween = next;
                }
            }
            if (this._onUpdate)
                if (!suppressEvents) {
                    if (_lazyTweens.length) {
                        _lazyRender();
                    }
                    this._callback("onUpdate");
                }
            if (callback)
                if (!this._gc)
                    if (prevStart === this._startTime || prevTimeScale !== this._timeScale)
                        if (this._time === 0 || totalDur >= this.totalDuration()) {
                            if (isComplete) {
                                if (_lazyTweens.length) {
                                    _lazyRender();
                                }
                                if (this._timeline.autoRemoveChildren) {
                                    this._enabled(false, false);
                                }
                                this._active = false;
                            }
                            if (!suppressEvents && this.vars[callback]) {
                                this._callback(callback);
                            }
                        }
        };
        p._hasPausedChild = function () {
            var tween = this._first;
            while (tween) {
                if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
                    return true;
                }
                tween = tween._next;
            }
            return false;
        };
        p.getChildren = function (nested, tweens, timelines, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || -9999999999;
            var a = [], tween = this._first, cnt = 0;
            while (tween) {
                if (tween._startTime < ignoreBeforeTime) {
                }
                else if (tween instanceof TweenLite) {
                    if (tweens !== false) {
                        a[cnt++] = tween;
                    }
                }
                else {
                    if (timelines !== false) {
                        a[cnt++] = tween;
                    }
                    if (nested !== false) {
                        a = a.concat(tween.getChildren(true, tweens, timelines));
                        cnt = a.length;
                    }
                }
                tween = tween._next;
            }
            return a;
        };
        p.getTweensOf = function (target, nested) {
            var disabled = this._gc, a = [], cnt = 0, tweens, i;
            if (disabled) {
                this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
            }
            tweens = TweenLite.getTweensOf(target);
            i = tweens.length;
            while (--i > -1) {
                if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
                    a[cnt++] = tweens[i];
                }
            }
            if (disabled) {
                this._enabled(false, true);
            }
            return a;
        };
        p.recent = function () {
            return this._recent;
        };
        p._contains = function (tween) {
            var tl = tween.timeline;
            while (tl) {
                if (tl === this) {
                    return true;
                }
                tl = tl.timeline;
            }
            return false;
        };
        p.shiftChildren = function (amount, adjustLabels, ignoreBeforeTime) {
            ignoreBeforeTime = ignoreBeforeTime || 0;
            var tween = this._first, labels = this._labels, p;
            while (tween) {
                if (tween._startTime >= ignoreBeforeTime) {
                    tween._startTime += amount;
                }
                tween = tween._next;
            }
            if (adjustLabels) {
                for (p in labels) {
                    if (labels[p] >= ignoreBeforeTime) {
                        labels[p] += amount;
                    }
                }
            }
            return this._uncache(true);
        };
        p._kill = function (vars, target) {
            if (!vars && !target) {
                return this._enabled(false, false);
            }
            var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target), i = tweens.length, changed = false;
            while (--i > -1) {
                if (tweens[i]._kill(vars, target)) {
                    changed = true;
                }
            }
            return changed;
        };
        p.clear = function (labels) {
            var tweens = this.getChildren(false, true, true), i = tweens.length;
            this._time = this._totalTime = 0;
            while (--i > -1) {
                tweens[i]._enabled(false, false);
            }
            if (labels !== false) {
                this._labels = {};
            }
            return this._uncache(true);
        };
        p.invalidate = function () {
            var tween = this._first;
            while (tween) {
                tween.invalidate();
                tween = tween._next;
            }
            return Animation.prototype.invalidate.call(this);
            ;
        };
        p._enabled = function (enabled, ignoreTimeline) {
            if (enabled === this._gc) {
                var tween = this._first;
                while (tween) {
                    tween._enabled(enabled, true);
                    tween = tween._next;
                }
            }
            return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
        };
        p.totalTime = function (time, suppressEvents, uncapped) {
            this._forcingPlayhead = true;
            var val = Animation.prototype.totalTime.apply(this, arguments);
            this._forcingPlayhead = false;
            return val;
        };
        p.duration = function (value) {
            if (!arguments.length) {
                if (this._dirty) {
                    this.totalDuration(); //just triggers recalculation
                }
                return this._duration;
            }
            if (this.duration() !== 0 && value !== 0) {
                this.timeScale(this._duration / value);
            }
            return this;
        };
        p.totalDuration = function (value) {
            if (!arguments.length) {
                if (this._dirty) {
                    var max = 0, tween = this._last, prevStart = 999999999999, prev, end;
                    while (tween) {
                        prev = tween._prev; //record it here in case the tween changes position in the sequence...
                        if (tween._dirty) {
                            tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
                        }
                        if (tween._startTime > prevStart && this._sortChildren && !tween._paused) {
                            this.add(tween, tween._startTime - tween._delay);
                        }
                        else {
                            prevStart = tween._startTime;
                        }
                        if (tween._startTime < 0 && !tween._paused) {
                            max -= tween._startTime;
                            if (this._timeline.smoothChildTiming) {
                                this._startTime += tween._startTime / this._timeScale;
                            }
                            this.shiftChildren(-tween._startTime, false, -9999999999);
                            prevStart = 0;
                        }
                        end = tween._startTime + (tween._totalDuration / tween._timeScale);
                        if (end > max) {
                            max = end;
                        }
                        tween = prev;
                    }
                    this._duration = this._totalDuration = max;
                    this._dirty = false;
                }
                return this._totalDuration;
            }
            return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
        };
        p.paused = function (value) {
            if (!value) {
                var tween = this._first, time = this._time;
                while (tween) {
                    if (tween._startTime === time && tween.data === "isPause") {
                        tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
                    }
                    tween = tween._next;
                }
            }
            return Animation.prototype.paused.apply(this, arguments);
        };
        p.usesFrames = function () {
            var tl = this._timeline;
            while (tl._timeline) {
                tl = tl._timeline;
            }
            return (tl === Animation._rootFramesTimeline);
        };
        p.rawTime = function () {
            return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
        };
        return TimelineLite;
    }, true);
});
if (_gsScope._gsDefine) {
    _gsScope._gsQueue.pop()();
}
//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
(function (name) {
    "use strict";
    var getGlobal = function () {
        return (_gsScope.GreenSockGlobals || _gsScope)[name];
    };
    if (typeof (define) === "function" && define.amd) {
        define(["TweenLite"], getGlobal);
    }
    else if (typeof (module) !== "undefined" && module.exports) {
        require("./TweenLite.js"); //dependency
        module.exports = getGlobal();
    }
}("TimelineMax"));
