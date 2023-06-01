using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Itenso.TimePeriod;
using LambdaEmptyServerless1;
using NUnit.Framework;
using Shared;
using Web;
using Worker;

namespace Tests;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    // [Test]
    // public async Task Test1()
    // {
    //     await new GetHealthStatus().Execute(null);
    //     Assert.Pass();
    // }
    //
    // [Test]
    // public void ShouldBeTodaysDateFormatted()
    // {
    //     var result = new GetHealthStatus().GetTodaysNoteFilename();
    //     Assert.IsNotNull(result);
    // }

    // [Test]
    // public void FindLatestHealthUpdateQuery()
    // {
    //     var obj = new FindTodaysHealthStatusQuery();
    //     List<TaskDto> result = await obj.Invoke();
    //
    // }

    // [Test]
    // public void MessWithCloudFunction()
    // {
    //     var f = new Functions();
    //     Assert.Equals("HI", f.Get("hi", null));
    // }
    [Test]
    public void HappyPathGetGoalStatuses()
    {
        var goals = new List<Goal>()
        {
            new() { Id = Guid.NewGuid(), Created = new DateTime(2023,1,1), Name = "uno", Frequency = GoalFrequency.Daily},
            new() {Id = Guid.NewGuid(), Created = new DateTime(2023,1,10), Name = "dos", Frequency = GoalFrequency.Weekly, TargetCount = 2}
            
        };
        var log = new List<ActivityLogCreated>()
        {
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,1), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,2), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,3), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,4), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,5), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,6), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,7), goals[0].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,3), goals[1].Id),
            new(Guid.NewGuid(), Guid.NewGuid(), new DateTime(2023, 1,4), goals[1].Id),
        };

        var results = new List<GoalLogEntry>();
        
        var availableWeeks = GetWeeks();
        foreach (var availableWeek in availableWeeks)
        {
            // find log entries between the dates
            var entries = log.Where(x => x.Date >= availableWeek.Start && x.Date <= availableWeek.End).ToList();
            foreach (var goal in goals)
            {
                var count = entries.Count(x => x.GoalId == goal.Id);
                string weekName = $"{availableWeek.Year}-{availableWeek.WeekOfYear:00}";
                if (goal.Frequency == GoalFrequency.Daily)
                {
                    // results.Add(new GoalLogEntry(weekName,  count == 7)); // full 7 day week
                } 
                else if (goal.Frequency == GoalFrequency.Weekly)
                {
                    // results.Add(new GoalLogEntry(weekName,  count >= goal.TargetCount));
                }
                else
                {
                    throw new NotImplementedException();
                }
            }
        } 
        
        var final = results.GroupBy(x => x.WeekName)
            // .Select(x => new GoalLogEntry(x.Key, x.All(y => y.Completed == true)))
            .ToList();
        
        // Assert.AreEqual(1, final.Count(x => x.Completed == true));
    }

    public List<Week> GetWeeks()
    {
        DateTime start = new DateTime(2023, 1, 1);
        DateTime end = DateTime.Now;
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