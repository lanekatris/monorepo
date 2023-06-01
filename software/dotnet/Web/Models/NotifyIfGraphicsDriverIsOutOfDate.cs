using MediatR;

namespace Web;

public class NotifyIfGraphicsDriverIsOutOfDate : INotificationHandler<GraphicsDriverOutOfDate>
{
    private readonly IMediator _mediator;

    public NotifyIfGraphicsDriverIsOutOfDate(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    public async Task Handle(GraphicsDriverOutOfDate notification, CancellationToken cancellationToken)
    {
        var message = $"Your Nvidia graphis driver ({notification.Ev.YourVersion}) is out of date. Latest: {notification.Ev.LatestVersion}";
        await _mediator.Send(new SendEmailRequest(message, message), cancellationToken);
    }
}