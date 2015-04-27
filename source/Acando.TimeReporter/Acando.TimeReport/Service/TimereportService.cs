using Acando.TimeReport.Contracts;
using Acando.TimeReport.Repository;

namespace Acando.TimeReport.Service
{
    public class TimereportService
    {
        private readonly ITimeReportWorkerrepository _repository;

        public TimereportService()
        {
           _repository= new TimeReportWorkerrepository();
        }

        public void UpdateTimeReport(ITimeReportViewModel model)
        {
            _repository.UpdateTimeReport(model);
        }

    }
}
