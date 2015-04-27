using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Acando.TimeReporter.ViewModelSyncWorker.Contracts;
using Microsoft.ServiceBus.Messaging;

namespace Acando.TimeReporter.ViewModelSyncWorker.Model
{
    public static class Extension
    {

        public static int WeekNumber(this DateTime date)
        {
            var dfi = DateTimeFormatInfo.CurrentInfo;
            var myCI = new CultureInfo("en-US");
            var myCal = myCI.Calendar;

            return myCal.GetWeekOfYear(date, dfi.CalendarWeekRule, DayOfWeek.Monday);
        }

        public static TimeReportViewModel ToTimeReport(this BrokeredMessage message)
        {
            var model = new TimeReportViewModel();

            model.UserName = "Filip";
            model.WeekNumber = DateTime.Now.WeekNumber();
            model.Year = DateTime.Now.Year;
            model.Reports = new Dictionary<DayOfWeek, List<IReport>>();

            return new TimeReportViewModel();
        }
    }
}
