using NvAPIWrapper;
using NvidiaTestDemo;
using Serilog;

var logPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File(Path.Combine(logPath, "Arbiter", "logs.txt"), rollingInterval: RollingInterval.Day)
    .CreateLogger();

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .UseSerilog()
    .UseWindowsService()
    .Build();

NVIDIA.Initialize();
await host.RunAsync();
