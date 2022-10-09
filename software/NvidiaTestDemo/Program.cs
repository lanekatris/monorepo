using NvAPIWrapper;
using NvidiaTestDemo;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .Build();

NVIDIA.Initialize();
await host.RunAsync();
