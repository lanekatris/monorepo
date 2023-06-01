using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using MediatR;

namespace Web;

public class SendEmailRequest : IRequest
{
    public string Subject { get; }
    public string Body { get; }

    public SendEmailRequest(string subject, string body)
    {
        Subject = subject;
        Body = body;
    }
}

public class SendEmailRequestHandler : IRequestHandler<SendEmailRequest>
{
    public async Task<Unit> Handle(SendEmailRequest request, CancellationToken cancellationToken)
    {
        var client = new AmazonSimpleNotificationServiceClient();
        var command = new PublishRequest()
        {
            Message = request.Body,
            Subject = request.Subject,
            TopicArn = "arn:aws:sns:us-east-1:235680268517:mytopic-f9babe7"
        };
        await client.PublishAsync(command, cancellationToken);
        return Unit.Value;
    }
}