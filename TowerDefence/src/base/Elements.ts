/**
 * 场景中所有可被摧毁的对象的基类，塔除外
 * @author Andrew_Huang
 * @class Elements
 * @extends {egret.Sprite}
 */
class Elements extends egret.Sprite
{
    private _targets: any[] = [];         //敌人
    private _damage: number;              //攻击力
    private _canClear: boolean = false;   //是否可以清除
    private _contentLayer: egret.Sprite;  //对象层

    public constructor()
    {
        super();
    }

    /**
     * 创建
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    protected onCreate(): void
    {

    }

    /**
     * 移动
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    protected move(): void
    {

    }

    /**
     * 打击效果
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    protected onHit(): void
    {

    }

    /**
     * 帧事件
     * @author Andrew_Huang
     * @protected
     * @param {number} advTime
     * @memberof Elements
     */
    protected onEnterFrame(advTime: number): void
    {

    }

    /**
     * 销毁
     * @author Andrew_Huang
     * @protected
     * @memberof Elements
     */
    protected onDestroy(): void
    {
        if (this && this.parent)
        {
            this.parent.removeChild(this);
        }
    }

    public get targets(): any
    {
        return this._targets
    }

    public set targets(value: any)
    {
        this._targets = value;
    }

    public get damage(): number
    {
        return this._damage;
    }

    public set damage(value: number)
    {
        this._damage = value;
    }

    public get canClear(): boolean
    {
        return this._canClear;
    }

    public set canClear(value: boolean)
    {
        this._canClear = value;
    }

    public get contentLayer(): egret.Sprite
    {
        return this._contentLayer;
    }

    public set contentLayer(value: egret.Sprite)
    {
        this._contentLayer = value;
    }
}