namespace Acando.TimeReport.Commands
{
    public class GetWeekCommand : ICommand
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public int Year { get; set; }

        public int WeekNumber { get; set; }
    }
}