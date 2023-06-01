// Query.cs

using Marten;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OpenGraphNet;
using Shared;
using Web;
using Web.Db;
using static System.Runtime.InteropServices.RuntimeInformation;

public class ClimbSession
{
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string Name { get; set; }
    public List<Route> Routes { get; set; } = new List<Route>();

    public void Apply(ClimbSessionCreated created)
    {
        Name = created.Name;
        Routes = new List<Route>()
        {
            new Route(RouteDifficulty.V0),
            new Route(RouteDifficulty.V1),
            new Route(RouteDifficulty.V2),
            new Route(RouteDifficulty.V3),
            new Route(RouteDifficulty.V4),
            new Route(RouteDifficulty.V5),
            new Route(RouteDifficulty.V6),
            new Route(RouteDifficulty.V7),
            new Route(RouteDifficulty.V8),
            new Route(RouteDifficulty.V9),
            new Route(RouteDifficulty.V10),
        };
    }

    public void Apply(RouteAttempted attempt)
    {
        Routes.First(x => x.Difficulty == attempt.Difficulty).Attempts++;
    }
}

public record RouteAttempted(RouteDifficulty Difficulty);

public record RouteClimbed(RouteDifficulty Difficulty);

public record ClimbSessionCreated(string Name);

public class Route
{
    public Route()
    {
            
    }

    public Route(RouteDifficulty difficulty, int attempts = 0, int climbCount = 0)
    {
        Difficulty = difficulty;
        Attempts = attempts;
        ClimbCount = climbCount;
    }
    public RouteDifficulty Difficulty { get; set; }
    public int Attempts { get; set; }
    public int ClimbCount { get; set; }
}

public enum RouteDifficulty
{
    V0,V1,V2,V3,V4,V5,V6,V7,V8,V9,V10
}

public class Query
{
    public List<ClimbSession> GetClimbSessions()
    {
        return new List<ClimbSession>()
        {
            new ClimbSession()
            {
                Name = "my rando name",
                Id = Guid.NewGuid(),
                Routes = new List<Route>()
                {
                    new Route()
                    {
                        ClimbCount = 3, Attempts = 2, Difficulty = RouteDifficulty.V3
                    },
                    new Route(RouteDifficulty.V2, 0, 4)
                }
            }
        };
    }
    
    public string SysInfo =>
        $"{FrameworkDescription} running on {RuntimeIdentifier}";

    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<Feed>> GetFeed([Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        return db.Feeds.AsQueryable();
    }

    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<Maintenance>> GetMaintenance([Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        return db.Maintenances.AsQueryable();
    }

    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<AttributedPlace>> GetPlace([Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        return db.AttributedPlaces.AsQueryable();
    }

    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<Bookmark>> GetBookmark([Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        return db.Bookmarks.AsQueryable();
    }

    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public async Task<IQueryable<Disc>> GetOldDiscs([Service] IDbContextFactory<LkatContext> factory)
    {
        var db = await factory.CreateDbContextAsync();
        return db.Discs.AsQueryable();
    }

    public Task<List<TaskDto>> LatestHealth([Service] IMediator mediator) => mediator.Send(new FindTodaysHealthStatusRequest());

    public async Task<List<Vehicle>> Vehicles([Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        var v = session.Query<Vehicle>().OrderBy(x => x.Name).ToList();
        return v;
    }

    
    
    public async Task<List<DiscDto>> GetDiscs(GetDiscsInput? input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        if (input?.IncludeDeleted == true)
            return session.Query<DiscDto>().ToList();

        return session.Query<DiscDto>().Where(x => x.Deleted == null).OrderByDescending(x => x.Number).ToList();
    }

    public async Task<DiscDto?> GetDisc(Guid discId, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        return session.Query<DiscDto>().FirstOrDefault(x => x.Id == discId);
    }

    [UseFiltering]
    [UseSorting]
    public async Task<IExecutable<ActivityLog>> GetActivityLogs([Service] DocumentStore store)
    {
        // dataloader?
        await using var session = store.OpenSession();
        var queryable = session.Query<ActivityLog>();
        return queryable.AsExecutable();
        // return session.Query<ActivityLog>().ToList();
    }
    
    // todo: now that we know martendb filtering works... let's worry about querying for this weeks data
    // we need to know: 7 stretch rows and if each is done, 1 row for climbing and if its done
    // really, we just need to invoke the same as getgoallog and not groupby :)
    
    
    // Give me a list of goals, filtered by GoalType.Fitness
    // Since the start date provided
    // Broken up by weeks (where I know what goals were applicable) (and if I completed all of them)
    // todo: how to I persist I did an activity and related it towards a goal?
    // WeeklyGoalBucket

    // public async Task<bool> GetGoalLog
    
    public async Task<GetGoalLogsResult> GetGoalLog(GetGoalLogInput? input, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();

        var log = session.Query<ActivityLog>().ToList();
        var goals = session.Query<Goal>().ToList();
        
        var results = new List<Tuple<string, bool, bool>>();
        
        var availableWeeks = TimeHelper.GetWeeks(
            input?.Start ?? new DateTime(2023,1,1), 
            input?.End ?? DateTime.Now);
        foreach (var availableWeek in availableWeeks)
        {
            // find log entries between the dates
            
            var isThisWeek = availableWeek.Start <= DateTime.Now && availableWeek.End >= DateTime.Now;
            var entries = log.Where(x => x.Date >= availableWeek.Start && x.Date <= availableWeek.End).ToList();
            
            // We only want goals that were created within the week
            foreach (var goal in goals)
            {
                if (goal.Created > availableWeek.End)
                {
                    continue;
                }
                var count = entries.Count(x => x.GoalId == goal.Id);
                string weekName = $"{availableWeek.Year}-{availableWeek.WeekOfYear:00}";
                if (goal.Frequency == GoalFrequency.Daily)
                {
                    // results.Add(new GoalLogEntry(weekName,  count == 7, 1)); // full 7 day week
                    // todo: need to know if its this week
                    // results.Add(new Tuple<string, bool, bool>(weekName, count == 7, isThisWeek));
                    results.Add(new Tuple<string, bool, bool>(weekName, count >= goal.TargetCount, isThisWeek));
                } 
                else if (goal.Frequency == GoalFrequency.Weekly)
                {
                    // results.Add(new GoalLogEntry(weekName,  count >= goal.TargetCount, 1));
                    results.Add(new Tuple<string, bool,bool>(weekName, count >= goal.TargetCount, isThisWeek));
                }
                else
                {
                    throw new NotImplementedException();
                }
            }
        } 
        
        // var final = results.GroupBy(x => x.WeekName)
        var final = results.GroupBy(x => x.Item1)
            // .Select(x => new GoalLogEntry(x.Key, x.All(y => y.Completed == true), x.Count()))
            .Select(x => new GoalLogEntry(
                x.Key, 
                x.All(y => y.Item2 == true), 
                x.Count(y => y.Item2 == true),
                x.Count(y => y.Item2 == false),
                x.Count(),
                x.First().Item3
            ))
            .OrderByDescending(x => x.WeekName)
            .ToList();

        return new GetGoalLogsResult(
            final,
            final.Count(x => x.Completed),
            final.Where(x => !x.IsThisWeek).Count(x => !x.Completed));
    }

    public async Task<List<Goal>> GetGoals([Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        return session.Query<Goal>().ToList();
    }
    
    // TODO: I need to get goals and then give 2 dates, and see the status of my goals for the week
    
    
}

public class GetGoalLogInput
{
     public DateTime? Start { get; set; }
     public DateTime? End { get; set; }
}



[ExtendObjectType(typeof(ActivityLog), IgnoreProperties = new[] {nameof(ActivityLog.GoalId)})]
public class ActivityLogExtensions
{
    public async Task<Goal> GetGoal([Parent] ActivityLog activityLog, [Service] DocumentStore store)
    {
        await using var session = store.OpenSession();
        var goal = session.Query<Goal>().First(x => x.Id == activityLog.GoalId);
        return goal;
    }
    
    // data loader?
    // Load all goals for this date?
    // public async Task<DailyGoal> 
}

// [ExtendObjectType(typeof(Goal))]
// public class GoalExtensions
// {
//     public async Task GetCurrentStatus
//     {
//         
//     }
// }

// public record GoalCurrentStatus(string Week, );