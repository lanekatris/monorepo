using Marten;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OpenGraphNet;
using Shared;
using Web.Db;
using System.Linq;
using Amazon.SQS;
using Amazon.SQS.Model;

namespace Web;

public interface ITaggable
{
    public List<string> Tags { get; set; }
}


// public interface IVehicleEvent
// {
//     
// }

public record VehicleUpdated(Guid VehicleId, Guid UserId, DateTimeOffset Date);

// public class LkatEvent : ITaggable, IUserAction
// {
//     public Guid Id { get; set; }
//     public List<string> Tags { get; set; }
//     public Guid UserId { get; set; }
// }

// public class Vehicle
// {
//     
// }

public class Mutation
{
    private readonly Guid userId;
    // public Task<bool> FeedItem
    
    // public Task<List

    public Mutation(IConfiguration config)
    {
        userId = Guid.Parse(config["userId"] ?? throw new Exception("userid not found"));
    }
    
    public async Task<Bookmark> BookmarkCreate(string url, List<string>? tags, [Service] IDbContextFactory<LkatContext> factory)
    {
        await using var db = await factory.CreateDbContextAsync();
        var existingBookmark = await EntityFrameworkQueryableExtensions.FirstOrDefaultAsync(db.Bookmarks, x => x.Url == url);
        if (existingBookmark != null) return existingBookmark;
        
        OpenGraph graph = await OpenGraph.ParseUrlAsync(url);
        
        var bookmark = new Bookmark()
        {
            Name = graph.Title,
            Tags = tags == null ? null : JsonConvert.SerializeObject(tags),
            Url = url,
            ImageUrl = graph.Image?.ToString(),
            Meta = JsonConvert.SerializeObject(graph.ToString()),
            Status = nameof(BookmarkStatus.Unread).ToLower()
        };
        db.Add(bookmark);
        await db.SaveChangesAsync();
        return bookmark;
    }

    public async Task<Bookmark> BookmarkRead(int id, [Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        var existingBookmark = await db.Bookmarks.FindAsync(id);
        if (existingBookmark == null) throw new Exception("bookmark not found");

        existingBookmark.Status = nameof(BookmarkStatus.Read).ToLower();

        await db.SaveChangesAsync();
        return existingBookmark;
    }

    public async Task<Vehicle> VehicleDriven(VehicleDriven input, [Service]DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.VehicleId, input);
        await session.SaveChangesAsync();

        var v = session.Query<Vehicle>().First(x => x.Id == input.VehicleId);
        return v;
    }

    public async Task<Vehicle> VehicleNameUpdated(VehicleNameUpdated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.VehicleId, input);
        await session.SaveChangesAsync();

        var v = session.Query<Vehicle>().First(x => x.Id == input.VehicleId);
        return v;
    }

    public async Task<DiscDto> DiscCreate(DiscCreated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        var streamId = input.DiscId ?? Guid.NewGuid();
        session.Events.Append(streamId, input);
        await session.SaveChangesAsync();
        var d = session.Query<DiscDto>().First(x => x.Id == streamId);
        return d;
    }
    
    public async Task<DiscDto> DiscUpdate(DiscUpdated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.DiscId, input);
        await session.SaveChangesAsync();
        
        var d = session.Query<DiscDto>().First(x => x.Id == input.DiscId);
        return d;
    }
    
    public async Task<DiscDto> DiscDelete(DiscDeleted input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.DiscId, input);
        await session.SaveChangesAsync();
        
        var d = session.Query<DiscDto>().First(x => x.Id == input.DiscId);
        return d;
    }

    public async Task<bool> IndexesRebuild([Service] DocumentStore store)
    {
        var daemon = await store.BuildProjectionDaemonAsync();
    
        await daemon.RebuildProjection<ActivityLog>(CancellationToken.None);
        return true;
    }

    public async Task<bool> MigrateDiscs([Service] DocumentStore store, [Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        await using var session = store.OpenSession();
        var oldDiscs = db.Discs.ToList();
        
        // Create created events
        foreach (var oldDisc in oldDiscs)
        {
            var streamId = Guid.NewGuid();
            // var dateOnly = e.Data.created ?? DateOnly.FromDateTime(e.Timestamp.DateTime);
            var dateOnly = oldDisc.RealCreatedDate ?? DateOnly.FromDateTime(oldDisc.Created);
            
            var e = new DiscCreated(
                streamId,
                oldDisc.Brand,
                oldDisc.Model,
                oldDisc.Number?? throw new Exception("no number"),
                oldDisc.Color,
                null,
                oldDisc.Type == "disc" ? DiscDtoType.Disc : DiscDtoType.Mini,
                oldDisc.Price,
                oldDisc.Weight,
                // oldDisc.RealCreatedDate ?? DateOnly.FromDateTime(oldDisc.Created),
                $"{dateOnly.Year}-{dateOnly.Month}-{dateOnly.Day}",
                userId
            );
            session.Events.Append(streamId, e);
            
            
        }
        await session.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAllDiscs([Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        var discs = session.Query<DiscDto>().Where(x => x.Deleted == null).ToList();
        foreach (var disc in discs)
        {
            var e = new DiscDeleted(disc.Id, disc.UserId);
            session.Events.Append(disc.Id, e);
        }

        await session.SaveChangesAsync();
        return true;
    }

    public async Task<Goal> GoalCreate(GoalCreated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.GoalId, input);
        await session.SaveChangesAsync();

        var g = session.Query<Goal>().First(x => x.Id == input.GoalId);
        return g;
    }

    public async Task<Goal> GoalUpdate(GoalUpdated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        session.Events.Append(input.GoalId, input);
        await session.SaveChangesAsync();

        var g = session.Query<Goal>().First(x => x.Id == input.GoalId);
        return g;
    }

    public async Task<ActivityLog> ActivityLogCreate(ActivityLogCreated input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        var goalExists = session.Query<Goal>().Any(x => x.Id == input.GoalId);
        if (!goalExists) throw new Exception("goal doesn't exist");

        session.Events.Append(input.ActivityLogId, input);
        await session.SaveChangesAsync();

        var a = session.Query<ActivityLog>().First(x => x.Id == input.ActivityLogId);
        return a;
    }
    
    public async Task<List<ActivityLog>> ActivityLogsCreate(List<ActivityLogCreated> input, [Service] DocumentStore store)
        {
            await using var session = store.OpenSession();
            foreach (var e in input)
            {
                 var goalExists = session.Query<Goal>().Any(x => x.Id == e.GoalId);
                 if (!goalExists) throw new Exception("goal doesn't exist");
         
                 session.Events.Append(e.ActivityLogId, e);
            }
    
            await session.SaveChangesAsync();

            var ids = input.Select(x => x.ActivityLogId).ToList();
            
            // var a = session.Query<ActivityLog>().Where(x => ids.Any(y => y == x.Id)).ToList();
            var a = session.Query<ActivityLog>().Where(x => ids.Contains(x.Id)).ToList();
            return a;
        }
    

    // public async Task<bool> UpdateFromOldDiscs([Service] DocumentStore store, [Service] IDbContextFactory<LkatContext> factory)
    // {
    //     var db = await factory.CreateDbContextAsync();
    //     await using var session = store.OpenSession();
    //     var oldDiscs = db.Discs.ToList();
    //
    //     foreach (var oldDisc in oldDiscs)
    //     {
    //         // load the existing disc
    //         var existingDisc = 
    //         var e = new DiscUpdated(oldDisc.Id, userId)
    //     }
    // }
    
    public async Task<Feed> FeedItemCreate(FeedItemCreateInput input, 
        [Service] IDbContextFactory<LkatContext> factory, 
        [Service] IMediator mediator, 
        [Service]IDocumentStore store,
        [Service] IConfiguration config)
    {
        var db = await factory.CreateDbContextAsync();
        var feed = new Feed()
        {
            Type = input.Type,
            Message = input.Message,
            Data = input.Data
        };
        db.Feeds.Add(feed);
        await db.SaveChangesAsync();

        switch (feed.Type)
        {
            case "health-status-update" when input.Data is not null:
            {
                var ev = JsonConvert.DeserializeObject<HealthStatusUpdated>(input.Data);
                if (ev != null)
                {
                    await mediator.Publish(new HealthTasksQueried(ev.TaskList));
                }

                break;
            }
            case "used-bathroom":
            {
                var tasks = await mediator.Send(new FindTodaysHealthStatusRequest());
                await mediator.Publish(new HealthTasksQueried(tasks));
                break;
            }
            case "graphics-driver-read-submitted" when input.Data is not null:
            {
                var ev = JsonConvert.DeserializeObject<GraphicsDriverRead>(input.Data);
                if (ev != null && ev.YourVersion != ev.LatestVersion)
                {
                    await mediator.Publish(new GraphicsDriverOutOfDate(ev));
                }
                break;
            }
            case "directory-files-counted" when input.Data is not null:
            {
                var ev = JsonConvert.DeserializeObject<DirectoryFilesCounted>(input.Data);
                if (ev != null && ev.Count >= 10)
                {
                    var message = $"Your obsidian vault root needs cleaned up. You have {ev.Count} files in there.";
                    await mediator.Send(new SendEmailRequest(message, message));
                }
                break;
            }
            case "vehicle-driven" when input.Data is not null:
            {
                var ev = JsonConvert.DeserializeObject<VehicleDriven>(input.Data);
                // get it working
                // make it dynamic
                // what I return can auto be done by vehicles
                // await using var session = store.OpenSession();
                // session.Events.StartStream<Vehicle>()
                var val = config["hondaCrvId"] ?? throw new Exception("didn't find hondaCrvId");
                // var e = Vehi
                break;
            }

        }
        
        // Persist to martendb if applicable
        // switch (feed.Type)
        // {
        //     // get it working
        //     // make it dynamic
        //     // what I return can auto be done by vehicles
        //     case "vehicle-driven":
        //     {
        //         // await using var session = store.OpenSession();
        //         // session.Events.StartStream<Vehicle>()
        //         var val = config["hondaCrvId"] ?? throw new Exception("didn't find hondaCrvId");
        //         // var e = Vehi
        //         break;
        //     }
        // }
        
        return feed;  
    }

    public async Task<bool> SleepComputer()
    {
        var client = new AmazonSQSClient();
        // todo: pull this from environment and ideally pulumi sets this
        var queueUrlResponse = await client.GetQueueUrlAsync("sleep-queue-241f418");
        var request = new SendMessageRequest
        {
            MessageBody = JsonConvert.SerializeObject(new GoToSleep()),
            QueueUrl = queueUrlResponse.QueueUrl
        };
        await client.SendMessageAsync(request);
        return true;
    }

    public async Task<ClimbSession?> ClimbSessionCreate([Service] DocumentStore store)
    {
            await using var session = store.OpenSession();
            var id = Guid.NewGuid();
            session.Events.StartStream(id,new ClimbSessionCreated($"{DateTime.Now.ToShortDateString()} {DateTime.Now.ToShortTimeString()}"));
            await session.SaveChangesAsync();

            return await session.Events.AggregateStreamAsync<ClimbSession>(id);
    }
}
