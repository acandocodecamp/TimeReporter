namespace Acando.TimeReporter.MasterWorker
{
    using System;
    using System.Diagnostics;
    using System.Net;
    using System.Threading;
    using System.Threading.Tasks;

    using Microsoft.Azure;
    using Microsoft.ServiceBus;
    using Microsoft.ServiceBus.Messaging;
    using Microsoft.WindowsAzure.ServiceRuntime;

    public class WorkerRole : RoleEntryPoint
    {
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly ManualResetEvent _runCompleteEvent = new ManualResetEvent(false);

        public override void Run()
        {
            Trace.TraceInformation("Acando.TimeReporter.MasterWorker is running");

            try
            {
                RunAsync(_cancellationTokenSource.Token).Wait();
            }
            finally
            {
                _runCompleteEvent.Set();
            }
        }

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections
            ServicePointManager.DefaultConnectionLimit = 12;

            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

            var result = base.OnStart();

            Trace.TraceInformation("Acando.TimeReporter.MasterWorker has been started");

            return result;
        }

        public override void OnStop()
        {
            Trace.TraceInformation("Acando.TimeReporter.MasterWorker is stopping");

            _cancellationTokenSource.Cancel();
            _runCompleteEvent.WaitOne();

            base.OnStop();

            Trace.TraceInformation("Acando.TimeReporter.MasterWorker has stopped");
        }

        private Task RunAsync(CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                // Create the queue if it does not exist already
                var connectionString = CloudConfigurationManager.GetSetting("MasterCommanderQueueConnectionStrin");
                var namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
                if (!namespaceManager.QueueExists("mastercommander"))
                {
                    namespaceManager.CreateQueue("mastercommander");
                }

                var client = QueueClient.CreateFromConnectionString(connectionString, "mastercommander");
                var options = new OnMessageOptions
                {
                    AutoComplete = false,
                    AutoRenewTimeout = TimeSpan.FromMinutes(1)
                };
                client.OnMessage(message =>
                {
                    try
                    {
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

                while (!cancellationToken.IsCancellationRequested)
                {
                    Trace.TraceInformation("Working");
                    Thread.Sleep(1000);


                }
            });
        }
    }
}
