using Microsoft.EntityFrameworkCore;

namespace Web.Models;

public class WebDbContext : DbContext
{
    public DbSet<LkatEvent> LkatEvents { get; set; }
    public string DbPath { get; }

    public WebDbContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "lkat.db");
        // Console.WriteLine("db path: " + DbPath);
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