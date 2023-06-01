using Itenso.TimePeriod;
using Marten.Events;
using Newtonsoft.Json;

namespace Shared;

public class Vehicle
{
    public Guid Id { get; set; }
    public DateTimeOffset LastDriven { get; set; }
    public string Name { get; set; }
    public Guid UserId { get; set; }
    // public List<string> History { get; set; } = new();

    // public void Apply(VehicleDriven e)
    // {
    //     LastDriven = e.Date;
    //     History.Add(e.ToString());
    // }
    
    public void Apply(IEvent<VehicleDriven> e)
    {
        
        // LastDriven = e.Data
        LastDriven = e.Data.Date;
        // History.Add($"{e.Id}: {e.Data.ToString()}");
    }

    public void Apply(VehicleNameUpdated e)
    {
        Name = e.Name;
        UserId = e.UserId;
    }
}

public enum DiscDtoType
{
    Disc,
    Mini
}

public class DiscDto
{
    public Guid Id { get; set; }

    public void Apply(IEvent<DiscCreated> e)
    {
        // Created = e.Date;
        // Created = e.Timestamp;
        // Created = e.Data.created?.ToDateTime(new TimeOnly()) ?? e.Timestamp;
        // Created = e.Data.created == null
        //     ? e.Timestamp
        //     : new DateTimeOffset(e.Data.created.Value.ToDateTime(new TimeOnly(0, 0)));
        // var dateOnly = e.Data.created ?? DateOnly.FromDateTime(e.Timestamp.DateTime);
        // DateOnly.FromDateTime(DateTime.Now);
        // Created = $"{dateOnly.Year}-{dateOnly.Month}-{dateOnly.Day}";
        Created = e.Data.Created;
        Brand = e.Data.Brand;
        Model = e.Data.Model;
        Number = e.Data.Number;
        Color = e.Data.Color;
        Tags = e.Data.Tags;
        DiscType = e.Data.Type;
        Price = e.Data.Price;
        Weight = e.Data.Weight;
        UserId = e.Data.UserId;
        History.Add(nameof(DiscCreated));
    }

    public void Apply(IEvent<DiscUpdated> e)
    {
        Updated = e.Timestamp;
        if (e.Data.Number is not null)
            Number = (int)e.Data.Number;
        if (e.Data.Weight is not null)
            Weight = e.Data.Weight;
        if (e.Data.Price is not null)
            Price = e.Data.Price;
        if (e.Data.Tags is not null)
            Tags = e.Data.Tags;
        if (e.Data.Color is not null)
            Color = e.Data.Color;
        if (e.Data.Brand is not null)
            Brand = e.Data.Brand;
        if (e.Data.Model is not null)
            Model = e.Data.Model;
        
        History.Add(nameof(DiscUpdated));
    }

    public void Apply(IEvent<DiscDeleted> e)
    {
        Deleted = e.Timestamp;
        // History.Add(JsonConvert.SerializeObject(e.Data));
        History.Add(nameof(DiscDeleted));
    }

    public List<string> History { get; set; } = new();

    public DateTimeOffset? Deleted { get; set; }

    public DateTimeOffset? Updated { get; set; }

    public Guid UserId { get; set; }

    public int? Weight { get; set; }

    public DiscDtoType DiscType { get; set; }

    public decimal? Price { get; set; }

    public string[]? Tags { get; set; }

    public string? Color { get; set; }

    public int Number { get; set; }

    public string? Model { get; set; }

    public string? Brand { get; set; }

    public string? Created { get; set; }
}

public record DiscCreated(
    Guid? DiscId,
    string? Brand,
    string? Model,
    int Number,
    string? Color,
    string[]? Tags,
    DiscDtoType Type,
    decimal? Price,
    int? Weight,
    string? Created,
    Guid UserId
    ) : IUserAction { }

public record DiscUpdated(
    Guid DiscId, 
    Guid UserId, 
    string? Brand = null,
    string? Model = null,
    int? Number = null,
    string? Color = null,
    string[]? Tags = null,
    DiscDtoType? Type = null,
    decimal? Price = null,
    int? Weight = null) : IUserAction { }
    
public record DiscDeleted(Guid DiscId, Guid UserId);

// todo: could I also utilize bucket list items in this object?
public class Goal
{
    public Guid Id { get; set; }
    public DateTime Created { get; set; }

    public GoalType Type { get; set; } = GoalType.Fitness;
    public GoalFrequency Frequency { get; set; } = GoalFrequency.Daily;
    public int TargetCount { get; set; } = 1;
    public string[] Tags { get; set; } = { };
    public string? Name { get; set; }
    

    public void Apply(GoalCreated e)
    {
        Created = e.Date;
        Name = e.Name;
    }

    public void Apply(GoalUpdated e)
    {
        if (e.Frequency is not null)
            Frequency = (GoalFrequency)e.Frequency;
        if (e.TargetCount is not null)
            TargetCount = (int)e.TargetCount;
        // Type = (GoalType)e.GoalType;
    }
}

public enum GoalFrequency
{
    Daily,
    Weekly
}

public enum GoalType
{
    Fitness
}

public record GoalCreated(Guid GoalId, DateTime Date, string? Name);

public record GoalUpdated(Guid GoalId, DateTime Date, GoalFrequency? Frequency, int? TargetCount);

// public class WeeklyGoalBucket
// {
//     public Guid Id { get; set; }
//     public string WeekName { get; set; } = "2023-04";
//     
//     // associated goals
//     // associated workoutlog/activity/adventure
// }

public record ActivityLogCreated(Guid ActivityLogId, Guid UserId, DateTimeOffset Date, Guid GoalId);

// public record GoalEvaluated(int Count, Goal Goal, Week AvailableWeek);

// public record GoalLogEntry(string WeekName, Guid GoalId, bool Completed);
public record GoalLogEntry(string WeekName, bool Completed, int CompletedGoalCount, int UncompleteGoalCount, int GoalCount, bool IsThisWeek);

public record GetGoalLogsResult(List<GoalLogEntry> Entries, int TotalWeeksCompleted, int TotalWeeksUncompleted);

public class ActivityLog
{
    public Guid Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public Guid GoalId { get; set; }

    // public Goal GetGoal()
    // {
    //     return new Goal()
    //     {
    //         Name = "good news everybody"
    //     };
    // }
    
    public void Apply(ActivityLogCreated e)
    {
        Date = e.Date;
        GoalId = e.GoalId;
    }
}

public static class TimeHelper
{
    public static List<Week> GetWeeks(DateTime start, DateTime end)
    {
        // DateTime start = new DateTime(2023, 1, 1);
        // DateTime end = DateTime.Now;
        Week week = new Week(start);
        var weeks = new List<Week>() { };
        while (week.Start < end)
        {
            weeks.Add(week);
            week = week.GetNextWeek();
        }

        return weeks;
    }
}