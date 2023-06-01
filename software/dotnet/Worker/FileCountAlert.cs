using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Quartz;
using Shared;
using Worker.Models;

namespace Worker;

public abstract class FileCountAlert : IJob
{
    private readonly WebDbContext _db;
    private readonly ILogger _logger;
    private readonly ILkatClientTesties _api;
    public abstract string EventName { get; }
    public abstract string FolderPath { get; }
    public string SearchPattern { get; internal set; } = "*.*";
    public abstract string Source { get; }

    public FileCountAlert(WebDbContext db, ILogger logger, ILkatClientTesties api)
    {
        _db = db;
        _logger = logger;
        _api = api;
    }
    
    private async Task<bool> ShouldExecute()
    {
        var start = DateTime.Today;
        var end = DateTime.Today.AddDays(1);

        var query = _db.LkatEvents.Where(x =>
            (x.Date >= start && x.Date < end) && x.Name == EventName
        );

        var exists = await query.AnyAsync();
        return !exists;
    }
    
    public async Task Execute(IJobExecutionContext context)
    {
        _logger.Log(LogLevel.Information, " ==== Running ==== ");

        // var shouldExecute = await ShouldExecute();
        // if (!shouldExecute)
        // {
        //     _logger.Log(LogLevel.Information, "Not doing anything, shouldExecute = false");
        //     return;
        // }

        // var p = @"C:\Users\looni\OneDrive\Documents\vault1";
        var files = Directory.GetFiles(FolderPath, SearchPattern, SearchOption.TopDirectoryOnly);
        _logger.Log(LogLevel.Information, "Found {Length} files in {Dir}", files.Length, FolderPath);

        var ev = new DirectoryFilesCounted(files.Length, Source);
        await _api.CreateFeedItem.ExecuteAsync(new FeedItemCreateInput()
        {
            Type = EventName,
            Message = $"Worker sending {Source} count",
            Data = JsonConvert.SerializeObject(ev)
        });

        _db.LkatEvents.Add(new LkatEvent(EventName));
        await _db.SaveChangesAsync();

        _logger.Log(LogLevel.Information, "Done");
    }
}

public class CameraRollFileCounter : FileCountAlert
{
    public override string EventName => "camera-roles-files-counted";
    public override string FolderPath => @"C:\Users\looni\OneDrive\Pictures\Camera Roll";
    // public override string SearchPattern => "*.*";
    // public override 
    public override string Source => "camera-roll";

    public CameraRollFileCounter(WebDbContext db, ILogger<CameraRollFileCounter> logger, ILkatClientTesties api) : base(
        db, logger, api)
    {
        SearchPattern = "*.*";
    }
}