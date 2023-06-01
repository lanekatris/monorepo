using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Quartz;
using Shared;
using Worker.Models;

namespace Worker;

public class ObsidianRootFileCount : IJob
{
    private readonly ILogger<ObsidianRootFileCount> _logger;
    private readonly WebDbContext _db;
    private readonly ILkatClientTesties _api;
    private readonly string _eventName = "directory-files-counted";

    public ObsidianRootFileCount(ILogger<ObsidianRootFileCount> logger, WebDbContext db, ILkatClientTesties api)
    {
        _logger = logger;
        _db = db;
        _api = api;
    }

    private async Task<bool> ShouldExecute()
    {
        var start = DateTime.Today;
        var end = DateTime.Today.AddDays(1);

        var query = _db.LkatEvents.Where(x =>
           (x.Date >= start && x.Date < end) && x.Name == _eventName
        );

        var exists = await query.AnyAsync();
        return !exists;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.Log(LogLevel.Information, " ==== Running ==== ");

        var shouldExecute = await ShouldExecute();
        if (!shouldExecute)
        {
            _logger.Log(LogLevel.Information, "Not doing anything, shouldExecute = false");
            return;
        }

        var p = @"C:\Users\looni\OneDrive\Documents\vault1";
        var files = Directory.GetFiles(p, "*.md", SearchOption.TopDirectoryOnly);
        _logger.Log(LogLevel.Information, "Found {Length} files in {Dir}", files.Length, p);

        var ev = new DirectoryFilesCounted(files.Length, "obsidian-vault");
        await _api.CreateFeedItem.ExecuteAsync(new FeedItemCreateInput()
        {
            Type = _eventName,
            Message = "Worker sending obsidian root count",
            Data = JsonConvert.SerializeObject(ev)
        });

        _db.LkatEvents.Add(new LkatEvent(_eventName));
        await _db.SaveChangesAsync();

        _logger.Log(LogLevel.Information, "Done");
    }
}