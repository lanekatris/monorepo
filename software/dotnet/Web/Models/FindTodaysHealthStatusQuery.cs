using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Shared;
using Web.Db;

namespace Web;

public class FindTodaysHealthStatusRequest : IRequest<List<TaskDto>> { }

public class FindTodaysHealthStatusQuery : IRequestHandler<FindTodaysHealthStatusRequest, List<TaskDto>>
{
    private readonly IDbContextFactory<LkatContext> _factory;

    public FindTodaysHealthStatusQuery(IDbContextFactory<LkatContext> factory)
    {
        _factory = factory;
    }
    public async Task<List<TaskDto>> Handle(FindTodaysHealthStatusRequest request, CancellationToken cancellationToken)
    {
        var db = await _factory.CreateDbContextAsync(cancellationToken);
        // var nowEastern = DateTime.UtcNow.AddHours(-5).Date;
        var now = DateTime.UtcNow.Date;
        var latestEvent = await db.Feeds
            .Where(x => x.Type == "health-status-update")
            // .Where(x => x.Created.Date == DateTime.UtcNow.Date)
            .Where(x => x.Created.Date == now)
            .OrderBy(x => x.Created)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
        if (latestEvent == null) return new List<TaskDto>();

        return JsonConvert.DeserializeObject<HealthStatusUpdated>(latestEvent.Data).TaskList;
    }
}