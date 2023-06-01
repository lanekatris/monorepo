// See https://aka.ms/new-console-template for more information

using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using NvAPIWrapper;

async Task<int> GetLatestVersion()
{
    var redirectUrl = await new HttpClient().GetStringAsync("https://www.nvidia.com/Download/processDriver.aspx?psid=120&pfid=933&rpf=1&osid=135&lid=1&lang=en-us&ctk=0&dtid=1&dtcid=1");
    var html = await new HttpClient().GetStringAsync($"https://www.nvidia.com/download/{redirectUrl}");
    var document = new HtmlDocument();
    document.LoadHtml(html);

    var idk = document.GetElementbyId("tdVersion");

    var regEx = new Regex(@"[1-9]\d*(\.\d+)?");
    var matches = regEx.Match(idk.InnerText);
    var latestValue = matches.Value.Replace(".", "");

    return int.Parse(latestValue);
}

int LatestVersion = await GetLatestVersion();
bool NeedsUpdate = LatestVersion > NVIDIA.DriverVersion;
Console.WriteLine(JsonConvert.SerializeObject(new
{
    LatestVersion,
    NVIDIA.DriverVersion,
    NeedsUpdate,
    NVIDIA.ChipsetInfo,
    NVIDIA.DriverBranchVersion
}, Formatting.Indented));

