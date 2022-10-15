# Event Bridge + Lambda + SNS Email


## What is the project?

I wanted to be notified when my Nvidia graphics driver was out of date. 



lambda + event bridge + lambda + sns email

for nodejs the api was this: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html

this guy had a nice example in python, it gave me specifically the subscribe to topic protocal being email and endpoint being an emal address: https://github.com/rodgtr1/pulumi-examples/blob/master/aws/python/lambda-sns/__main__.py
python guys' article: https://travis.media/pulumi-aws-create-lambda-sns/#20210908-project

needed this to set my runtime since 12 is depracated, i set to 16: https://www.pulumi.com/registry/packages/aws/api-docs/lambda/function/

this is the mac daddy article that showed me how to api gateway to event bridge and subscribe to eventbridge easy peasy: https://www.pulumi.com/blog/api-gateway-to-eventbridge/

my issue with api key
their examples do not use a REST api, they use the older one which i'm having trouble with the v1 api now
the v1 rest api forces me to define a route but i need to define integration... so chicken and the egg scenario


so it seems that I cannot have an http integration to event bridge AND have api key validation which requires REST
So I need to:
- lambda with api key validation
- publish to event bridge manually
- subscribe to event bridge events

Don't forget that your lambda needs to assume roles for AWS resources you need access to. i.e. Event Bridge, Dynamo, S3, etc...

This gives some nice sample data on what to post to Event Bridge. It was nice to see a `Source` example for a mobile application: https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html#API_PutEvents_ResponseSyntax


```json
 {
         "Source":"com.mycompany.myapp",
         "Detail":"{ \"key1\": \"value1\", \"key2\": \"value2\" }",
         "Resources":[
            "resource1",
            "resource2"
         ],
         "DetailType":"myDetailType"
      },
```


This is an example for API Gateway Api Key: https://www.pulumi.com/docs/guides/crosswalk/aws/api-gateway/#use-api-keys-to-limit-requests

New .NET 6 way to run a windows service: https://www.youtube.com/watch?v=aHC-4ivVDEQ&ab_channel=RobertsDevTalk

# Windows Service Notes
If you use environment variables, be sure to set at the SYSTEM level. This matters based on what user your service runs as.
