using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acando.TimeReporter.ViewModelSyncWorker.Contracts
{
    public interface ITimeReportViewModel
    {
        string UserName { get; set; }
        int WeekNumber { get; set; }
        int Year { get; set; }
        Dictionary<DayOfWeek, List<IReport>> Reports { get; set; }
    }
}
