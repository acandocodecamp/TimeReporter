using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Acando.TimeReport.Contracts;

namespace Acando.TimeReporter.ViewModelSyncWorker.Model
{
    public class TimeReportViewModel : ITimeReportViewModel
    {
        public string UserName { get; set; }
        public int WeekNumber { get; set; }
        public int Year { get; set; }
        public Dictionary<DayOfWeek, List<IReport>> Reports  { get; set; }
    }
}
