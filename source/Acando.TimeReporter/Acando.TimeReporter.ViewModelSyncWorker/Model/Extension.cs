namespace Acando.TimeReporter.ViewModelSyncWorker.Model
{
    using System;
    using System.Collections.Generic;

    using Acando.TimeReport.Contracts;

    using Microsoft.ServiceBus.Messaging;

    public static class Extension
    {

        public static TimeReportViewModel ToTimeReport(this BrokeredMessage message)
        {
            var model = new TimeReportViewModel();

            model.UserName = "Filip";
            //model.WeekNumber = DateTime.Now.WeekNumber();
            model.Year = DateTime.Now.Year;
            model.Reports = new Dictionary<DayOfWeek, List<IReport>>();

            return new TimeReportViewModel();
        }
    }
}
