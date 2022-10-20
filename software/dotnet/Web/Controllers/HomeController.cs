using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web.Models;

namespace Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly WebDbContext _db;

    public HomeController(ILogger<HomeController> logger, WebDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    public async Task<IActionResult> Index()
    {
        var events = await _db.LkatEvents.OrderByDescending(x => x.Date).Take(1000).ToListAsync();
        return View(events);
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
}