using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using NvAPIWrapper;
using Quartz;

namespace Web.Models;

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

public class Testies : IJob
{
    private readonly ILogger<Testies> _logger;

    public Testies(ILogger<Testies> logger)
    {
        _logger = logger;
    }

    private async Task<int> GetLatestVersion()
    {
        var redirectUrl = await new HttpClient().GetStringAsync("https://www.nvidia.com/Download/processDriver.aspx?psid=120&pfid=933&rpf=1&osid=135&lid=1&lang=en-us&ctk=0&dtid=1&dtcid=1");
        var html = await new HttpClient().GetStringAsync(redirectUrl);
        var document = new HtmlDocument();
        document.LoadHtml(html);

        var idk = document.GetElementbyId("tdVersion");

        var regEx = new Regex(@"[1-9]\d*(\.\d+)?");
        var matches = regEx.Match(idk.InnerText);
        var latestValue = matches.Value.Replace(".", "");

        return int.Parse(latestValue);
    }

    public Task Execute(IJobExecutionContext context)
    {
        // var latestVersion = await GetLatestVersion();
        _logger.Log(LogLevel.Information, "Testies said hi :) " + NVIDIA.DriverVersion);
        using var db = new WebDbContext();

        var result = db.LkatEvents.ToList();
        _logger.Log(LogLevel.Information, "found x results: " + result.Count);

        //
        // var apiKey = Environment.GetEnvironmentVariable("ARBITER_API_KEY");
        // var apiUrl = Environment.GetEnvironmentVariable("ARBITER_URL");
        // if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiUrl)) throw new Exception("ARBITER_API_KEY or ARBITER_URL not in environment");
        //
        // var client = new HttpClient();
        // client.DefaultRequestHeaders.Add("x-api-key", apiKey);
        // var payload = new GraphicsDriverRead(NVIDIA.DriverVersion.ToString(), latestVersion.ToString());
        // var serialized = JsonConvert.SerializeObject(payload);
        // var result = await client.PostAsync(apiUrl, new StringContent(serialized));
        // _logger.LogInformation("result from lambda: " + await result.Content.ReadAsStringAsync());
    }
}