namespace Acando.TimeReport.Service
{
    using System.Collections.Generic;

    using Acando.TimeReport.Contracts;
    using Acando.TimeReport.Repository;

    public class TimeReportService : ITimeReportService
    {
        private readonly ITimeReportWorkerrepository _repository;

        public TimeReportService()
        {
           _repository= new TimeReportWorkerrepository();
        }

        public void UpdateTimeReport(ITimeReportViewModel model)
        {
            _repository.UpdateTimeReport(model);
        }

        public List<ITimeReportViewModel> GetReports(string useName)
        {
            return _repository.GetReports(useName);
        }
    }
}
