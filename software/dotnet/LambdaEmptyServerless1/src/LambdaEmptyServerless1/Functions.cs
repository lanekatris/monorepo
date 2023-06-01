using Amazon.EventBridge;
using Amazon.EventBridge.Model;
using Amazon.Lambda.Core;
using Amazon.Lambda.CloudWatchEvents;
using Marten;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Shared;
using Weasel.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace LambdaEmptyServerless1;

public class Empty{}

public class Functions
{
    public Functions()
    {
    }
    // query data for the last time I drove my cars, if overdue publish event
    // this could be easier in teh worker but I'm trying to figure this out to be easier
    
    // Look into appconfig at some point
    // todo: move to extension method
    public async Task<string> DriveVehicleReminder(CloudWatchEvent<Empty> input, ILambdaContext context)
    {
        context.Logger.LogInformation("Firing up");
        var martenDbConnString = Environment.GetEnvironmentVariable("EVERYTHING_DB_CONN") ??
                                 throw new Exception("EVERYTHING_DB_CONN not found");
        // Query for vehicles
        var collection = new ServiceCollection();
        collection.AddMarten(options =>
        {
            options.Connection(martenDbConnString);
            options.AutoCreateSchemaObjects = AutoCreate.All;
        });

        collection.AddSingleton(DocumentStore.For(_ =>
        {
            _.Connection(martenDbConnString);
            _.Projections.SelfAggregate<Vehicle>();
        }));

        
        await using var provider = collection.BuildServiceProvider();
        var db = provider.GetRequiredService<DocumentStore>();
        await using var session = db.OpenSession();
        
        context.Logger.LogInformation("Querying vehicles");
        var vehicles = await session.Query<Vehicle>().ToListAsync();
        context.Logger.LogInformation($"Found {vehicles.Count} vehicles");

        var results = new List<string>();
        var client = new AmazonEventBridgeClient();
        foreach (var vehicle in vehicles)
        {
            if ((DateTime.Now - vehicle.LastDriven).TotalDays > 7)
            {
                results.Add(vehicle.Name);
                context.Logger.LogInformation($"hey this vehicle needs driven: {vehicle.Name}");
                
                var message = new PutEventsRequestEntry
                {
                    Detail = JsonConvert.SerializeObject(new VehicleNeedsDriven(vehicle.Id, vehicle.Name, DateTimeOffset.Now)),
                    DetailType = nameof(VehicleNeedsDriven),
                    EventBusName = "default",
                    Source = nameof(Functions.DriveVehicleReminder)
                };
                var putRequest = new PutEventsRequest
                {
                    Entries = new List<PutEventsRequestEntry> { message }
                };
                var response = await client.PutEventsAsync(putRequest);
                
            }
        }

        return string.Join(',', results);
    }
}