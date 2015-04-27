namespace Acando.TimeReport.Repository
{
    using System;
    using System.Collections.Generic;
    using Acando.TimeReport.Contracts;

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
