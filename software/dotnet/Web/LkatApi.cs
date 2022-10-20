using Newtonsoft.Json;

namespace Web.Models;

public interface ILkatApi
{
    Task GraphicsDriverRead(GraphicsDriverRead ev);
    Task DirectoryFilesCounted(PublishInput ev);
}

public class PublishInput
{
    public object detail { get; set; }
    public string detailType { get; set; }
    public string source { get; }

    public PublishInput(object ev, string dt)
    {
        detail = ev;
        detailType = dt;
        source = "Arbiter";
    }
}

public class LkatApi : ILkatApi
{
    private readonly ILogger<LkatApi> _logger;
    private readonly HttpClient _client;

    public LkatApi(ILogger<LkatApi> logger)
    {
        var apiKey = Environment.GetEnvironmentVariable("ARBITER_API_KEY");
        var apiUrl = Environment.GetEnvironmentVariable("ARBITER_URL");
        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiUrl)) throw new Exception("ARBITER_API_KEY or ARBITER_URL not in environment");

        _logger = logger;
        _client = new HttpClient();
        _client.BaseAddress = new Uri(apiUrl);
        _client.DefaultRequestHeaders.Add("x-api-key", apiKey);
    }

    public async Task GraphicsDriverRead(GraphicsDriverRead ev)
    {
       var serialized = JsonConvert.SerializeObject(ev);
        var result = await _client.PostAsync("graphics-driver-read", new StringContent(serialized));
        _logger.LogInformation("result from lambda: " + await result.Content.ReadAsStringAsync());
    }

    public async Task DirectoryFilesCounted(PublishInput ev)
    {
        var serialized = JsonConvert.SerializeObject(ev);
        var result = await _client.PostAsync("publish", new StringContent(serialized));
        _logger.LogInformation("result from lambda: " + await result.Content.ReadAsStringAsync());
    }
}