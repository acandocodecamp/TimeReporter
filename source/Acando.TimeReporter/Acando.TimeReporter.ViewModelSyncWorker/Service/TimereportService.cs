using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Acando.TimeReporter.ViewModelSyncWorker.Contracts;
using Acando.TimeReporter.ViewModelSyncWorker.Repository;

namespace Acando.TimeReporter.ViewModelSyncWorker.Service
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
