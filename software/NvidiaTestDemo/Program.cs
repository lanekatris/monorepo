using NvAPIWrapper;
using NvidiaTestDemo;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .UseWindowsService()
    .Build();

NVIDIA.Initialize();
await host.RunAsync();
