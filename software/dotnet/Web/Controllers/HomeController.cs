using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.Models;

namespace Web.Controllers;

public class IndexModel
{
    public List<LkatEvent> Events { get; set; }
    public List<Logs> Logs { get; set; }
}

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly WebDbContext _db;
    private readonly LogDbContext _logDb;

    public HomeController(ILogger<HomeController> logger, WebDbContext db, LogDbContext logDb)
    {
        _logger = logger;
        _db = db;
        _logDb = logDb;
    }

    public async Task<IActionResult> Index()
    {
        var events = await _db.LkatEvents.OrderByDescending(x => x.Date).Take(1000).ToListAsync();
        var logs = await _logDb.Logs.OrderByDescending(x => x.Timestamp).Take(1000).ToListAsync();
        return View(new IndexModel()
        {
            Events = events,
            Logs = logs
        });
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    public IActionResult FileCount()
    {
        var files = Directory.GetFiles(@"C:\Users\looni\OneDrive\Documents\vault1", "*.md", SearchOption.TopDirectoryOnly);
        return Json(files);
    }

    public async Task<IActionResult> Logs()
    {
        var logs = await _logDb.Logs.OrderByDescending(x => x.Timestamp).ToListAsync();
        return Json(logs);
    }
}