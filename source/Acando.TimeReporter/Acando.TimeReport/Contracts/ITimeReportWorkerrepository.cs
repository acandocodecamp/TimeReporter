using System.Collections.Generic;

namespace Acando.TimeReport.Contracts
{
    public  interface  ITimeReportWorkerrepository
    {
        void UpdateTimeReport(ITimeReportViewModel model);

        List<ITimeReportViewModel> GetReports(string useName);

    }
}
