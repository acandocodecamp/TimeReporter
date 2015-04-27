namespace Acando.TimeReport.Contracts
{
    public interface IReport
    {
        string ProjectNumber { get; set; }
        int Hours { get; set; }
        string DisplayName { get; set; }
   }
}
