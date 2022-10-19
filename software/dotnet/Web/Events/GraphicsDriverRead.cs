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