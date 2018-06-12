module Global
{

	//等待界面，主要用在通讯等待展示
	export var waitPanel: WaitPanel;
	//显示等待界面
	export function showWaritPanel(): void
	{
		Global.waitPanel = new WaitPanel(1);
		GameLayerManager.getInstance().maskLayer.removeChildren();
		GameLayerManager.getInstance().maskLayer.addChild(Global.waitPanel);
	}

	//移除界面
	export function hideWaritPanel(): void
	{
		if ((Global.waitPanel != null) && GameLayerManager.getInstance().maskLayer.contains(Global.waitPanel))
		{
			GameLayerManager.getInstance().maskLayer.removeChild(Global.waitPanel);
		}
	}

	//获取html文本
	export function getTextFlow(str: string): egret.ITextElement[]
	{
		var styleParser = new egret.HtmlTextParser();
		return styleParser.parser(str);
	}

	export var message;
	export function getMessage(str: string): any
	{
		if (message == null)
		{
			//初始化template_proto
			Global.message = dcodeIO.ProtoBuf.loadProto(RES.getRes("template_proto"));
		}
		return message.build(str);
	}

	//获取大写数字
	export function getNumber(num: number): string
	{
		switch (num)
		{
			case 0: {
				return "零";
				break;
			}
			case 1: {
				return "一";
				break;
			}
			case 2: {
				return "二";
				break;
			}
			case 3: {
				return "三";
				break;
			}
			case 4: {
				return "四";
				break;
			}
			case 5: {
				return "五";
				break;
			}
			case 6: {
				return "六";
				break;
			}
			case 7: {
				return "七";
				break;
			}
			case 8: {
				return "八";
				break;
			}
			case 9: {
				return "九";
				break;
			}
			default: {
				// TODO: Implemente default case
				console.log("default case");
			}
		}
	}
}