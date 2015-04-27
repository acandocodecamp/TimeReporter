namespace Acando.TimeReport.Commands
{
    public interface ICommand
    {
        string UserName { get; set; }

        string Password { get; set; }
    }
}