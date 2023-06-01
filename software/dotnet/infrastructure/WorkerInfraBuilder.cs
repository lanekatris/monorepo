using Pulumi.Aws.Sqs;

namespace infrastructure;

public class WorkerInfraBuilder
{
    public Pulumi.Aws.Sqs.Queue SleepQueue { get; private set; }

    public WorkerInfraBuilder CreateSleepQueue()
    {
        SleepQueue = new Pulumi.Aws.Sqs.Queue("sleep-queue", new QueueArgs
        {
            ContentBasedDeduplication = false,
            FifoQueue = false
        });
        return this;
    }

    public WorkerInfraBuilder Build()
    {
        return this;
    }
}