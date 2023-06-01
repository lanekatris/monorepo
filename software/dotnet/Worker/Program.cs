using Microsoft.EntityFrameworkCore;
using NvAPIWrapper;
using Quartz;
using Serilog;
using Serilog.Events;
using Serilog.Templates;
using Shared;
using Worker;
using Worker.Models;

var builder = WebApplication.CreateBuilder(args);

var folder = Environment.SpecialFolder.LocalApplicationData;
var path = Environment.GetFolderPath(folder);
var logDbPath = System.IO.Path.Join(path, "lkat-arbiter", "logs.db");

Log.Logger = LkatLoggerFactory.CreateLogger(logDbPath);

Log.Logger.Information("Log path: " + logDbPath);

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllersWithViews();

//https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/
builder.Services.AddDbContext<WebDbContext>(options => options.UseSqlite());
builder.Services.AddDbContext<LogDbContext>(options => options.UseSqlite($"Data Source={logDbPath}"));

var groupName = "group1";
builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();

    q.ScheduleJob<CheckForNewerGraphicsDriver>(trigger =>
        trigger.WithIdentity("Check Graphics Driver Version", groupName)
            .WithSimpleSchedule(x => x.WithIntervalInHours(6).RepeatForever()));
    //
    // q.ScheduleJob<ObsidianRootFileCount>(trigger =>
    //     trigger.WithIdentity("Check Obsidian root file count", groupName)
    //         .WithSimpleSchedule(x => x.WithIntervalInHours(4).RepeatForever()));
    //
    // q.ScheduleJob<Healthcheck>(trigger =>
    //     trigger.WithIdentity("Healthcheck", groupName).WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever()));
    //
    // q.ScheduleJob<Sleeper>(trigger =>
    //     trigger.WithIdentity("Sleeper", groupName)
    //         .WithSimpleSchedule(x => x.WithIntervalInSeconds(30).RepeatForever()));
    //
    // q.ScheduleJob<GetHealthStatus>(trigger =>
    //     trigger.WithIdentity("GetHealthStatus", groupName)
    //         .WithSimpleSchedule(x => x.WithIntervalInHours(6).RepeatForever()));
    //
    // q.ScheduleJob<CallAnApi>(trigger =>
    //     trigger.WithIdentity("CallAnApi", groupName)
    //         .WithSimpleSchedule(x => x.WithIntervalInHours(24).RepeatForever()));
    //
    // q.ScheduleJob<CameraRollFileCounter>(trigger =>
    //     trigger.WithIdentity("Check camera roll file count", groupName)
    //         .WithSimpleSchedule(x => x.WithIntervalInHours(4).RepeatForever()));

    q.ScheduleJob<CreateBlogFeed>(trigger => trigger.WithIdentity("Create blog feed", groupName)
        .WithSimpleSchedule(x => x.WithIntervalInSeconds(10).RepeatForever()));
});

builder.Services.AddQuartzServer(options =>
{
    options.WaitForJobsToComplete = true;
});

var apiKey = Environment.GetEnvironmentVariable("ARBITER_API_KEY") ?? throw new Exception("ARBITER_API_KEY");
var apiUrl = Environment.GetEnvironmentVariable("ARBITER_URL") ?? throw new Exception("ARBITER_URL");

builder.Services.AddLkatClientTesties()
    .ConfigureHttpClient(x =>
    {
        x.BaseAddress = new Uri(apiUrl);
        x.DefaultRequestHeaders.Add("x-api-key", apiKey);
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseSerilogRequestLogging();

NVIDIA.Initialize();

app.Run();

// dotnet publish -c Release -r win-x64 --self-contained true
// http://localhost:5000