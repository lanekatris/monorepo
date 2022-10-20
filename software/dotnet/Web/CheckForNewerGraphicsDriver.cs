using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using NvAPIWrapper;
using Quartz;
using Web.Models;

namespace Web.Jobs;



public class CheckForNewerGraphicsDriver : IJob
{
    private readonly ILogger<CheckForNewerGraphicsDriver> _logger;
    private readonly ILkatApi _lkatApi;
    private readonly WebDbContext _db;
    private readonly string _eventName = "graphics-driver-read-submitted";

    public CheckForNewerGraphicsDriver(ILogger<CheckForNewerGraphicsDriver> logger, ILkatApi lkatApi, WebDbContext db)
    {
        _logger = logger;
        _lkatApi = lkatApi;
        _db = db;
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

    private async Task<ShouldSubmitEventResponse> ShouldSubmitEvent()
    {
        var doesNotExists = await ShouldSendEvent();
        if (!doesNotExists) return new ShouldSubmitEventResponse();

        var latestVersion = await GetLatestVersion();
        if (NVIDIA.DriverVersion == latestVersion) return new ShouldSubmitEventResponse();

        return new ShouldSubmitEventResponse(new GraphicsDriverRead(NVIDIA.DriverVersion.ToString(), latestVersion.ToString()));
    }

    private async Task<bool> ShouldSendEvent()
    {
        var start = DateTime.Today;
        var end = DateTime.Today.AddDays(1);

        var query = _db.LkatEvents.Where(x =>
           (x.Date >= start && x.Date < end) && x.Name == _eventName
        );

        var exists = await query.AnyAsync();
        return !exists;
    }

    private async Task SendEvent(GraphicsDriverRead ev)
    {
        var shouldSend = await ShouldSendEvent();
        if (shouldSend)
        {
            _logger.Log(LogLevel.Information, "Sending event...");
            await _lkatApi.GraphicsDriverRead(ev);
            _db.LkatEvents.Add(new LkatEvent(_eventName));
            await _db.SaveChangesAsync();
        }
        else
        {
            _logger.Log(LogLevel.Information, "Not sending event because shouldSend false");
        }
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.Log(LogLevel.Information, " ==== Running ==== ");

        var response = await ShouldSubmitEvent();
        if (response.ShouldSubmit)
        {
            await SendEvent(response.Ev);
        }
        else
        {
            _logger.Log(LogLevel.Information, "Not sending event because ShouldSubmitEvent false");
        }

        _logger.Log(LogLevel.Information, "Done");
    }

    private class ShouldSubmitEventResponse
    {
        public GraphicsDriverRead? Ev { get; }

        public ShouldSubmitEventResponse()
        {
            ShouldSubmit = false;
        }

        public ShouldSubmitEventResponse(GraphicsDriverRead ev)
        {
            Ev = ev;
            ShouldSubmit = true;
        }

        public bool ShouldSubmit { get; }
    }
}