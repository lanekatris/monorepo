using System.Reflection;
using HotChocolate.Types.Pagination;
using Marten;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Serilog.Templates;
using Shared;
using Weasel.Core;
using Web;
using Web.Db;

string CORS_IDENTIFIER = "cors";
var builder = WebApplication.CreateBuilder(args);
// https://nblumhardt.com/2021/06/customize-serilog-text-output/
Log.Logger = LkatLoggerFactory.CreateLogger();
builder.Host.UseSerilog();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.RestApi);

var martenDbConnString = Environment.GetEnvironmentVariable("EVERYTHING_DB_CONN") ??
                         throw new Exception("EVERYTHING_DB_CONN not found");

var lkatDb = Environment.GetEnvironmentVariable("LKAT_DB") ?? throw new Exception("LKAT_DB not found");
builder.Services.AddPooledDbContextFactory<LkatContext>(
    opts => opts.UseMySql(lkatDb, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.23-mysql")));
builder.Services.AddMarten(options =>
{
    options.Connection(martenDbConnString);
    options.AutoCreateSchemaObjects = AutoCreate.All;
});

builder.Services.AddSingleton(DocumentStore.For(_ =>
{
    _.Connection(martenDbConnString);
    _.Projections.SelfAggregate<Vehicle>();
    _.Projections.SelfAggregate<DiscDto>();
    _.Projections.SelfAggregate<Goal>();
    _.Projections.SelfAggregate<ActivityLog>();
}));

builder.Services.AddGraphQLServer()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = true)
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<ActivityLogExtensions>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddMartenSorting()
    .AddMartenFiltering()
    .SetPagingOptions(new PagingOptions()
    {
        DefaultPageSize = 1000
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(CORS_IDENTIFIER, builder =>
    {
        builder.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddMediatR(Assembly.GetExecutingAssembly());

var app = builder.Build();

app.UseCors(CORS_IDENTIFIER);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseEndpoints(endpoints => endpoints.MapGraphQL());

app.MapControllers();
app.UseSerilogRequestLogging();


app.Run();