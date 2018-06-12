class TestPanel extends eui.Component
{
    public constructor()
    {
        super();
        this.skinName = "";
        this.addEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
    }

    public createCompleteEvent(event: eui.UIEvent): void
    {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.createCompleteEvent, this);
    }

    public partAdded(partName: string, instance: any): void
    {
        super.partAdded(partName, instance);
    }
}