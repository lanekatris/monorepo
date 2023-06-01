using Microsoft.EntityFrameworkCore;

namespace Worker;

public class LogDbContext : DbContext
{
    public DbSet<Logs> Logs { get; set; }
    public LogDbContext(DbContextOptions<LogDbContext> options) : base(options)
    {
        
    }
}

public class Logs
{
    public int id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Level { get; set; }
    public string RenderedMessage { get; set; }
    public string Properties { get; set; }
}