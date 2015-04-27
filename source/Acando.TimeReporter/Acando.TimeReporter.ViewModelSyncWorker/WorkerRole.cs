using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Acando.TimeReporter.ViewModelSyncWorker.Contracts;
using Acando.TimeReporter.ViewModelSyncWorker.Model;
using Acando.TimeReporter.ViewModelSyncWorker.Repository;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace Acando.TimeReporter.ViewModelSyncWorker
{
    public class WorkerRole : RoleEntryPoint
    {
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private readonly ManualResetEvent runCompleteEvent = new ManualResetEvent(false);

        public override void Run()
        {
            Trace.TraceInformation("Acando.TimeReporter.ViewModelSyncWorker is running");
        
            try
            {
                var timer = new System.Timers.Timer(2000);
                timer.Elapsed += (sender, arge) => ReaAndSavedMessageFromQueue();
                // RunAsync(cancellationTokenSource.Token).Wait();
            }
            finally
            {
                runCompleteEvent.Set();
            }
        }

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections
            ServicePointManager.DefaultConnectionLimit = 12;

            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

            bool result = base.OnStart();

            Trace.TraceInformation("Acando.TimeReporter.ViewModelSyncWorker has been started");

            return result;
        }

        public override void OnStop()
        {
            Trace.TraceInformation("Acando.TimeReporter.ViewModelSyncWorker is stopping");

            cancellationTokenSource.Cancel();
            runCompleteEvent.WaitOne();

            base.OnStop();

            Trace.TraceInformation("Acando.TimeReporter.ViewModelSyncWorker has stopped");
        }

        private async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following with your own logic.
            while (!cancellationToken.IsCancellationRequested)
            {
                Trace.TraceInformation("Working");
                await Task.Delay(1000);
            }
        }

        private void ReaAndSavedMessageFromQueue()
        {
            var connectionString = CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

            var client = QueueClient.CreateFromConnectionString(connectionString, "TestQueue");

            // Configure the callback options
            var options = new OnMessageOptions();
            options.AutoComplete = false;
            options.AutoRenewTimeout = TimeSpan.FromMinutes(1);

            // Callback to handle received messages
            client.OnMessage(message =>
            {
                try
                {

                    // pase string

                    var report = message.ToTimeReport();

                    //save data model to  document db

                    var repository = new TimeReportWorkerrepository();

                     //

                    // Process message from queue
                    Console.WriteLine("Body: " + message.GetBody<string>());
                    Console.WriteLine("MessageID: " + message.MessageId);
                    Console.WriteLine("Test Property: " +
                                      message.Properties["TestProperty"]);

                    // Remove message from queue
                    message.Complete();
                }
                catch (Exception)
                {
                    // Indicates a problem, unlock message in queue
                    message.Abandon();
                }
            });
        }
      
    }
}