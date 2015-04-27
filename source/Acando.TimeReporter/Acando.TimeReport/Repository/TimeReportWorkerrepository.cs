using System;
using System.Collections.Generic;
using Acando.TimeReport.Contracts;

namespace Acando.TimeReport.Repository
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
