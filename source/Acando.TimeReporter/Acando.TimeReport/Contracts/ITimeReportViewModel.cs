using System;
using System.Collections.Generic;

namespace Acando.TimeReport.Contracts
{
    public interface ITimeReportViewModel
    {
        string UserName { get; set; }
        int WeekNumber { get; set; }
        int Year { get; set; }
        Dictionary<DayOfWeek, List<IReport>> Reports { get; set; }
    }
}
