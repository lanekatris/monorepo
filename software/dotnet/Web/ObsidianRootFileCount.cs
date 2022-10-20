using Microsoft.EntityFrameworkCore;
using Quartz;
using Web.Models;

namespace Web;

public class DirectoryFilesCounted
{
    public int Count { get; }
    public string Source { get; }

    public DirectoryFilesCounted(int count, string source)
    {
        Count = count;
        Source = source;
    }
}

public class ObsidianRootFileCount : IJob
{
    private readonly ILogger<ObsidianRootFileCount> _logger;
    private readonly ILkatApi _lkatApi;
    private readonly WebDbContext _db;
    private readonly string _eventName = "directory-files-counted";

    public ObsidianRootFileCount(ILogger<ObsidianRootFileCount> logger, ILkatApi lkatApi, WebDbContext db)
    {
        _logger = logger;
        _lkatApi = lkatApi;
        _db = db;
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
        await _lkatApi.DirectoryFilesCounted(new PublishInput(ev, _eventName));
        _db.LkatEvents.Add(new LkatEvent(_eventName));
        await _db.SaveChangesAsync();

        _logger.Log(LogLevel.Information, "Done");
    }
}