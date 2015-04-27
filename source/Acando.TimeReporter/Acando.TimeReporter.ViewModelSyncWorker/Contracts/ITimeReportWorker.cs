using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acando.TimeReporter.ViewModelSyncWorker.Contracts
{
    public  interface  ITimeReportWorkerrepository
    {
        void UpdateTimeReport(ITimeReportViewModel model);

        List<ITimeReportViewModel> GetReports(string useName);

    }
}
