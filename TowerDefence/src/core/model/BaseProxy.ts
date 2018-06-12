/**
 * 数据读取基类
 * @author Andrew_Huang
 * @class BaseProxy
 * @extends {puremvc.Proxy}
 * @implements {puremvc.IProxy}
 */
class BaseProxy extends puremvc.Proxy implements puremvc.IProxy
{
    private _proxyName: string = "";

    public constructor(proxyName: string = '')
    {
        super(proxyName);
        this._proxyName = proxyName;
    }
}