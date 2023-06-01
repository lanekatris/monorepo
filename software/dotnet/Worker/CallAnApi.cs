using Quartz;

namespace Worker;

public class CallAnApi : IJob
{
    private readonly ILogger<CallAnApi> _log;
    private readonly string _url;
    public CallAnApi(IConfiguration configuration, ILogger<CallAnApi> log)
    {
        _log = log;
        var variable = "ARBITER_NEXT_DNS_URL";
        _url = configuration[variable] ?? throw new Exception($"Env var not found: {variable}");
    }
    
    public async Task Execute(IJobExecutionContext context)
    {
        await new HttpClient().GetStringAsync(new Uri(_url));
        _log.LogInformation("Called next dns: {Url}", _url);
        
    }
}