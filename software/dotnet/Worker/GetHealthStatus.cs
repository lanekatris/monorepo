using Markdig;
using Markdig.Extensions.TaskLists;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using Newtonsoft.Json;
using Quartz;
using Shared;

namespace Worker;

public class GetHealthStatus : IJob
{
    private readonly ILkatClientTesties _api;
    private readonly ILogger<GetHealthStatus> _logger;

    public GetHealthStatus(ILkatClientTesties api, ILogger<GetHealthStatus> logger)
    {
        _api = api;
        _logger = logger;
    }
    
    public string GetTodaysNoteFilename()
    {
        return DateTime.Now.ToString("yyyy-M-d");
    }
    
    public async Task Execute(IJobExecutionContext context)
    {
        // load file
        var fileName = GetTodaysNoteFilename();
        var filePath = @"C:\Users\looni\OneDrive\Documents\vault1\" + fileName + ".md";
        if (!File.Exists(filePath))
        {
            _logger.LogWarning("Obsidian daily not not found, not doing anything: {FilePath}", filePath);
            return;
        }

        var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
        var document = Markdown.Parse(File.ReadAllText(filePath), pipeline);

        var taskList = document.Select(x => x as ListBlock)
            .Where(x => x is not null)
            .FirstOrDefault()
            .Select(x => x as ListItemBlock)
            .Where(x => x is not null)
            .Select(x => x[0] as ParagraphBlock)
            .Select(x => x.Inline)
            .Select(x => 
                new TaskDto((x.FirstChild as TaskList).Checked, (x.LastChild as LiteralInline).ToString()))
            .ToList();
        
        _logger.LogInformation("do work bro");
        var data = JsonConvert.SerializeObject(new HealthStatusUpdated(taskList));
        await _api.CreateFeedItem.ExecuteAsync(new FeedItemCreateInput()
        {
            Type = "health-status-update",
            Message = "hey i'm from strawberry and the worker process!",
            Data = data
        });
        _logger.LogInformation("send my load: " + data);

    }
}