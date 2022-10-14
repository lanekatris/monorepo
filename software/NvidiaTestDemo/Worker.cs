using System.Text.RegularExpressions;
using HtmlAgilityPack;
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
        while (!stoppingToken.IsCancellationRequested)
        {
            var latestVersion = await GetLatestVersion();
            var usingLatestVersion = latestVersion == NVIDIA.DriverVersion;
            _logger.LogInformation("Using latest version: " + usingLatestVersion);
            _logger.LogInformation("Latest version: " + latestVersion);
            _logger.LogInformation("nvidia " + NVIDIA.DriverVersion + " --- " + NVIDIA.DriverBranchVersion + " --- " + NVIDIA.InterfaceVersionString);
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            // new HttpClient().PostAsync("https://49k5qibsy9.execute-api.us-east-2.amazonaws.com/dev/uploads")

            var sevenDays = TimeSpan.FromDays(7).TotalMilliseconds;
            await Task.Delay(Convert.ToInt32(sevenDays), stoppingToken);
        }
    }
}
