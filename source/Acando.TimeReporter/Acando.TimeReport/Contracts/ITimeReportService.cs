using System.Collections.Generic;
using Acando.TimeReport.Contracts;

namespace Acando.TimeReport.Service
{
    public interface ITimeReportService
    {
        void UpdateTimeReport(ITimeReportViewModel model);
        List<ITimeReportViewModel> GetReports(string useName);
    }
}