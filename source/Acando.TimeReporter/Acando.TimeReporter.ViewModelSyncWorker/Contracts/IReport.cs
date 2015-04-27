using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acando.TimeReporter.ViewModelSyncWorker.Contracts
{
    public interface IReport
    {
        string ProjectNumber { get; set; }
        int Hours { get; set; }
        string DisplayName { get; set; }
   }
}
