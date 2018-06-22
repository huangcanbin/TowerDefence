var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 塔防级别配置文件
 * @author Andrew_Huang
 * @class TowerLevel
 */
var TowerLevel = (function () {
    function TowerLevel() {
    }
    //塔类型键值
    TowerLevel.towNameArr = ["ArrowTower-", "ShieldTower-", "MagicTower-", "ExploTower-"];
    //塔升级键值
    TowerLevel.keyNameArr = ["lv01-lv02", "lv02-lv03_1", "lv02-lv03_2"];
    //箭塔升级配置
    TowerLevel.ArrowTower = { "lv01-lv02": false, "lv02-lv03_1": false, "lv02-lv03_2": false };
    //防御塔升级配置
    TowerLevel.ShieldTower = { "lv01-lv02": false, "lv02-lv03_1": false, "lv02-lv03_2": false };
    //魔法塔升级配置
    TowerLevel.MagicTower = { "lv01-lv02": false, "lv02-lv03_1": false, "lv02-lv03_2": false };
    //炮塔升级配置
    TowerLevel.ExploTower = { "lv01-lv02": false, "lv02-lv03_1": false, "lv02-lv03_2": false };
    /**
     * 塔建造icon资源配置文件，升级className直接 ArrowTower02、ArrowTower03以此类推
     * 参数依次：反射类名、图标资源名、建造所需价格
     * @static
     * @type {*}
     * @memberof TowerLevel
     */
    TowerLevel.dic = {
        "ArrowTower01": { "className": "ArrowTower01", "res": "gj01", "price": 60 },
        "ShieldTower01": { "className": "ShieldTower01", "res": "dp01", "price": 70 },
        "MagicTower01": { "className": "MagicTower01", "res": "mf01", "price": 100 },
        "ExploTower01": { "className": "ExploTower01", "res": "zd01", "price": 125 },
        "ArrowTower02": { "className": "ArrowTower02", "res": "sj", "price": 110 },
        "ShieldTower02": { "className": "ShieldTower02", "res": "sj", "price": 120 },
        "MagicTower02": { "className": "MagicTower02", "res": "sj", "price": 150 },
        "ExploTower02": { "className": "ExploTower02", "res": "sj", "price": 175 },
        "ArrowTower03_1": { "className": "ArrowTower03_1", "res": "gj03_1", "price": 310 },
        "ShieldTower03_1": { "className": "ShieldTower03_1", "res": "dp03_1", "price": 330 },
        "MagicTower03_1": { "className": "MagicTower03_1", "res": "mf03_1", "price": 360 },
        "ExploTower03_1": { "className": "ExploTower03_1", "res": "zd03_1", "price": 380 },
        "ArrowTower03_2": { "className": "ArrowTower03_2", "res": "gj03_2", "price": 610 },
        "ShieldTower03_2": { "className": "ShieldTower03_2", "res": "dp03_2", "price": 630 },
        "MagicTower03_2": { "className": "MagicTower03_2", "res": "mf03_2", "price": 660 },
        "ExploTower03_2": { "className": "ExploTower03_2", "res": "zd03_2", "price": 800 },
        "SellTower": { "className": "SellTower", "res": "sell", "price": 0 },
        "LockTower": { "className": "LockTower", "res": "lock", "price": 0 }
    };
    return TowerLevel;
}());
__reflect(TowerLevel.prototype, "TowerLevel");
