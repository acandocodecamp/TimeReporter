namespace Acando.TimeReporter.ViewModelSyncWorker.Model
{
    using System;
    using System.Collections.Generic;

    using Acando.TimeReport.Contracts;

    public class TimeReportViewModel : ITimeReportViewModel
    {
        public string UserName { get; set; }
        public int WeekNumber { get; set; }
        public int Year { get; set; }
        public Dictionary<DayOfWeek, List<IReport>> Reports  { get; set; }
    }
}
