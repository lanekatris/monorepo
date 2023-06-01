using System.Collections.Generic;
using infrastructure;
using Deployment = Pulumi.Deployment;

return await Deployment.RunAsync(() =>
{
    var generalInfra = new GeneralInfraBuilder()
        .SetupEmailNotifications()
        .Build();
    
    var workerInfra = new WorkerInfraBuilder()
        .CreateSleepQueue()
        .Build();

    var vehicleInfra = new VehicleInfraBuilder()
        .CreateFunction()
        .ScheduleFunction()
        .SubscribeViaEmail(generalInfra.EmailMeTopic.Arn)
        .Build();

    // Export the name of the bucket
   return new Dictionary<string, object?>
   {
       ["sleepQueueName"] = workerInfra.SleepQueue.Arn,
       ["lambdaName"] = vehicleInfra.Lambda.Name
   };
});