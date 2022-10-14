using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using NvAPIWrapper;

namespace NvidiaTestDemo;

public class GraphicsDriverRead
{
    public GraphicsDriverRead(string yourVersion, string latestVersion)
    {
        YourVersion = yourVersion;
        LatestVersion = latestVersion;
    }

    public string YourVersion { get; }
    public string LatestVersion { get; }
}

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    private async Task<int> GetLatestVersion()
    {
        var html = await new HttpClient().GetStringAsync("https://www.nvidia.com/Download/driverResults.aspx/193297/en-us/");
        var document = new HtmlDocument();
        document.LoadHtml(html);

        var idk = document.GetElementbyId("tdVersion");
        // var regex = new Regex(@"\s+");
        // var idk = @"\r\n                                                517.48&nbsp;&nbsp;WHQL\r\n                                            ";
        // , @"\s+", "")
        // .Replace(@"\r\n","")
        // .Replace("@\r", "")
        // .Replace("@\n", "");
        // .Replace(new Regex(@"\s+"), "");

        var regEx = new Regex(@"[1-9]\d*(\.\d+)?");
        var matches = regEx.Match(idk.InnerText);
        var latestValue = matches.Value.Replace(".", "");

        return int.Parse(latestValue);


        // return 5;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var apiKey = Environment.GetEnvironmentVariable("ARBITER_API_KEY");
        if (string.IsNullOrEmpty(apiKey)) throw new Exception("ARBITER_API_KEY not in environment");
        
        while (!stoppingToken.IsCancellationRequested)
        {
            var latestVersion = await GetLatestVersion();
            var usingLatestVersion = latestVersion == NVIDIA.DriverVersion;
            _logger.LogInformation("Using latest version: " + usingLatestVersion);
            _logger.LogInformation("Latest version: " + latestVersion);
            _logger.LogInformation("nvidia " + NVIDIA.DriverVersion + " --- " + NVIDIA.DriverBranchVersion + " --- " + NVIDIA.InterfaceVersionString);
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            // new HttpClient().PostAsync("https://2ukhlyth8a.execute-api.us-east-2.amazonaws.com/stage/graphics-driver-read")

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("x-api-key", apiKey);
            var payload = new GraphicsDriverRead(NVIDIA.DriverVersion.ToString(), latestVersion.ToString());
            var serialized = JsonConvert.SerializeObject(payload);
            var result = await client.PostAsync("https://2ukhlyth8a.execute-api.us-east-2.amazonaws.com/stage/graphics-driver-read", new StringContent(serialized), stoppingToken);
            _logger.LogInformation("result from lambda: " + await result.Content.ReadAsStringAsync(stoppingToken));

            var sevenDays = TimeSpan.FromDays(1).TotalMilliseconds;
            await Task.Delay(Convert.ToInt32(sevenDays), stoppingToken);
        }
    }
}
