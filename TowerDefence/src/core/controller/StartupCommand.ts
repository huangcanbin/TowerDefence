/**
 * 初始化MVC控制器
 * @author Andrew_Huang
 * @class StartupCommand
 * @extends {puremvc.MacroCommand}
 */
class StartupCommand extends puremvc.MacroCommand
{
    public constructor()
    {
        super();
    }

    public initializeMacroCommand(): void
    {
        this.addSubCommand(ControllerPrepCommand);
        this.addSubCommand(ModelPrepCommand);
        this.addSubCommand(ViewPrepCommand);
    }
}