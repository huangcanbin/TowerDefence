/**
 * 主类事件
 * @author Andrew_Huang
 * @class MainEvent
 * @extends {egret.Event}
 */
class MainEvent extends egret.Event
{
    //用于打开加载下一个场景的资源
    public static OPENLOADBAR: string = "openloadbar";
    //移除上一个场景
    public static REMOVE: string = "remove";
    //加载完成
    public static LOADCOMP: string = "loadcomp";
    //暂停
    public static PAUSE: string = "pause";
    //退出关卡
    public static QUITGUANKA: string = "quitguanka";
    //再次尝试
    public static TRYAGAIN: string = "tryagain";

    private _resName: string = "";
    private _noticeName: string = ''
    public constructor(type: string, resName: string = "", noticeName: string = '', bubbles: boolean = false, cancelable: boolean = false)
    {
        super(type, bubbles, cancelable);
        this._resName = resName;
        this._noticeName = noticeName;
    }

    public get noticeName(): string
    {
        return this._noticeName;
    }

    public get resName(): string
    {
        return this._resName;
    }
}