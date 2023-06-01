using Quartz;

namespace Web;

public class Healthcheck : IJob
{
    private readonly ILogger<Healthcheck> _logger;

    public Healthcheck(ILogger<Healthcheck> logger)
    {
        _logger = logger;
    }

    public Task Execute(IJobExecutionContext context)
    {
        _logger.Log(LogLevel.Information, "I'm still here and running");
        return Task.CompletedTask;
    }
}