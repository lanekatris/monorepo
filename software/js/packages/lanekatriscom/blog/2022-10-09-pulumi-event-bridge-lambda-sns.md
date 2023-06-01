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
      }
```


This is an example for API Gateway Api Key: https://www.pulumi.com/docs/guides/crosswalk/aws/api-gateway/#use-api-keys-to-limit-requests

New .NET 6 way to run a windows service: https://www.youtube.com/watch?v=aHC-4ivVDEQ&ab_channel=RobertsDevTalk

# Windows Service Notes
If you use environment variables, be sure to set at the SYSTEM level. This matters based on what user your service runs as.

Unless something breaks, (Event Viewer helps there) you need to view logs somewhere to know what your background app is doing: https://github.com/serilog/serilog-sinks-file

https://www.technipages.com/delete-services#:~:text=You%20can%20also%20remove%20services,%2C%20then%20press%20%E2%80%9CEnter%E2%80%9C.
run as admin
`sc delete Arbiter`

# No service, just run exe on startup
When you build the exe it listens on 5000
// dotnet publish -o publish -c Release -r win-x64 -p:PublishSingleFile=True  
// http://localhost:5000

Run on Startup
https://support.microsoft.com/en-us/windows/add-an-app-to-run-automatically-at-startup-in-windows-10-150da165-dcd9-7230-517b-cf3c295d89dd

# Issues

I knew I was going to have problems with putting everything in a monorepo. So I created everything and when I go to deploy via pulumi from within nx.dev
I get a cannot find module tslib...

So this nx.dev stuff has bitten me again. I think keeping everything in one typescript project may be best.

My thought is I'll just start everything from a pulumi TS folder to keep things simple since you should focus things on deploying and hosting them... not code organization which means NOTHING if it doesn't do anything.

As I try to make things "simple" like pure functions you run into issues of how does your application logic get config? Pulumi is for infrastructure. I guess I could set an environment variable...

Proxy integration doesn't work from the Pulumi example because their SDK versions didn't support API Keys because they use HTTP Api Gateway instead of REST.

# Paradigm Now

Going to revolve everything around pulumi

Or I could use serverless.yml for nice local development support... and use pulumi for all other infrastructure? - https://nishabe.medium.com/nestjs-serverless-lambda-aws-in-shortest-steps-e914300faed5 

# Commands
```
mkdir quickstart && cd quickstart && pulumi new aws-typescript

pulumi logs --follow
```

# Making Serverless Developer Experience Easier

If you subscribe to new events you need to know the format of said events so you can generate them with [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-generate-event.html) use [@types/aws-lambda](https://www.npmjs.com/package/@types/aws-lambda)
