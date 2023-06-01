using Pulumi.Aws.Sns;

namespace infrastructure;

public class GeneralInfraBuilder
{
    public Topic EmailMeTopic { get; private set; }

    public GeneralInfraBuilder SetupEmailNotifications()
    {
        EmailMeTopic = new Pulumi.Aws.Sns.Topic("email-me", new TopicArgs
        {
            // This is critical to allow eventbridge to publish to SNS
            Policy =  @"{
                ""Version"": ""2012-10-17"",
                ""Statement"": [{
                    ""Effect"": ""Allow"",
                    ""Principal"": {
                            ""Service"": ""events.amazonaws.com""
                        },
                    ""Action"": [
                        ""sns:Publish""
                    ],
                    ""Resource"": ""arn:aws:sns:*:*:*""
                }]
            }"
        });
        
        var config = new Pulumi.Config();
        new Pulumi.Aws.Sns.TopicSubscription("email-me-subscription", new TopicSubscriptionArgs
        {
            Topic = EmailMeTopic.Arn,
            Protocol = "email",
            Endpoint = config.RequireSecret("MY_EMAIL")
        });

        return this;
    }

    public GeneralInfraBuilder Build()
    {
        return this;
    }
}