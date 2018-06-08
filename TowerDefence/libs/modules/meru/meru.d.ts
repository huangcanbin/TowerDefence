/**
 * Created by brucex on 16/5/28.
 */
declare module meru {
    interface IAnimation {
        target: any;
        score(duration: number, beginScore: any, endScore?: any, ease?: any): IAnimation;
        shake(duration: number, offsetX: any, offsetY?: any, ease?: any): IAnimation;
        to(duration: number, prop: any, ease?: any): IAnimation;
        by(duration: number, prop: any, ease?: any): IAnimation;
        zoom(duration: number, scale: number, delay?: number, ease?: any): IAnimation;
        delay(time: number): IAnimation;
        blueprint(animationName: any, timeScale?: number, scale?: any): IAnimation;
        blink(duration: number, blinks: number, ease?: any): IAnimation;
        call(sel: () => void, context?: any, ...args: any[]): IAnimation;
        set(props: any): IAnimation;
        remove(): IAnimation;
        fadeInOut(duration: number, ease?: any): IAnimation;
        destory(): void;
        stop(): void;
        pause(): void;
        setTarget(obj: any): IAnimation;
        resume(): void;
        run(target?: any, isLoop?: boolean): IAnimation;
    }
    class Animation implements IAnimation {
        private _timeLine;
        private _animationInfoArr;
        constructor();
        private _target;
        target: any;
        to(duration: number, props: any, ease?: any): meru.IAnimation;
        private mergeEase(props, ease);
        private toProp(prop, type?);
        private fromProp(target, prop, type?);
        set(props: any): meru.IAnimation;
        onComplete(): void;
        remove(): meru.IAnimation;
        zoom(duration: number, scale: number, delay?: any, ease?: any): meru.IAnimation;
        private _isRunning;
        readonly isRunning: boolean;
        run(target?: any, isLoop?: boolean): meru.IAnimation;
        private static _animationMap;
        private static _animatoinId;
        static addAnimation(target: any, animation: IAnimation): void;
        static removeAnimation(target: any, animation: IAnimation): void;
        static removeAnimationByTarget(target: any): void;
        delay(duration: number): meru.IAnimation;
        call(sel: () => void, context: any): meru.IAnimation;
        score(duration: number, beginScore: any, endScore?: any, ease?: any): meru.IAnimation;
        shake(duration: number, offsetX: any, offsetY?: any, ease?: any): meru.IAnimation;
        by(duration: number, prop: any, ease?: any): meru.IAnimation;
        blueprint(animationName: any, timeScale?: number, scale?: any): meru.IAnimation;
        blink(duration: number, blinks: number, ease?: any): meru.IAnimation;
        fadeInOut(duration: number, ease?: any): meru.IAnimation;
        destory(): void;
        stop(): void;
        pause(): void;
        setTarget(obj: any): meru.IAnimation;
        resume(): void;
        static stopAnimationByTarget(target: any): void;
        static by(duration: number, props: any, ease?: any): meru.IAnimation;
        static blueprint(animationName: any, timeScale?: number, scale?: any): meru.IAnimation;
        static fadeInOut(duration: number, ease?: any): meru.IAnimation;
        static set(props: any): meru.IAnimation;
        static setTarget(target: any): meru.IAnimation;
        static zoom(duration: number, scale: number, delay?: number, ease?: any): IAnimation;
        static delay(duration: number): meru.IAnimation;
        static call(sel: () => void, context?: any): meru.IAnimation;
        static to(duration: number, props: any, ease?: any): meru.IAnimation;
    }
}
declare module meru {
    interface IComponent extends egret.DisplayObject {
        onEnter(...args: any[]): void;
        onExit(): void;
        listener(component: eui.Component, sender: (e: egret.Event) => void): void;
        setState(name: string): IComponent;
        setData(data: any, type?: any): IComponent;
        setCompName(name: string): IComponent;
        autoId: any;
    }
    enum OperateState {
        enter = 0,
        exit = 1,
    }
    interface IComponentHook {
        setData(data: any, type?: any): void;
        addOperate(operate: IComponentOperate<any>): void;
    }
    class BaseComponent extends eui.Component implements meru.IUIAnimationComponent, IComponent, IAttributeHost {
        private $_anim;
        private $_data;
        private $_state;
        private $_componentState;
        constructor(...args: any[]);
        clearListeners(): void;
        private _hook;
        hook: meru.IComponentHook;
        setManual(isManual: boolean): void;
        readonly autoId: any;
        readonly componentState: OperateState;
        setArgs(args: any): void;
        updateAttribute(attribute: meru.Attribute): void;
        private pullData();
        private $_stateEnum;
        private onLoaded();
        private addDataMap(name);
        data: any;
        private $_vip;
        variable: any;
        private _isFull;
        readonly isFull: boolean;
        setFull(): this;
        setData(data: any, type?: string): BaseComponent;
        private _dataMapArr;
        private _operates;
        addOperate(operate: IComponentOperate<any>): BaseComponent;
        removeOperate(operate: IComponentOperate<any>): void;
        setState(name: string): this;
        setCompName(name: string): this;
        clearOperate(): void;
        removeOperateByName(name: string): void;
        getOperateByName(name: string): IComponentOperate<any>[];
        getOperateByType(type: string): IComponentOperate<any>[];
        operatesIsComplete(): boolean;
        setOperatesComplete(): void;
        protected dataChanged(): void;
        animation: meru.IUIAnimation;
        private _type;
        isType(type: UIType): boolean;
        setType(type: UIType): void;
        private _isHistoryComponent;
        isHistoryComponent(): boolean;
        listener(component: eui.Component, sender: (e: egret.Event) => void): void;
        setHistoryComponent(isHistory: boolean): void;
        private _componentName;
        componentName: string;
        getAnimationDisplay(type?: any): egret.DisplayObject;
        getSubview(name: string): egret.DisplayObject;
        onEnter(...args: any[]): void;
        destoryData(): void;
        onExit(): void;
    }
}
/**
 * Created by brucex on 16/8/15.
 */
declare module meru {
    class ToggleButton extends eui.ToggleButton {
        private _data;
        data: any;
        private _notice;
        notice: string;
        constructor();
        buttonAddStage(): void;
        buttonRemoveStage(): void;
        getButton(name: string): this;
        protected getCurrentState(): string;
        protected buttonReleased(): void;
    }
}
declare module meru {
    interface IUIAnimationComponent {
        getAnimationDisplay(type?: any): egret.DisplayObject;
    }
    interface IUIAnimationCallback {
        (): void;
    }
    interface IUIAnimation {
        component: IUIAnimationComponent;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
    }
    class NoneAnimation implements IUIAnimation {
        private _component;
        component: meru.IUIAnimationComponent;
        show(callback: meru.IUIAnimationCallback): void;
        close(callback: meru.IUIAnimationCallback): void;
    }
    /**
     * UIAnimation
     */
    class PanelAnimation implements IUIAnimation {
        private _component;
        component: IUIAnimationComponent;
        constructor();
        private moveBy(displayObj, callback, ease);
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
    }
    class BaseBoxAnimation implements IUIAnimation {
        private _component;
        component: meru.IUIAnimationComponent;
        private runAnimation(callback, boxAnim, maskAnim);
        show(callback: meru.IUIAnimationCallback): void;
        close(callback: meru.IUIAnimationCallback): void;
        getShowBoxAnmation(box: egret.DisplayObject): IAnimation;
        getShowMaskAnimation(mask: egret.DisplayObject): IAnimation;
        getCloseBoxAnimation(box: egret.DisplayObject): IAnimation;
        getCloseMaskAnimation(mask: egret.DisplayObject): IAnimation;
    }
    class BoxAnimation extends BaseBoxAnimation {
        getShowBoxAnmation(box: egret.DisplayObject): meru.IAnimation;
        getShowMaskAnimation(mask: egret.DisplayObject): meru.IAnimation;
    }
}
/**
 * Created by brucex on 16/6/1.
 */
declare module meru {
    interface IDataStore {
        onAdd(model: any): void;
        onDelete(model: any): void;
        getModel(type: string, ...args: any[]): any;
        propertyName: string;
    }
    class DataStore implements IDataStore {
        private _cacheMap;
        private _instMap;
        private _propertyName;
        constructor(propertyName: string);
        readonly propertyName: string;
        has(val: string): boolean;
        getVal(model: any): any;
        onAdd(model: any): void;
        onDelete(obj: any): void;
        update(obj: any): void;
        getNewModel(type: string, arg: any): any;
        getModel(type: string, ...args: any[]): any;
    }
}
/**
 * Created by brucex on 16/6/1.
 */
declare module meru.data {
    interface AliasKey {
        proxyKey: string;
        configKey: string;
    }
    class DataUtils {
        static formatAliasKey(key: string): AliasKey;
    }
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class ProxyErrorCode {
        static ERROR_DATA: number;
        static TIME_OUT: number;
        static ERROR_REQUEST: number;
    }
    class Proxy extends egret.EventDispatcher {
        _params: any;
        _responseData: any;
        _errorCode: number;
        _errorMessage: string;
        _isResponseSucceed: boolean;
        _isRequestSucceed: boolean;
        _customParams: any;
        _status: number;
        _requestUrl: string;
        static CLEAR_LISTENER: boolean;
        static hashKey: string;
        static request_path: string;
        static request_url: string;
        static frontProxyKeys: string[];
        private static _timeout;
        private _isTimeout;
        private _timeoutId;
        constructor(params?: any);
        private formatParams(params);
        requestUrl: string;
        private paramsToQueryString(...args);
        private _method;
        method: string;
        load(): void;
        readonly isTimeout: boolean;
        private canClearEventListener();
        proxyDone(): void;
        onError(event: egret.IOErrorEvent): void;
        onResponse(data: any): void;
        onComplete(event: egret.Event): void;
        private getURLVariables(params);
        getParamByName(name: string): any;
        hasParamByName(name: string): boolean;
        readonly params: any;
        readonly responseData: any;
        readonly isResponseSucceed: boolean;
        readonly isRequestSucceed: boolean;
        readonly errorMessage: string;
        readonly errorCode: number;
        addParam(key: string, value: any): void;
        getParamString(): string;
        private _listeners;
        addEventListener(type: string, listener: (e: ProxyEvent) => void, thisObject: any, useCapture?: boolean, priority?: number): void;
        clearEventListener(): void;
        private static _globalParams;
        static addGlobalParams<Z>(key: string, params: Z): void;
        static getGlobalParam(key: string): any;
        static removeGlobalParams(key: string): void;
    }
}
/**
 * Created by brucex on 16/5/30.
 */
declare module meru {
    interface NotificationInfo {
        name: string;
        sender: (...args) => any;
        context: any;
        priority: number;
    }
    class BaseNotification {
        protected _nameObservers: any;
        addObserver(name: string, sender: (...args) => any, context: any, priority?: number): {
            name: string;
            sender: (...args: any[]) => any;
            priority: number;
            context: any;
        };
        onceObserver(name: string, sender: Function, context: any, priority?: number): void;
        removeObserverByInfo(context: Object, info: any): void;
        removeObserver(name: string, sender: (...args) => any, context: any): void;
        removeObserverByObject(context: any): void;
        removeObserverByName(name: string): void;
    }
}
/**
 * Created by brucex on 16/9/4.
 */
declare module meru {
    function def(object: any, property: string, getter: any, setter?: any): void;
    var stage: egret.Stage;
    function getConst(name: string, def_val?: any): any;
    interface IGameCallback {
        on(type: string, ...args: any[]): void;
    }
    function $getCallback(): IGameCallback;
}
/**
 * Created by brucex on 16/6/12.
 */
declare module meru {
    interface IDragCloneable {
        dragClone(): any;
    }
    enum DragType {
        BEGIN = 0,
        MOVE = 1,
        END = 2,
        INTERSECTS = 3,
        BACK = 4,
    }
    interface IDragCallabck {
        (type: DragType, dragItem: any, dropItem: any): void;
    }
    class Draggable {
        private _dragItems;
        private _dropItems;
        addDragItems(...args: any[]): Draggable;
        private _callback;
        setCallback(callback: IDragCallabck): Draggable;
        addDropItems(...args: any[]): Draggable;
        private _old;
        private _oldParent;
        private _begin;
        private _curDragItem;
        private _isDragCloneable;
        private _originDisplay;
        private _offset;
        private onBegin(e);
        private onMove(e);
        private onEnd(e);
        private getDisplayRect(displayObj, bounds?);
        dispose(): void;
        static addDragItems(...args: any[]): Draggable;
        static setCallback(callback: IDragCallabck): Draggable;
        static addDropItems(...args: any[]): Draggable;
    }
}
/**
 * Created by brucex on 16/7/28.
 */
declare module meru {
    class ItemRenderer extends eui.ItemRenderer implements IComponent, IAttributeHost {
        private _state;
        private _notice;
        notice: string;
        private _componentName;
        componentName: string;
        private _ignoreButton;
        ignoreButton: boolean;
        constructor();
        private $_data;
        data: any;
        private addDataMap(name);
        private _dataMapArr;
        setData(data: any, type?: any): meru.IComponent;
        private _oldState;
        private _watchers;
        dataChanged(): void;
        onUpdateEnabled(): void;
        updateAttribute(attribute: meru.Attribute): void;
        setState(name: string): meru.IComponent;
        setCompName(name: string): meru.IComponent;
        private updateSelect();
        listener(component: eui.Component, sender: (e: egret.Event) => void): void;
        readonly autoId: any;
        onEnter(): void;
        onExit(): void;
        private getComopnent(id);
        protected getCurrentState(): string;
        destoryData(): void;
        private tap(e);
    }
}
/**
 * Created by silence on 2017/5/24.
 */
declare module meru {
    class MovieEgretFactory {
        private factory;
        private _parseMap;
        private _clock;
        getFactory(prefix: string): dragonBones.EgretFactory;
    }
    interface MovieSlotDisplayInfo {
        name: string;
        display: egret.DisplayObject | string;
        offsetX?: number;
        offsetY?: number;
    }
    interface MovieSlotDisplayInfo {
        name: string;
        display: egret.DisplayObject | string;
        offsetX?: number;
        offsetY?: number;
    }
    class DragonMovie extends egret.DisplayObjectContainer implements meru.IMovie {
        private _animationFile;
        private _textureFile;
        private _textureImage;
        private _armatureName;
        private _filename;
        constructor(prefix?: string, armature?: string);
        gotoAndStop(name: string, frame: any): void;
        gotoAndPlay(name: string, frame: any, playTimes?: number): void;
        dispose(): void;
        private _atLast;
        atLast: boolean;
        private _frameRate;
        frameRate: number;
        private onAddToStage();
        private onRemoveFromStage();
        private _intialized;
        init(prefix: any, armature?: any): void;
        private _prefix;
        prefix: string;
        armature: string;
        private initialize(prefix);
        private prepareResource();
        private _moviePlay;
        private playCore(play);
        play(name: string, playTimes?: number): void;
        readonly animationName: string;
        private static _frameEventMap;
        private static getFrameEventCount(label, armature, play);
        getFrameEventCount(label: string): number;
        private _armature;
        private _play();
        private onFrame(e);
        private onComplete(e);
        private _replaceDisplayArr;
        replaceDisplay(slotName: string, display: egret.DisplayObject): void;
    }
}
declare module meru {
    interface IMovie extends egret.DisplayObject {
        play(name: string, playTimes?: number): void;
        gotoAndStop(name: string, frame: any): void;
        gotoAndPlay(name: string, frame: any, playTimes?: number): void;
        dispose(): void;
        /**
         * 动画是否停留在最后
         */
        atLast: boolean;
        frameRate: number;
    }
    class MovieEvent extends egret.Event {
        static FRAME_LABEL: string;
        static LOOP_COMPLETE: string;
        static COMPLETE: string;
        constructor(name: string, label?: string);
        private _frameLabel;
        readonly frameLabel: string;
    }
    class MovieFactory {
        static _dnumRegex: RegExp;
        static create(path: string, armature?: string): IMovie;
        static create<T extends IMovie>(path: string, armature?: string): T;
    }
}
/**
 * Created by brucex on 16/7/9.
 */
declare module meru {
    class OpenBoxAnimation extends BaseBoxAnimation {
        private _targetDispaly;
        constructor(targetDisplay: egret.DisplayObject);
        getShowBoxAnmation(box: eui.Component): meru.IAnimation;
        getShowMaskAnimation(mask: egret.DisplayObject): meru.IAnimation;
        getCloseBoxAnimation(box: eui.Component): meru.IAnimation;
        getCloseMaskAnimation(mask: egret.DisplayObject): meru.IAnimation;
    }
}
/**
 * Created by brucex on 16/8/24.
 */
declare module meru {
    class ProgressBar extends eui.ProgressBar {
        private _data;
        data: any;
    }
}
/**
 * Created by brucex on 16/9/20.
 */
declare module meru {
    class RadioButton extends eui.RadioButton {
        private _data;
        data: any;
        private _notice;
        notice: string;
        protected getCurrentState(): string;
        customState: string;
        protected buttonReleased(): void;
    }
}
/**
 * Created by brucex on 16/7/8.
 */
declare module meru {
    interface IResourceGroup {
        getRes(): any[];
        name: string;
    }
    class ResourceLoad implements meru.ILoad {
        private _loadUpdate;
        loadUpdate: meru.ILoadUpdate;
        private _resourceGroup;
        constructor(resource: IResourceGroup);
        load(): void;
        private onLoaded(e);
        private onProgress(e);
    }
}
/**
 * Created by bruce on 16/12/3.
 */
declare module meru {
    class TabBar extends eui.TabBar {
        onRendererTouchEnd(event: any): void;
        private _sel;
        private _context;
        onVerifyCallback<Z>(sel: (itemIndex: number, itemRenderer: any) => void, context: Z): void;
    }
}
/**
 * Created by brucex on 16/7/30.
 */
declare module meru {
    class BaseBox extends meru.BaseComponent {
        private _closeShowAll;
        closeShowAll: boolean;
        onClose(): boolean;
        doClose(force?: boolean): void;
        uiBottom: UIBottom;
    }
}
/**
 * Created by brucex on 16/6/23.
 */
declare module meru {
    /**
     * 显示简单载入条
     */
    function showSimpleLoading(): void;
    /**
     * 隐藏简单载入条
     */
    function hideSimpleLoading(): void;
    function getResLoad(prepare: ILoad | IResourceGroup): ILoad;
    /**
     * 显示加载条
     * @param skinName 加载条的皮肤名
     * @param load 加载器
     */
    function showProgressLoading(prepare: ILoad | IResourceGroup, skinName?: string): Promise<{}>;
    function showLoadScene(scene: ILoad | IResourceGroup): Promise<{}>;
    /**
     * 隐藏加载条
     * @param skinName 加载条的皮肤名
     */
    function hideProgressLoading(skinName: string): void;
    /**
     * 显示浮动提示
     * @param info 浮动提示参数
     */
    function tooltip(info: meru.TooltipInfo | string, skinName?: string): void;
    function customTooltip(skinName: string, data: any, delay?: number): void;
    enum BoxType {
        Box = 0,
        HistoryBox = 1,
        SequnceBox = 2,
        GroupSequnceBox = 3,
    }
    /**
     * 弹出确认框
     * @param info 确认框参数
     * @returns {PromiseInterface<any>} 异步对象
     */
    function confirm(info: ConfirmInfo | string, boxType?: BoxType, ...args: any[]): Promise<{}>;
}
/**
 * Created by brucex on 16/7/8.
 */
declare module meru {
    interface TooltipInfo {
        text: string;
        size?: number;
        color?: number;
        delay?: number;
    }
    enum ConfirmButton {
        close = 0,
        yes = 1,
        no = 2,
    }
    interface ConfirmInfo {
        text: string;
        title?: string;
        size?: number;
        close?: boolean;
        subConfirmView?: string;
        confirmView?: string;
        yes?: string;
        no?: string;
        arg?: any;
    }
    interface ITooltip {
        show(info: TooltipInfo | string, skinName?: string): void;
        customView(skinName: string, data: any, delay?: number): void;
        skinName: string;
    }
    interface ISimpleLoading {
        show(): void;
        hide(): void;
    }
    interface ILoadUpdate {
        update(current: number, total: number): void;
        onComplete(): void;
    }
    interface ILoad {
        loadUpdate: ILoadUpdate;
        load(): void;
    }
    interface IProgressLoading extends ISimpleLoading, ILoadUpdate {
        load: ILoad;
        setComplete(sel: () => void, context?: any): void;
    }
    interface IConfirm {
        show(callback: (btn: ConfirmButton) => void, context: any): void;
    }
}
declare module meru {
    interface UIHistoryItem {
        type: any;
        isUnder?: boolean;
        args: any[];
        hookList: any[];
    }
    interface UIPanelInfo {
        name: string;
        type: any;
        args: any[];
    }
    class UIHistory {
        private _history;
        constructor();
        pushHistory(type: any, args: any[], isUnder: boolean, hookList?: any[]): void;
        readonly count: number;
        hasHistory(): boolean;
        clear(): void;
        popHistory(): UIHistoryItem;
    }
    class UIEvent extends egret.Event {
        static SHOW_PANEL: string;
        static HIDE_PANEL: string;
        static ADD_BOX: string;
        static CLEAR_SEQUENCE_BOX: string;
        static REMOVE_BOX: string;
        static RUN_SCENE: string;
        static REMOVE_SCENE: string;
        static SET_MENU: string;
        static REMOVE_MENU: string;
        static ADD_TOOLTIP: string;
        static REMOVE_TOOLTIP: string;
        static ADD_GUIDE: string;
        static REMOVE_GUIDE: string;
        static ADD_COMPONENT: string;
        static REMOVE_COMPONENT: string;
        static ADD_COMMON: string;
        static REMOVE_COMMON: string;
        private _component;
        readonly component: BaseComponent;
        private _group;
        readonly group: string;
        constructor(type: string, component: BaseComponent, group?: string);
    }
    enum UIType {
        MIN = 0,
        TOOLTIP = 1,
        GUIDE = 2,
        BOX = 3,
        COMMON = 4,
        PANEL = 5,
        MENU = 6,
        SCENE = 7,
        ANY = 9,
    }
    /**
     * 游戏UI界面控制器
     * 目前支持的容器(层级从下往上):场景层、公共UI层、面板层、菜单层、弹框层、新手引导层、浮动层
     */
    class UI extends eui.UILayer {
        private _tooltip;
        private _guide;
        private _box;
        private _common;
        private _panel;
        private _menu;
        private _scene;
        private _topScene;
        private _containerArr;
        constructor();
        private _panelTypeMap;
        private _panelInstanceMap;
        private _currentPanel;
        /**
         * 注入面板类型到控制器类中
         * @param name 面板名称
         * @param panelType 面板类型
         * @param args 初始化参数列表
         */
        injectionPanel(name: string, panelType: any, args: any): void;
        /**
         * 隐藏面板
         * @param panel
         */
        hidePanel(panel?: any): void;
        panelIsDisplay(name: string): boolean;
        private panelInInstanceMap(panel);
        setPanelHide(panel: BaseComponent): void;
        private showAnimation(component);
        private onEnter(component);
        clearBox(): void;
        private onExit(component, remove);
        private setAnimation(animationName, instanceObj);
        /**
         * 显示面板对象
         */
        private _showPanel(name, args);
        readonly boxHistory: UIHistory;
        readonly panelHistory: UIHistory;
        private _sequenceBoxMap;
        addSequnceBox(boxType: any, group: string, priority: number, args: any, type?: string): void;
        getSequnceCount(group: string): number;
        runSequnceBox(group: string): void;
        private runSeqBox(arr, group, top);
        private onRemoveBox(boxDisplay);
        showHistoryPanel(type: any, args: any): meru.BaseComponent;
        addHistoryBox(boxType: any, args: any): void;
        private getTypeInst(type, animation, args, uiType);
        private _addPanel(panelType, args);
        addBox(boxType: any, args: any): BaseComponent;
        private checkHistory(gotoHistory, history, gotoBackFun);
        remove(displayObj: any, isHistory?: boolean, checkHistory?: boolean): void;
        private restoreHookList(panel, hookList);
        private _sceneInst;
        readonly sceneHistory: UIHistory;
        runScene(sceneType: any, args: any): meru.BaseComponent;
        runTopScene(sceneType: any, args: any): meru.BaseComponent;
        private addScene(sceneType, isUnderScene, args);
        addCommon(commonType: any, args: any): void;
        addTooltip(tooltipType: any, args: any): void;
        addGuide(guideType: any, args: any): any;
        getContainerByType(type: UIType): eui.UILayer;
        hasPanel(): boolean;
        static hasPanel(): boolean;
        private getComponentByName(name, container);
        getComponent(name: string): IComponent;
        private isSingleContainer(component);
        removeComponent(name: string): void;
        private _menuInst;
        setMenu(menuType: any, args: any): void;
        setRoot(container: egret.DisplayObjectContainer): void;
        static runTopScene(sceneType: any, ...args: any[]): meru.BaseComponent;
        static runScene(sceneType: any, ...args: any[]): meru.BaseComponent;
        static setMenu(menuType: any, ...args: any[]): void;
        static addCommon(commonType: any, ...args: any[]): void;
        static injectionPanel(name: string, type: any, ...args: any[]): void;
        static panelIsVisible(name: string): boolean;
        showPanel(name: any, args: any[]): BaseComponent;
        static showPanel(name: any, ...args: any[]): BaseComponent;
        static getComponent<T extends IComponent>(name: string): T;
        static addBox(type: any, ...args: any[]): BaseComponent;
        static addSequenceBox(type: any, ...args: any[]): void;
        static getSequenceCount(group: string): number;
        static runGroupSequenceBox(group: string): void;
        static addGroupSequenceBox(type: any, group: string, priority: number, ...args: any[]): void;
        static addGroupSequenceFun(fun: (callback: () => void) => void, group: string, priority: number): void;
        static addHistoryBox(type: any, ...args: any[]): void;
        static showHistoryPanel(type: any, ...args: any[]): meru.BaseComponent;
        static addGuide(type: any, ...args: any[]): meru.BaseComponent;
        static addEventListener(type: string, func: (e: egret.Event) => void, context?: any): void;
        static once(type: string, func: (e: egret.Event) => void, context?: any): void;
        static removeEventListener(type: string, func: (e: egret.Event) => void, context?: any): void;
        static addTooltip(type: any, ...args: any[]): void;
        static remove(inst: any, gotoHistory?: boolean): void;
        static clearBox(): void;
        static getMenu(): any;
        static getScene(): any;
        static getContainerByType(type: UIType): egret.DisplayObjectContainer;
        static hidePanel(panel?: any): void;
        static removeByName(name: string): void;
        static readonly panelHistory: UIHistory;
        static setBoxVisible(visible: boolean, without?: BaseComponent): void;
        static readonly boxHistory: UIHistory;
        static readonly sceneHistory: UIHistory;
        static setRoot(container: egret.DisplayObjectContainer): void;
    }
}
/**
 *
 * Created by brucex on 16/5/18.
 */
declare module meru {
    interface IVehicle {
        follow(path: Path): void;
        arrive(target: any): void;
        separate(vecArr: IVehicle[]): void;
        isEqual(vehicle: IVehicle): boolean;
        location: Vec2d;
        velocity: Vec2d;
        wanderInfo: WanderInfo;
        cohesionInfo: CohesionInfo;
        alignInfo: AlignmentInfo;
        separationInfo: SeparationInfo;
        maxForce: number;
        maxSpeed: number;
        radius: number;
    }
    class WanderInfo {
        radius: number;
        distnace: number;
        rate: number;
        theta: number;
        constructor(theta?: number, radius?: number, distance?: number, rate?: number);
    }
    class AlignmentInfo {
        radius: number;
        weight: number;
        constructor(radius?: number, weight?: number);
    }
    class SeparationInfo {
        radius: number;
        weight: number;
        constructor(radius?: number, weight?: number);
    }
    class CohesionInfo {
        radius: number;
        weight: number;
        constructor(radius?: number, weight?: number);
    }
    class Vehicle implements IVehicle {
        private _location;
        private _velocity;
        private _acceleration;
        private _radius;
        private _wanderInfo;
        private _maxForce;
        private _maxSpeed;
        private _cohesionInfo;
        private _alignInfo;
        private _separationInfo;
        isEqual(vehicle: meru.IVehicle): boolean;
        readonly location: Vec2d;
        readonly velocity: meru.Vec2d;
        radius: number;
        maxForce: number;
        maxSpeed: number;
        readonly wanderInfo: WanderInfo;
        readonly cohesionInfo: meru.CohesionInfo;
        readonly alignInfo: meru.AlignmentInfo;
        readonly separationInfo: meru.SeparationInfo;
        constructor(x: any, y: any);
        update(): void;
        applyForce(force: Vec2d): void;
        wander(): void;
        private steer(target, slowdown);
        seek(target: Vec2d): void;
        arrive(target: Vec2d): void;
        flee(target: Vec2d): void;
        pursue(vehicle: Vehicle): void;
        evade(vehicle: Vehicle): void;
        cohere(vehicleArr: Vehicle[]): Vec2d;
        align(vehicleArr: Vehicle[]): Vec2d;
        separate(vehicleArr: IVehicle[]): void;
        flock(vehicleArr: Vehicle[]): void;
        private followPath(path);
        follow(path: Path): void;
    }
}
/**
 * Created by brucex on 16/7/30.
 */
declare module meru {
    class UIBottom extends meru.BaseComponent {
        closeVisible: boolean;
        help: string;
        title: string;
        closeNotice: string;
        helpNotice: string;
        constructor();
        private _host;
        host: any;
        onEnter(): void;
        setup(box: any): void;
        private addToHost(button);
        private helpBtn;
        private closeBtn;
        readonly helpVisible: boolean;
        readonly titleVisible: boolean;
    }
}
/**
 * Created by brucex on 16/5/29.
 */
declare module meru {
    class SubModelCore extends egret.EventDispatcher {
        private _c;
        private _p;
        c: any;
        p: any;
        private _host;
        host: meru.BaseSubModel;
        getProperty(name: string, format?: boolean): any;
        update(): void;
    }
    class BaseSubModel extends egret.EventDispatcher {
        static info: ModelInfo;
        private _core;
        constructor();
        c: any;
        p: any;
        core: SubModelCore;
        protected onInitConfig(): void;
        protected onInitProxy(): void;
        dispose(): void;
        getValue(name: string, defVal?: any): any;
    }
    class BaseModel extends egret.EventDispatcher {
        private _configData;
        private _proxyData;
        static info: ModelInfo;
        constructor();
        c: any;
        p: any;
        protected onInitProxy(): void;
        protected onInitConfig(): void;
        dispose(): void;
        getValue(name: string, defVal?: any): any;
    }
}
/**
 * Created by brucex on 16/5/31.
 */
declare module meru {
    class Config {
        private _confMap;
        getConfig<T>(name: string, key: string, defaultValue: T): T;
        exists(name: string, key: string): boolean;
        static exists(name: string, key: string): boolean;
        static get(name: string, key?: string, defaultValue?: any): any;
    }
}
/**
 * Created by brucex on 16/6/1.
 */
declare module meru {
    class ConfigDataStore extends DataStore {
        private _info;
        constructor(type: string, info: ModelInfo);
        getNewModel(type: string, arg: any): any;
        getModel(type: string, ...args: any[]): any;
    }
}
/**
 * Created by brucex on 16/5/29.
 */
declare module meru {
    interface IDataPartFactory {
        (obj: any): any;
    }
    class Data {
        private _type;
        private _info;
        private _aliasKey;
        private _dataStoreMap;
        private _mainStore;
        constructor(type: any);
        getList(): any[];
        private getStore(propertyName);
        get(propertyName: string, propertyVal: any): any[];
        getMultiple(propertyName: string, ...values: any[]): any[];
        private deleteModel(model);
        private updateModel(property, model);
        private getModel(item);
        private addModules(lists);
        private add(data);
        private delete(key);
        private find(key, data);
        private updateNum(model);
        private _deleteModels;
        private _addModels;
        private onChangeData(data, type);
        private postChangeModel();
        private onBeforeChange(data);
        private onAfterChange(data);
        private onCacheData(data);
    }
}
/**
 * Created by brucex on 16/5/29.
 */
declare module meru {
    class DataCenter {
        private static _dataMap;
        private static getData<T>(type);
        static injectionModel<T>(type: T): void;
        static get<T>(type: T, propertyName: string, propertyVal: any): any;
        static getMultiple<T>(type: T, propertyName: string, ...vals: any[]): any[];
        static getList<T>(type: T): any[];
    }
    /**
     * 通过指定属性名和属性值,返回指定类型的模型对象
     * @param type 需要返回的模型对象类型
     * @param propertyName 指定的属性名
     * @param propertyVal 指定的属性值
     * @returns {any} 模型对象
     */
    function getModel<T>(type: {
        new (): T;
    }, propertyName: string, propertyVal: any): T;
    /**
     * 通过指定属性名和多个属性值,返回指定类型的模型对象数组
     * @param type 需要返回的模型对象类型
     * @param propertyName 指定的属性名
     * @param valueArr 指定的属性值列表
     * @returns {any[]} 模型对象数组
     */
    function getMultipleModel<T>(type: {
        new (): T;
    }, propertyName: string, ...valueArr: any[]): T[];
    /**
     * 注册模型到数据中心
     * 注册后才能使用数据模型机制
     * @param type 模型类型
     */
    function injectionModel(type: any): void;
    var unknown: string;
    /**
     * 返回指定类型的服务器端模型对象数组
     * @param type 需要返回的模型对象类型
     * @returns {any[]} 模型对象数组
     */
    function getModelList<T>(type: {
        new (): T;
    }): T[];
}
/**
 * Created by brucex on 16/6/8.
 */
declare module meru {
    class BaseItemRenderer extends eui.ItemRenderer {
        constructor();
        protected onItemTap(): void;
    }
}
/**
 * Created by brucex on 16/9/1.
 *
 */
declare module meru {
    interface IComponentOperate<T> {
        isComplete: boolean;
        setComplete(): void;
        getName(): string;
        setName(val: string): T;
        serialize(): any;
        unserialize(data: any): void;
        type: string;
        state: OperateState;
        enter(component: BaseComponent): void;
        exit(component: BaseComponent): void;
    }
    class BaseOperate<T> extends egret.HashObject implements IComponentOperate<T> {
        protected getIsComplete(): boolean;
        readonly isComplete: boolean;
        private __name;
        serialize(): any;
        unserialize(data: any): void;
        setName(name: string): T;
        getName(): string;
        protected getType(): string;
        readonly type: string;
        private _state;
        state: meru.OperateState;
        setComplete(): void;
        enter(component: meru.BaseComponent): void;
        exit(component: meru.BaseComponent): void;
    }
}
/**
 * Created by brucex on 16/6/13.
 */
declare module meru {
    class ExtraInfo {
        private _spid;
        private _platform;
        private _version;
        private _bench;
        private _oplayerId;
        private _channel;
        private _runtime;
        constructor();
        /**
         * 是否为runtime运行环境
         * @returns {boolean}
         */
        readonly runtime: boolean;
        /**
         * channelTag
         * @returns {string}
         */
        readonly channel: string;
        /**
         * spId
         * @returns {any}
         */
        readonly spId: any;
        /**
         * 当前游戏的平台
         * @returns {string}
         */
        readonly platform: string;
        /**
         * 当前运行环境:<code>local</code>、<code>beta</code>、<code>release</code>
         * @returns {string}
         */
        readonly bench: string;
        /**
         * 游戏当前版本
         * @returns {string}
         */
        readonly version: string;
        /**
         * playerId
         * @returns {string}
         */
        readonly oplayerId: string;
    }
    /**
     * 游戏常用的一些平台/运行环境参数
     */
    var extra: ExtraInfo;
}
/**
 * Created by brucex on 16/6/28.
 */
declare module meru {
    class item {
        /**
         * 获取道具类型
         * @returns {null}
         */
        static getType(): any;
        /**
         * 获取指定道具名称
         * @param configId 道具编号
         * @returns {any}
         */
        static getName(configId: any): string;
        /**
         * 获取指定道具的拥有数量
         * @param configId 道具编号
         * @returns {any}
         */
        static getNum(configId: any): number;
        /**
         * 获取指定道具的模型实例
         * @param val 道具配置编号
         * @returns {any}
         */
        static getItemByConfigId(val: any): any;
        /**
         * 获取指定道具的模型实例
         * @param val 道具自动编号
         * @returns {any}
         */
        static getItemByAutoId(val: any): any;
        /**
         * 获取所有道具的模型实例列表
         * @returns {any}
         */
        static getItems(): any[];
        /**
         * 获取指定属性的模型实例
         * @param key 属性名称
         * @param val 属性值
         * @returns {any}
         */
        static getItemsByKey(key: string, val: any): any[];
    }
}
/**
 * Created by brucex on 16/6/1.
 */
declare module meru {
    class MainDataStore extends DataStore {
        private _list;
        onAdd(obj: any): void;
        onDelete(obj: any): void;
        getList(): any[];
    }
}
/**
 * Created by brucex on 16/6/1.
 */
declare module meru {
    class ModelInfo {
        private _moddo;
        private _factory;
        private _subCoreFactory;
        private _autoKey;
        private _confKey;
        private _listKey;
        private _otherKeys;
        private _isMultiple;
        private _type;
        constructor(moddo: string, autoKey: string, confKey: string, otherKeys: string[], listKey: string, factory: IDataPartFactory, subCoreFactory?: IDataPartFactory, isMultiple?: boolean);
        type: any;
        readonly isMultiple: boolean;
        readonly otherKeys: string[];
        readonly confKey: string;
        readonly autoKey: string;
        readonly listKey: string;
        readonly subCoreFactory: meru.IDataPartFactory;
        readonly factory: IDataPartFactory;
        readonly moddo: string;
    }
}
/**
 * Created by brucex on 16/6/16.
 */
declare module meru {
    /**
     * 框架基础通知事件
     */
    class NotificationKey {
        /**
         * 接口请求响应成功
         * @type {string}
         */
        static ResponseSucceed: string;
        static StatusWait: string;
        static StatusResponse: string;
        static RequestError: string;
        static ResponseError: string;
        static GetComponent: string;
        static MultiResponseError: string;
        static SKIP_MUTATION: string;
        static GET_BUTTON: string;
        static CLICK_BUTTON: string;
        /**
         * 游戏玩家等级提升
         * @type {string}
         */
        static UserLvUp: string;
        /**
         * 腾讯登录系统
         * @type {string}
         */
        static TencentLogin: string;
        /**
         * 缓存请求数据
         * @type {string}
         */
        static CacheChange: string;
        static getModDo(moddo: string | ProxyInfo): any;
        /**
         * 缓存请求数据前
         * @param moddo
         * @returns {string}
         * @constructor
         */
        static BeforeChange(moddo: string | ProxyInfo): any;
        static AfterChange(moddo: string | ProxyInfo): any;
        /**
         * 返回特定接口缓存更新的通知事件名
         * @param moddo 接口名称
         * @returns {string} 更新通知事件名
         * @constructor
         */
        static Change(moddo: string | ProxyInfo): any;
        /**
         * 返回特定接口缓存数据的通知事件名
         * @param moddo 接口名称
         * @returns {string} 缓存通知事件名
         * @constructor
         */
        static Cache(moddo: string | ProxyInfo): any;
        static ADD_MODEL(type: any): any;
        static DELETE_MODEL(type: any): any;
        static UPDATE_MODEL(type: any, key: string): any;
        static UPDATE_NUM(type: any): any;
        /**
         * 通用缓存通知事件名
         * @param moddo 接口名称
         * @returns {string} 通用通知事件名
         * @constructor
         */
        static All(moddo: string | ProxyInfo): any;
    }
    /**
     * 框架基础通知事件
     * @type {meru.NotificationKey}
     */
    var k: typeof NotificationKey;
}
/**
 * Created by brucex on 16/6/8.
 */
declare module meru {
    interface ISetting {
        ProjectName: string;
        BoxAnimation: string;
        PanelAnimation: string;
        SceneAnimation: string;
        TooltipClass: string;
        SimpleLoadingClass: string;
        BoxClass: string;
        ProgressLoadingClass: string;
        ConfirmClass: string;
        ItemModelClass: string;
        GameCallbackClass: string;
        AnimationBlueprint: string;
        LoadSceneClass: string;
    }
    class Setting implements ISetting {
        private _setting;
        private getAnimation(animation);
        readonly SimpleLoadingClass: string;
        readonly LoadSceneClass: string;
        readonly TooltipClass: string;
        readonly AnimationBlueprint: string;
        readonly ProgressLoadingClass: string;
        readonly GameCallbackClass: string;
        readonly BoxClass: string;
        readonly ConfirmClass: string;
        readonly SceneAnimation: string;
        readonly PanelAnimation: string;
        readonly ItemModelClass: string;
        readonly BoxAnimation: string;
        readonly ProjectName: string;
        init(setting: ISetting): void;
        static init(game_config: any): void;
    }
    function getSetting(): ISetting;
    function setup(display: egret.DisplayObject): void;
}
/**
 * Created by brucex on 16/6/20.
 */
declare module meru {
    class array {
        static remove<T>(arr: T[], removeItems: ((item: any) => boolean) | T | T[]): boolean;
        static shuffle<T>(array: T[]): T[];
        static pluck<T>(arr: T[], propertyName: string): any[];
        static compact<T>(arr: T[]): T[];
        static range(start: number, stop?: number, step?: number): number[];
        static find<T>(arr: T[], predicate: any, context?: any): T;
        static where<T>(arr: T[], obj: any): T[];
        static findWhere<T>(arr: T[], obj: any): T;
        static contains<T>(arr: T[], obj: (value: T, index: number, array: T[]) => boolean | T): boolean;
    }
}
/**
 * Created by brucex on 16/5/26.
 */
declare module meru {
    class color {
        static red: number;
        static white: number;
        static black: number;
        private static parseColorText(text);
        static html(text: string): any;
    }
}
/**
 * Created by brucex on 16/5/26.
 */
declare module meru {
    interface Scale {
        x: number;
        y: number;
    }
    class display {
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        static setAnchor(disObj: egret.DisplayObject, anchorX: number, anchorY?: number): void;
        static isHostComponentType(host: any): boolean;
        static readonly stageW: number;
        static fixedToCenter(scroller: eui.Scroller, display: egret.DisplayObject, w?: any, h?: any): void;
        static pointInScreen(targetObj: egret.DisplayObject, x: number, y: number): boolean;
        static inScreen(displayObj: egret.DisplayObject): boolean;
        static readonly stageH: number;
        static setFullDisplay(display: egret.DisplayObject): void;
        static getStagePosition(anchorX: number, anchorY?: number): any;
        static isVisible(obj: egret.DisplayObject): boolean;
        static setPositionFromStage(obj: egret.DisplayObject, anchorX?: number, anchorY?: number): void;
        static sort(container: egret.DisplayObjectContainer): void;
        static createBitmap(src: string, anchorX?: number, anchorY?: number): egret.Bitmap;
        static setAttribute(component: egret.DisplayObjectContainer): void;
        static addToContianer(displayObj: egret.DisplayObject, parent: egret.DisplayObjectContainer): void;
        static resetConstraint(component: any): void;
        static findTypeParent<T>(display: any, type: {
            new (): T;
        }): T;
        static getHostComponent(display: egret.DisplayObject): meru.BaseComponent;
        /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        static removeAllChildren(container: egret.DisplayObjectContainer): void;
        /**
         * 将源显示对象中的位置转换成目标对象中的位置
         * @param x 源显示对象x轴
         * @param y 源显示对象y轴
         * @param source 源显示对象
         * @param dist 目标显示对象
         * @returns {egret.Point}
         */
        static localTolocal(x: any, y: any, source: any, dist: any, p?: egret.Point): egret.Point;
        static getScale(obj: egret.DisplayObject): Scale;
        static destoryChildren(container: any): void;
        /**
         * 移除显示对象,可以是egret的显示对象,也可以是继承组件
         * @param child 子显示对象
         */
        static removeFromParent(child: egret.DisplayObject | BaseComponent, forceRemove?: boolean): void;
    }
}
/**
 * Created by brucex on 16/8/16.
 */
declare module meru {
    interface IAttributeHost {
        updateAttribute(attribute: Attribute): void;
    }
    class Attribute extends eui.Component {
        private _name;
        private _value;
        name: string;
        value: any;
        onUpdate(): void;
        add(): void;
        constructor();
    }
}
/**
 * Created by brucex on 16/5/26.
 */
declare module meru {
    class num {
        static randInt(min: number, max: number): number;
        static randFloat(min: number, max: number): number;
        static padNum(num: any, str: any): any;
        /**
         * 格式化倒计时时间
         * @param time 倒计时时间(秒)
         * @param format 格式化文字
         * @returns {string}
         */
        static toCountdown(time: number, format: string): string;
    }
}
/**
 * Created by brucex on 16/5/25.
 */
declare module meru {
    class object {
        static clone(obj: any): any;
        static keys(obj: any): string[];
        static values(obj: any): any[];
        static isMatch(object: any, attrs: any): boolean;
        static matches(prop: any): (obj: any) => boolean;
        static hasValue(data: any, key: any): boolean;
        static setValue(data: any, key: any, val: any, forceSet?: boolean): void;
        static getValue(data: any, key: any, defVal?: any): any;
        static deepClone(obj: any): any;
        static assign(destination: any, ...sources: any[]): any;
        static toObject<T, R>(arr: any[], keyMap: (T) => string, valueMap?: (T) => R): {
            [key: string]: R;
        };
        static equals(one: any, other: any): boolean;
    }
    function v(obj: any, paths: string, defVal?: any): any;
}
/**
 * Created by brucex on 16/5/25.
 */
declare module meru {
    enum PadDireciton {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
    }
    class str {
        static pad(str: any, len?: number, pad?: string, dir?: PadDireciton): string;
        static replaceFromObject(text: string, arg: any): string;
        private static _formatRegexp;
        static format(value: string, ...args: any[]): string;
        private static _formatObjRegexp;
        static formatFromObject(value: string, param: any): string;
        static trim(haystack: string, needle?: string): string;
        static ltrim(haystack?: string, needle?: string): string;
        static rtrim(haystack?: string, needle?: string): string;
        static startsWith(haystack: string, needle: string): boolean;
        static endsWith(haystack: string, needle: string): boolean;
        static replaceAll(str: string, search: string, replacement: string): string;
        static formatNotice(notice: string): string;
        static repeat(s: string, count: number): string;
    }
}
/**
 *
 * Created by brucex on 16/8/31.
 */
declare module meru {
    interface ListCondItem {
        params: any[];
        generate(v: any): any[];
    }
    class BaseLiteItem {
        params: any[];
        generate: (v?: any) => any[];
        name: string;
        property: string;
        constructor(name: string, property: string, genearte: (v?: any) => any[]);
        addParams(...args: any[]): void;
        check(model: any): boolean;
        getList(lists: any[]): any[];
    }
    class BaseList<K> {
        private _rules;
        private _type;
        constructor(type: any);
        valid(item: any): boolean;
        private _itemMap;
        addItem(key: any, property: string, generate: (val: any) => any[], ...args: any[]): void;
        rule(group: (item: any) => boolean | ListRule | string): this;
        private _sort;
        sort(sort: Sort): this;
        private _lists;
        setList(lists: K[]): this;
        private _sources;
        getList(): K[];
        private _hasEvent;
        private _collection;
        private _hasNew;
        getCollection(): eui.ArrayCollection;
        dispose(): void;
        onAdd(modelArr: any[]): void;
        check(model: any): boolean;
        onDelete(modelArr: any[]): void;
    }
}
/**
 * Created by brucex on 16/8/31.
 */
declare module meru {
    enum ListCond {
        equal = 0,
        greaterThen = 1,
        greaterEqual = 2,
        lessThen = 3,
        lessEqual = 4,
        truthy = 5,
        falsy = 6,
    }
    interface IListCondInfo {
        valid(item: any): boolean;
    }
    class ListCondInfo implements IListCondInfo {
        name: any;
        cond: ListCond;
        value: any;
        constructor(name: any, cond?: ListCond, value?: any);
        static condMap: {
            '==': ListCond;
            '>=': ListCond;
            '>': ListCond;
            '<=': ListCond;
            '<': ListCond;
        };
        private parse(exp);
        valid(item: any): boolean;
    }
    class FunCondInfo implements IListCondInfo {
        private _fun;
        constructor(fun: (item: any) => boolean);
        valid(item: any): boolean;
    }
    class ListRule {
        private _conditions;
        add(name: string, cond?: ListCond, val?: any): ListRule;
        fun(fun: (item: any) => boolean): ListRule;
        static fun(fun: (item: any) => boolean): ListRule;
        static add(name: string, cond?: ListCond, val?: any): ListRule;
        valid(item: any): boolean;
    }
}
/**
 *
 * Created by brucex on 16/8/31.
 */
declare module meru {
    enum SortDir {
        asc = 0,
        desc = 1,
    }
    class SortItemInfo {
        property: string;
        type: SortDir;
        constructor(property: string, type: SortDir);
        sort(a: any, b: any): number;
    }
    class Sort {
        private _sorts;
        desc(property: string): Sort;
        asc(property: string): Sort;
        custom(fun: (a, b) => number): Sort;
        readonly sort: (a, b) => number;
        private reverse();
        _sort(a: any, b: any): number;
        private _isInvert;
        static desc(property: string): Sort;
        static asc(property: string): Sort;
        static custom(fun: (a, b) => number): Sort;
        invert(): Sort;
    }
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class MultiProxy extends Proxy {
        protected _subProxys: Proxy[];
        constructor(...argmts: any[]);
        load(): void;
        getParamString(): string;
        onResponse(data: any): void;
        readonly subProxyList: SingleProxy[];
        getParamByName(name: string): any;
        addSubProxy(subProxy: any): void;
    }
    class AutoMergeProxy extends MultiProxy {
        private _waitTime;
        constructor(time: any);
        load(): void;
        private static _cur;
        static getProxy(): AutoMergeProxy;
    }
}
/**
 * Created by brucex on 16/6/14.
 */
declare module meru {
    class Button extends eui.Component {
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
        constructor();
        onExit(): void;
        onEnter(): void;
        getButton(name: string): this;
        private _notice;
        notice: string;
        private _data;
        data: any;
        private addDataMap(name);
        private _dataMapArr;
        dataChanged(): void;
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
        labelDisplay: eui.IDisplayText;
        /**
         * @private
         */
        private _label;
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
        label: string;
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
        iconDisplay: eui.Image;
        /**
         * @private
         */
        private _icon;
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
        icon: string | egret.Texture;
        /**
         * @private
         * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
         */
        private touchCaptured;
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
        protected onTouchBegin(event: egret.TouchEvent): void;
        protected onStageTouchMove(e: egret.TouchEvent): void;
        private _isStop;
        private _pt;
        private _pt2;
        /**
         * @private
         * 舞台上触摸弹起事件
         */
        protected onStageTouchEnd(event: egret.Event): void;
        protected onTouchEnd(event: egret.Event): void;
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState(): string;
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName: string, instance: any): void;
        private setIconSource(icon);
        destoryData(): void;
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
        protected buttonReleased(): void;
    }
    class Button2 extends Button {
        private static __lightFilter;
        private static getLightFilter();
        private _lightable;
        lightable: boolean;
        onTouchBegin(e: any): void;
        onTouchEnd(e: any): void;
        onStageTouchEnd(e: any): void;
    }
}
/**
 * Created by brucex on 6/2/15.
 */
declare module meru {
    class ProxyAction {
        /**
         * 请求正在等待状态
         * @type {string}
         */
        static WAIT: string;
        /**
         * 请求正在响应状态
         * @type {string}
         */
        static RESPONSE: string;
        /**
         * 开始加载
         * @type {string}
         */
        static BEGIN_LOAD: string;
        /**
         * 请求前状态
         * @type {string}
         */
        static REQUEST: string;
        /**
         * 请求成功
         * @type {string}
         */
        static REQUEST_SUCCEED: string;
        /**
         * 请求响应成功
         * @type {string}
         */
        static RESPONSE_SUCCEED: string;
        /**
         * 请求失败
         * @type {string}
         */
        static REQUEST_ERROR: string;
        /**
         * 请求响应错误
         * @type {string}
         */
        static RESPONSE_ERROR: string;
        /**
         * 请求超时
         * @type {string}
         */
        static TIMEOUT: string;
        /**
         * 多请求响应错误
         * @type {string}
         */
        static MULTIPROXY_ERROR: string;
        /**
         * 多请求响应成功
         * @type {string}
         */
        static MULTIPROXY_SUCCEED: string;
    }
}
/**
 * Created by brucex on 9/2/14.
 */
declare module meru {
    class ProxyCache {
        private _cacheData;
        static _instance: ProxyCache;
        private static readonly instance;
        reset(): void;
        resetOne(smod: string, sdo?: string): void;
        private setCache(proxy);
        private dataMerge(dist, source);
        private getCache(smod?, sdo?);
        private formatParmas(smod, sdo?);
        private isCache(smod, sdo?);
        static setCache(proxy: Proxy): void;
        /**
         * 获取缓存数据
         * @param moddo
         * @returns {Object}
         */
        static getCache(moddo?: string | ProxyInfo): any;
        static resetOne(moddo: string | ProxyInfo): void;
        static reset(): void;
        /**
         * 指定接口的数据是否已缓存
         * @param moddo
         * @returns {boolean}
         */
        static isCache(moddo: string | ProxyInfo): boolean;
    }
    /**
     * 接口信息
     */
    interface ProxyInfo {
        /**
         * 接口名称
         */
        moddo: string;
        /**
         * 请求时是否显示简单载入条(默认:是)
         */
        mask?: boolean;
        /**
         * 请求数据是否进行缓存(默认:否)
         */
        cache?: boolean;
        /**
         * 请求参数
         */
        params?: any;
        /**
         * 合并数据
         */
        dataMerge?: any;
        /**
         * 数据失效时间
         */
        delay?: any;
    }
    function buildProxyInfo(moddo: string, params?: any, cache?: boolean, mask?: boolean): ProxyInfo;
    /**
     * @private
     */
    var ___userInfo: ProxyInfo;
    function User_getInfo(): ProxyInfo;
    /***
     * 获取指定服务器端接口缓存中的数据
     * @param propertyOrType 属性名称或服务器接口类型
     * @param defValOrType 默认值或服务器接口类型
     * @param defaultVal 默认值
     * @includeExample getCache.ts
     * @returns {any} 缓存数据
     */
    function getCache(propertyOrType: string | ProxyInfo, defValOrType?: ProxyInfo | any, defaultVal?: any): any;
    /**
     * 获取指定链条接口表示的数据
     * @param where 链条接口
     * @param defVal
     * @returns {any}
     */
    function getWhereValue(where: string, defVal?: any): any;
    /***
     * 指定服务器接口是否已经缓存了数据
     * @param type 服务器端接口类型,默认使用用户信息接口类型
     * @returns {boolean} 是否已经缓存了数据
     */
    function hasCache(type?: ProxyInfo): boolean;
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class ProxyEvent extends egret.Event {
        /**
         * 请求中断
         * @type {number}
         */
        static CANCEL: string;
        /**
         * 请求成功
         * @type {number}
         */
        static REQUEST_SUCCEED: string;
        /**
         * 请求失败
         * @type {number}
         */
        static REQUEST_FAIL: string;
        /**
         * 响应结果成功
         * @type {number}
         */
        static RESPONSE_SUCCEED: string;
        /**
         * 响应结果失败
         * @type {number}
         */
        static RESPONSE_ERROR: string;
        static ERROR: string;
        static TIME_OUT: string;
        private _responseData;
        private _errorCode;
        private _errorMessage;
        private _isResponseSucceed;
        private _isRequestSucceed;
        readonly responseData: any;
        readonly errorCode: number;
        readonly errorMessage: string;
        readonly isResponseSucceed: boolean;
        readonly isRequestSucceed: boolean;
        constructor(type: string, target: Proxy, bubbles?: boolean, cancelable?: boolean);
    }
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class ProxyStatus {
        /**
         * 默认阶段
         * @type {number}
         */
        static DEFAULT: number;
        /**
         * 请求阶段
         * @type {number}
         */
        static REQUEST: number;
        /**
         * 请求中阶段
         * @type {number}
         */
        static WAIT: number;
        /**
         * 响应后阶段
         * @type {number}
         */
        static RESPONSE: number;
    }
}
declare module meru {
    class ProxyUpdate {
        private static _instance;
        private static readonly instance;
        static update<Z>(proxy: Proxy, cache: Z): void;
        private isArray(key);
        private isObject(obj);
        private isNumeric(v);
        static customUpdate(pmod: string, obj: any): void;
        private isNormal(key);
        private isAddToArray(key);
        private isRemoveToArray(key);
        private isFilter(key);
        private _updateObject(name, value, cacheData);
        private _getFilterObject(filter, cacheData);
        private _addObjectToArray(cacheData, changeValue);
        private _sliceCaceData(cacheData, idx);
        private _removeObjectFromArray(cacheData, key, changeValue);
        update<Z>(proxy: Proxy, dataCache: Z): void;
        private postAction(pmod, pdo, v1);
        customUpdate(pmod: string, obj: any): void;
        private _update(cacheData, changeData);
    }
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class RequestStatus {
        /**
         * 请求成功
         * @type {number}
         */
        static SUCCEED: number;
        /**
         * 请求失败
         * @type {number}
         */
        static ERROR: number;
    }
}
/**
 * Created by brucex on 9/1/14.
 */
declare module meru {
    class ProxyTime {
        private _tickObj;
        private _tickId;
        constructor();
        private refreshTick();
        private tick();
        getLeftime(key: any): any;
        push(key: any, time: number): void;
        private static _inst;
        static getInstance(): ProxyTime;
    }
    class SingleProxy extends Proxy {
        constructor(params?: ProxyInfo);
        getParamString(): string;
        load(): void;
    }
    /**
     * 发送合并网络请求
     * @param args 接口信息对象列表
     * @includeExample multirequest.ts
     * @returns {PromiseInterface<any>} 异步对象
     */
    function multiRequest(...args: ProxyInfo[]): Promise<{}>;
    function request(type: ProxyInfo, singleProxy?: boolean): any;
}
/**
 * Created by brucex on 16/8/19.
 */
declare module meru {
    class CheckBox extends ToggleButton {
    }
}
/**
 * Created by brucex on 16/5/29.
 */
declare module meru {
    /**
     * 通知对象,服务于通知侦听相关的全局方法
     */
    class Notification extends BaseNotification {
        /**
         * 发送通知
         * @param name 通知名称
         * @param args 通知参数列表
         */
        postNotification(name: string, ...args: any[]): void;
        private postTypeNoticetion(name, args);
    }
    /**
     * 注册通知侦听
     * @param name 通知名称
     * @param sender 通知回调函数
     * @param context 通知回调对象
     */
    function addNotification<Z>(name: string, sender: (...args) => void, context: Z, priority?: number): void;
    function onceNotification(name: string, sender: Function, context: any, priority?: number): void;
    /**
     * 移除通知侦听
     * @param name 通知名称
     * @param sender 通知回调函数
     * @param context 通知回调对象
     */
    function removeNotification<Z>(name: string, sender: (...args) => void, context: Z): void;
    /**
     * 发送通知
     * @param name 通知名称
     * @param args 通知参数列表
     */
    function postNotification(name: string, ...args: any[]): void;
    /**
     * 移除指定回调对象的所有通知侦听
     * @param obj 待移除侦听的回调对象
     */
    function removeNotificationByTarget<Z>(obj: Z): void;
    /**
     * 移除指定通知名称的所有通知侦听
     * @param name 待移除侦听的通知名称
     */
    function removeNotificationByName(name: string): void;
    function removeNoticeAndPullByTarget<Z>(obj: Z): void;
}
/**
 * Created by brucex on 16/5/30.
 */
declare module meru {
    class PullObject extends BaseNotification {
        pullObject(name: string, ...args: any[]): any;
        private _pullObject(name, args, idx?);
    }
    /**
     * 添加对象拉取侦听
     * @param name 拉取对象名
     * @param sender 拉取回调函数
     * @param context 拉取回调对象
     */
    function addPullObject<Z>(name: string, sender: (...args) => any, context: Z, priority?: number): void;
    /**
     * 移除对象拉取侦听
     * @param name 拉取对象名
     * @param sender 拉取回调函数
     * @param context 拉取回调对象
     */
    function removePullObject<Z>(name: string, sender: (...args) => any, context: Z): void;
    /**
     * 拉取对象
     * @param name 拉取对象名
     * @param defaultValue 默认值
     * @returns {T} 当不存在该拉取对象时会返回默认值
     */
    function pullObject<T>(name: string, ...args: any[]): T;
    /**
     * 移除指定对象所有的拉取对象侦听
     * @param context 待移除侦听的回调对象
     */
    function removePullObjectByTarget<Z>(context: Z): void;
    /**
     * 移除指定侦听名的所有拉取对象侦听
     * @param name 待移除侦听的名称
     */
    function removePullObjectByName(name: string): void;
}
/**
 * Created by brucex on 16/5/26.
 */
declare module meru {
    /**
     * 对象池
     */
    class Pool<T> {
        /**
         * @private
         */
        private _totalArr;
        /**
         * @private
         */
        private _useArr;
        /**
         * @private
         */
        private _leftArr;
        /**
         * @private
         */
        private _type;
        constructor(type: any);
        /**
         * 回收对象,当不需要使用对象池创建的对象时,使用该方法回收对象
         * @param inst
         */
        push(inst: T): void;
        /**
         * 拉取对象,如果对象池中不存在任何可供使用的对象,则会创建出新的对象
         * @param args 初始化对象的参数列表
         * @returns {any}
         */
        pop(...args: any[]): T;
        private static _poolMap;
        /**
         * 获取指定类型的对象池
         * @param type 对象类型
         * @returns {any} 对象池对象
         */
        static getPool<T>(type: T): Pool<T>;
        static getTypePool<T>(name: string, type: T): Pool<T>;
    }
    /**
     * 获取指定类型的对象池
     * @includeExample getPool.ts
     * @param type 指定的类型
     * @returns {Pool<T>} 类型对象池
     */
    function getPool<T>(type: {
        new (): T;
    }): Pool<T>;
    /**
     * 获取指定分组的类型对象池
     * @param name 组名
     * @param type 指定类型
     * @returns {any} 类型对象池
     * @includeExample getTypePool.ts
     */
    function getTypePool<T>(name: string, type: {
        new (): T;
    }): Pool<T>;
}
/**
 *
 * Created by brucex on 16/8/3.
 */
declare module meru {
    interface IData {
        getData(...args: any[]): any;
        getModel(type: any): any;
        has(skinName: string): boolean;
    }
    interface IMutation {
        onNotice(type: string, ...args: any[]): void;
        hasNotice(type: string): boolean;
        getMutation(type: any): any;
    }
    class BaseData extends egret.EventDispatcher implements IData {
        private _skinName;
        constructor(skinName?: string);
        readonly name: string;
        protected getName(): string;
        getModelByName(name: string): any;
        getData(skinName: any, ...args: any[]): any | void;
        getModel(type: any): any;
        private scanDataItem(skinName);
        private isMatch(pattern, skinName);
        has(skinName: string): boolean;
        slot(skinName: string, fun: (...args) => void | any): void;
        private _skinDataMap;
        private _patternDataMap;
        init(): void;
    }
    class GroupData extends BaseData {
        private _modelArr;
        sub(model: BaseData): void;
        getModel(type: any): any;
        getModelByName(name: string): any;
        getData(skinName: any, ...args: any[]): any | void;
        has(skinName: string): boolean;
        readonly models: BaseData[];
    }
    class BaseMutation implements IMutation {
        private _methodMap;
        on(notice: string, fun: (...args) => void): void;
        getMutation(type: any): any;
        onNotice(type: string, ...args: any[]): void;
        hasNotice(type: string): boolean;
        constructor();
        init(): void;
    }
    class GroupMutation extends BaseMutation {
        private _mutationArr;
        onNotice(type: string, ...args: any[]): void;
        getModel(type: any): any;
        hasNotice(type: string): boolean;
        constructor();
        private readonly mutations;
        sub(mutation: IMutation): void;
        init(): void;
    }
    class Struct {
        private _name;
        private _data;
        private _mutation;
        constructor(name: string);
        readonly name: string;
        data: IData;
        mutation: IMutation;
    }
    function propertyChange(obj: any, ...propList: any[]): void;
    function dependProperty(host: any, obj: any, chain?: any[], watchers?: eui.Watcher[]): eui.Watcher[];
    function changeDataProperty(host: any, name: string): void;
    function getDataProperty(host: any, name: string, type: any, ...args: any[]): any;
}
/**
 * Created by brucex on 16/8/3.
 */
declare module meru {
    class StructCenter {
        private static _moduleMap;
        private static _intialized;
        private static init();
        private static onListener(type, ...argArr);
        private static getAllData(type, ...argArr);
        static pullObject(...args: any[]): any;
        private static _dataMap;
        static getData<T>(type: {
            new (...args): T;
        }): T;
        private static _mutationMap;
        static getMutation<T>(type: {
            new (...args): T;
        }): T;
        static getStruct(name: string): Struct;
        static injectionData<T>(moduleName: string, data: T): void;
        static injectionMutation<T>(moduleName: string, mutation: T): void;
    }
    function injectionData<T>(moduleName: string, data: T): void;
    function injectionMutation<T>(moduleName: string, data: T): void;
    function getStruct(name: string): Struct;
    function getDataSlot(type: string, ...args: any[]): any;
    function notifyDataChange(host: any, ...propertys: any[]): void;
    function getMutation<T>(type: {
        new (...args): T;
    }): T;
    function getData<T>(type: {
        new (...args): T;
    }): T;
}
/**
 * Created by brucex on 16/6/13.
 */
declare module meru {
    class factory {
        private _classList;
        injection(types: string, classType: any, priority: number): void;
        private checkValue(item, key);
        getClass(objItem: any): any;
        /**
         * 通过给定的数据对象,获取类型
         * @param name 类型工厂名称
         * @param object 数据对象
         * @includeExample getClass.ts
         * @returns {any}
         */
        static get(name: string, object: any): any;
        /**
         * 通过给定的数据对象,获取实现
         * @param name 类型工厂名称
         * @param object 数据对象
         * @param args 构建参数列表
         * @returns {T} 实例
         */
        static instance<T>(name: string, object: any, ...args: any[]): T;
        /**
         * 注入类型到类型工厂
         * @param name 类型工厂名称
         * @param types 类型关键字
         * @includeExample injectionClass.ts
         * @param classType 类型
         */
        static injection(name: string, types: string, classType: any, priority?: number): void;
    }
}
/**
 * Created by brucex on 16/7/7.
 */
declare module meru {
    /**
     * 获取指定类的类型
     * @param name 类型名称
     * @param defaultType 默认类型
     * @returns {any}
     */
    function getDefinitionType<T>(name: string, defaultType: T): T;
    /**
     * 获取指定类的实例
     * @param args 类型构造函数参数列表
     * @param name 类型名称
     * @param defaultType 默认类型
     * @param args 类型构造函数参数列表
     * @returns {null}
     */
    function getDefinitionInstance<T>(name: string, defaultType?: any, ...args: any[]): T;
}
/**
 * Created by brucex on 16/5/30.
 */
declare module meru {
    /**
     * 返回指定类型的类型编号
     * @param type 指定类型
     * @returns {any} 类型编号
     */
    function getTypeId(type: any): any;
    /**
     * 指定类型是否存在类型编号
     * @param type 指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type: any): boolean;
}
/**
 * Created by brucex on 16/7/28.
 */
declare module meru {
    class ComponentState {
        private _component;
        private _args;
        private _listeners;
        getArgs(): any;
        constructor(component: IComponent);
        setArgs(args: any): void;
        listener(component: eui.Component, func: (e: egret.Event) => void): void;
        onAddToStage(e: any): void;
        onRemovedFromStage(): void;
        clearLiteners(): void;
        private getComopnent(id);
    }
}
/**
 * Created by brucex on 9/24/15.
 */
declare module meru {
    class localStorage {
        private static _prefix;
        private static _enable;
        private static _localStorage;
        static setPrefix(prefix: string): void;
        static isSetPrefix(): boolean;
        private static check();
        static getItemKey(key: string): any;
        static getItem(key: string, defVal?: any): any;
        static setItem(key: string, val: any): void;
        static removeItem(key: string): void;
        static getUserKey(key: string): any;
        static getUserItem(key: string, defVal?: any): any;
        static setUserItem(key: string, val: any): any;
        static removeUserItem(key: string): void;
    }
}
declare module meru {
    class md5 {
        constructor();
        private hexcase;
        private b64pad;
        hex_md5(s: any): string;
        private b64_md5(s);
        private any_md5(s, e);
        private hex_hmac_md5(k, d);
        private b64_hmac_md5(k, d);
        private any_hmac_md5(k, d, e);
        private md5_vm_test();
        private rstr_md5(s);
        private rstr_hmac_md5(key, data);
        private rstr2hex(input);
        private rstr2b64(input);
        private rstr2any(input, encoding);
        private str2rstr_utf8(input);
        private str2rstr_utf16le(input);
        private str2rstr_utf16be(input);
        private rstr2binl(input);
        private binl2rstr(input);
        private binl_md5(x, len);
        private md5_cmn(q, a, b, x, s, t);
        private md5_ff(a, b, c, d, x, s, t);
        private md5_gg(a, b, c, d, x, s, t);
        private md5_hh(a, b, c, d, x, s, t);
        private md5_ii(a, b, c, d, x, s, t);
        private safe_add(x, y);
        private bit_rol(num, cnt);
    }
}
/**
 * Created by brucex on 16/6/15.
 */
declare module meru {
    interface IPlatform {
        name: string;
        contact: any;
        supportInfo: any;
        HasSubscribe: boolean;
        doLogin(): void;
        init(): void;
        login(params?: any): void;
        logout(sel?: (...args) => void, context?: any): void;
        payment(data: any, sel?: (...args) => void, context?: any): void;
        share(data: any, sel?: (...args) => void, context?: any): void;
        openBBS(sel?: (...args) => void, context?: any): void;
        isSupport(funType: PlatformFunType, sel?: (...args) => void, context?: any): void;
        userIsSupport(data: any, sel?: (...args) => void, context?: any): void;
        sendToDesktop(sel?: (...args) => void, context?: any): void;
        setShareInfo(info?: any, selector?: Function, context?: Object): void;
        doAttention(selector?: Function, context?: Object): void;
    }
    enum PlatformFunType {
        SendToDesktop = 1,
        TencentLogin = 2,
        InvitorFriend = 3,
        OpenBBS = 4,
        Share = 5,
    }
    /**
     * 返回当前运行环境的平台对象
     * @returns {null}
     */
    function getPlatform(): IPlatform;
}
declare module meru {
    function listenerReport(): void;
}
/**
 * Created by brucex on 16/8/10.
 */
declare module meru {
    class res {
        static getResVersion(): string;
        static getThemeVersion(): string;
        static loadRes(prefix_path?: string, is_dev_res?: boolean): void;
        static loadTheme<Z>(stage: egret.Stage, is_dev_thm: boolean, completeFun: (e: eui.UIEvent) => void, context?: Z, prefix_path?: string): void;
    }
}
/**
 * Created by brucex on 16/9/10.
 */
declare module meru {
    class Seq {
        private _seqArr;
        private _seqCount;
        run(sel: (fun: (...args) => void) => void, context?: any): Seq;
        runDone(): void;
        getArgs(): any[];
        private _sel;
        private _context;
        done(sel: (...args) => void, context?: any): this;
        static run(sel: (fun: (...args) => void) => void, context?: any): Seq;
        static done(sel: (...args) => void, context?: any): Seq;
    }
}
/**
 * Created by brucex on 16/5/30.
 */
declare module meru {
    /**
     * 返回指定类型的单例
     * @includeExample singleton.ts
     * @param type 需要单例化的类型
     * @returns {any} 类型的单例
     */
    function singleton<T>(type: {
        new (): T;
    }): T;
    /**
     * 返回指定分类的类型单例
     * @param name 分类名称
     * @param type 单例化的类型
     * @includeExample typesingleton.ts
     * @returns {any} 单例对象
     */
    function typeSingleton<T>(name: string, type: {
        new (): T;
    }): T;
}
/**
 * Created by brucex on 16/5/25.
 */
declare module meru {
    class StopWatch {
        private _startTime;
        private _stopTime;
        constructor();
        stop(): void;
        elapsed(): number;
        private _now();
    }
}
/**
 *
 * Created by brucex on 16/6/23.
 */
declare module meru {
    /**
     * 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
     * @param callback 调用的函数
     * @param context 函数的作用域
     * @param time 时间周期
     * @param args 函数参数列表
     * @returns {number} intervalId
     */
    function setInterval<Z>(callback: (thisObj: Z, ...args) => void, thisObj: Z, time: number, ...args: any[]): number;
    /**
     * 取消由 setInterval() 设置的 timeout
     * @param timeId intervalId
     */
    function clearInterval(timeId: number): void;
    /**
     * 方法用于在指定的毫秒数后调用函数或计算表达式。
     * @param callback 调用的函数
     * @param context 函数的作用域
     * @param time 时间周期
     * @param args 函数的参数列表
     * @returns {number} timeoutId
     */
    function setTimeout<Z>(callback: (thisObj: Z, ...arg) => void, thisObj: Z, time: number, ...args: any[]): number;
    /**
     * 方法可取消由 setTimeout() 方法设置的 timeout
     * @param timeId timeoutId
     */
    function clearTimeout(timeId: number): void;
    /**
     * 基于<code>User.getInfo.i.nowTime</code>计算当前剩余时间(倒计时)
     * @param distTime 目标时间戳
     * @returns {number} 剩余秒数
     */
    function getLeftTime(distTime: number): number;
    /**
     * 指定的时间数值是否为时间戳
     * @param time 时间数值
     * @returns {boolean}
     */
    function isTimestamp(time: any): boolean;
}
/**
 * Created by brucex on 16/9/5.
 */
declare module meru {
    class TimeRecorder {
        private _date;
        private _lastDate;
        private _offsetTime;
        private _tickNum;
        readonly tickNum: number;
        private _seconds;
        readonly seconds: number;
        tick(): number;
    }
}
/**
 *
 * Created by brucex on 16/5/18.
 */
declare module meru {
    class DisplayVehicleInfo {
        sel: () => void;
        context: any;
        offsetObj: any;
        vehicleArr: IVehicle[];
        constructor(sel: () => void, offsetObj?: any, vehicleArr?: IVehicle[], context?: any);
    }
    class DisplayVehicle extends egret.DisplayObjectContainer implements IVehicle {
        private _vehicle;
        private _canRotation;
        private _display;
        init(display: any, canRotate?: boolean): void;
        private _info;
        getInfo(): DisplayVehicleInfo;
        setInfo(sel: () => void, context?: any, vehicleArr?: IVehicle[], offsetObj?: any): void;
        readonly wanderInfo: WanderInfo;
        readonly cohesionInfo: CohesionInfo;
        readonly alignInfo: AlignmentInfo;
        readonly separationInfo: SeparationInfo;
        readonly localtion: Vec2d;
        readonly velocity: Vec2d;
        maxSpeed: number;
        maxForce: number;
        follow(path: meru.Path): void;
        private removeEnterEvent();
        arrive(target: any): void;
        separate(vecArr: meru.IVehicle[]): void;
        isEqual(vehicle: meru.IVehicle): boolean;
        static createFromDisplay(display: any, canRotate?: boolean): DisplayVehicle;
        radius: number;
        readonly location: Vec2d;
        static emptyOffset: any;
        private render(offset?);
        private _enterFun;
        readonly vec: IVehicle;
        dispose(): void;
    }
}
/**
 *
 * Created by brucex on 16/5/18.
 */
declare module meru {
    class Path {
        private _pathWidth;
        private _nodes;
        private _currentIdx;
        private _isLooping;
        constructor(nodes?: any[]);
        pathWidth: number;
        isLooping: boolean;
        add(vector: Vec2d): void;
        readonly isComplete: boolean;
        next(): Vec2d;
        readonly current: Vec2d;
        readonly first: Vec2d;
        readonly last: Vec2d;
        clear(): void;
    }
}
/**
 * Created by brucex on 4/26/16.
 */
declare module meru {
    class Vec2d {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        readonly length: number;
        setTo(x: number, y: number): Vec2d;
        equals(toCompare: any): boolean;
        copyFrom(sourcePoint: any): void;
        offset(dx: number, dy: number): void;
        add(vec2d: Vec2d): Vec2d;
        readonly lengthSq: number;
        limit(max: any): Vec2d;
        div(num: any): Vec2d;
        subtract(v: Vec2d): Vec2d;
        mul(n: number): Vec2d;
        getAngle2(vec2d: Vec2d): number;
        getAngle(vec2d: Vec2d): number;
        heading(): number;
        dot(vec: Vec2d): number;
        normalize(): Vec2d;
        clone(): Vec2d;
        distance(vec: Vec2d): number;
        copy(): Vec2d;
        isNormalized(): boolean;
        private static rotateEmpty;
        rotate(angle: number, point?: any): Vec2d;
        static pointInTriangle(a: Vec2d, b: Vec2d, c: Vec2d, p: Vec2d): boolean;
        private static get(ve2d);
        static normalize(ve2d: Vec2d): Vec2d;
        static add(target1: Vec2d, target2: Vec2d): Vec2d;
        static mul(target: Vec2d, num: number): Vec2d;
        static sub(target1: Vec2d, target2: Vec2d): Vec2d;
    }
}
/**
 *
 * Created by brucex on 16/5/25.
 */
declare var ___math___: Math;
declare module meru {
    class math {
        static roundAwayFromZero(val: any): number;
    }
}
