using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Templates;

namespace Shared;

public static class LkatLoggerFactory
{
    public static Logger CreateLogger(string logPath = "")
    {
        var l = new LoggerConfiguration()
            // .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(new ExpressionTemplate(
                "[{@t:HH:mm:ss} {@l:u3} " +
                "{Substring(SourceContext, LastIndexOf(SourceContext, '.') + 1)}] {@m}\n{@x}"));

        if (!string.IsNullOrEmpty(logPath))
        {
            l.WriteTo.SQLite(logPath);
        }

        return l.CreateLogger();
    }
}