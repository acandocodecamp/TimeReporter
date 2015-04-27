using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Acando.TimeReporter.ViewModelSyncWorker.Contracts;

namespace Acando.TimeReporter.ViewModelSyncWorker.Repository
{
    public class TimeReportWorkerrepository : ITimeReportWorkerrepository
    {
        public void UpdateTimeReport(ITimeReportViewModel model)
        {
            // update to mongo
            throw new NotImplementedException();
        }

        public List<ITimeReportViewModel> GetReports(string useName)
        {
            // get from mongo
            throw new NotImplementedException();
        }
    }
}
