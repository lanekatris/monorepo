using Quartz;

namespace Worker;

public class Healthcheck : IJob
{
    private readonly ILogger<Healthcheck> _logger;

    public Healthcheck(ILogger<Healthcheck> logger)
    {
        _logger = logger;
    }

    public Task Execute(IJobExecutionContext context)
    {
        _logger.Log(LogLevel.Information, "I\'m still here and running {Now}", DateTime.Now);
        return Task.CompletedTask;
    }
}