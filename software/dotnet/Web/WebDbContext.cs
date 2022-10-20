using Microsoft.EntityFrameworkCore;

namespace Web.Models;

public class WebDbContext : DbContext
{
    public DbSet<LkatEvent> LkatEvents { get; set; }
    public string DbPath { get; }

    // todo: I can probably remove this and do it in program.cs 🤷
    public WebDbContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "lkat.db");
    }

    public WebDbContext(DbContextOptions<WebDbContext> options) : base(options)
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "lkat.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}

// Keep get set to make EF happy
public class LkatEvent
{
    public LkatEvent()
    {

    }

    public LkatEvent(string name)
    {
        this.Id = Guid.NewGuid();
        this.Date = DateTime.Now;
        this.Name = name;
    }

    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string? Name { get; set; }
}