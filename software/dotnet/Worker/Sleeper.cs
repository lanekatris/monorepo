using System.Runtime.InteropServices;
using Amazon.SQS;
using Amazon.SQS.Model;
using Quartz;

namespace Worker;

public class Sleeper : IJob
{
    private readonly ILogger<Sleeper> _log;
    private readonly AmazonSQSClient _client;

    public Sleeper(ILogger<Sleeper> log)
    {
        _log = log;
        _client = new AmazonSQSClient();
    }

    private async Task<string> GetQueueUrl()
    {
        var response = await _client.GetQueueUrlAsync("sleep-queue-d3fd1ed");
        return response.QueueUrl;
    }
    
    // https://www.codeproject.com/Tips/480049/Shut-Down-Restart-Log-off-Lock-Hibernate-or-Sleep
    [DllImport("PowrProf.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
    static extern bool SetSuspendState(bool hiberate, bool forceCritical, bool disableWakeEvent);
    
    public async Task Execute(IJobExecutionContext context)
    {
        _log.LogInformation("Getting sleep messages");
        var queueUrl = await GetQueueUrl();
        _log.LogInformation("Using queue: {QueueUrl}", queueUrl);
        
        var request = new ReceiveMessageRequest
        {
            QueueUrl = queueUrl,
            MaxNumberOfMessages = 10,
            WaitTimeSeconds = 20
        };
        var response = await _client.ReceiveMessageAsync(request);
        if (response.Messages.Count > 0)
        {
            _log.LogInformation($"Messages found");
            foreach (var message in response.Messages)
            {
                await _client.DeleteMessageAsync(new DeleteMessageRequest(queueUrl, message.ReceiptHandle));
                _log.LogInformation($"Deleted message {message.MessageId}");
            }
            _log.LogInformation($"Putting computer to sleep...");
            SetSuspendState(false, true, true);
        }
        else
        {
            _log.LogInformation($"No sleep messages to process");
        }
    }
}