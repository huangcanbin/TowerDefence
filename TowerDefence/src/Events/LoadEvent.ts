/**
 * 加载类事件
 * 作为加载类的基类，直接引用类名调用RES.ResourceEvent的静态方法
 * @author Andrew_Huang
 * @class LoadEvent
 * @extends {RES.ResourceEvent}
 */
class LoadEvent extends RES.ResourceEvent
{
    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false)
    {
        super(type, bubbles, cancelable);
    }
}