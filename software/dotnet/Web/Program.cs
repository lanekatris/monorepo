using Microsoft.EntityFrameworkCore;
using NvAPIWrapper;
using Quartz;
using Serilog;
using Serilog.Events;
using Serilog.Templates;
using Web;
using Web.Jobs;
using Web.Models;

var builder = WebApplication.CreateBuilder(args);

// https://nblumhardt.com/2021/06/customize-serilog-text-output/
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console(new ExpressionTemplate(
        "[{@t:HH:mm:ss} {@l:u3} " +
        "{Substring(SourceContext, LastIndexOf(SourceContext, '.') + 1)}] {@m}\n{@x}"))
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllersWithViews();

//https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/
builder.Services.AddDbContext<WebDbContext>(options => options.UseSqlite());

builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();

    q.ScheduleJob<CheckForNewerGraphicsDriver>(trigger =>
        trigger.WithIdentity("Check Graphics Driver Version")
            .WithSimpleSchedule(x => x.WithIntervalInHours(4).RepeatForever()));

    q.ScheduleJob<ObsidianRootFileCount>(trigger =>
        trigger.WithIdentity("Check Obsidian root file count")
            .WithSimpleSchedule(x => x.WithIntervalInHours(4).RepeatForever()));
});

builder.Services.AddQuartzServer(options =>
{
    options.WaitForJobsToComplete = true;
});

builder.Services.AddTransient<ILkatApi, LkatApi>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseSerilogRequestLogging();

NVIDIA.Initialize();

app.Run();

// dotnet publish -o publish -c Release -r win-x64 -p:PublishSingleFile=True