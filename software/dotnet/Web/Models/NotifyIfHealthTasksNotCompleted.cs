using MediatR;

namespace Web;

public class NotifyIfHealthTasksNotCompleted : INotificationHandler<HealthTasksQueried>
{
    private readonly ILogger<NotifyIfHealthTasksNotCompleted> _log;
    private readonly IMediator _mediator;

    public NotifyIfHealthTasksNotCompleted(ILogger<NotifyIfHealthTasksNotCompleted> log, IMediator mediator)
    {
        _log = log;
        _mediator = mediator;
    }
    
    public async Task Handle(HealthTasksQueried notification, CancellationToken cancellationToken)
    {
        var completedCount = notification.Tasks.Count(x => x.Done);
        if (completedCount >= notification.Tasks.Count)
        {
            _log.LogInformation($"No need to notify about health tasks since they are all completed!");
            return;
        }
        
        var message = $"You've only done {completedCount} of {notification.Tasks.Count} health tasks, get to it!";
        await _mediator.Send(new SendEmailRequest(message, message), cancellationToken);
    }
}