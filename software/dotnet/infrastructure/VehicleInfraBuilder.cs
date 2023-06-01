using System.Collections.Generic;
using LambdaEmptyServerless1;
using Newtonsoft.Json;
using Pulumi;
using Pulumi.Aws.CloudWatch;
using Pulumi.Aws.Iam;
using Pulumi.Aws.Lambda;
using Pulumi.Aws.Lambda.Inputs;

namespace infrastructure;

public class VehicleInfraBuilder
{
    public Function Lambda { get; private set; }
    
    private Role CreateLambdaRole()
    {
        var lambdaRole = new Role("lambdaRole", new RoleArgs
        {
            AssumeRolePolicy =
                @"{
                ""Version"": ""2012-10-17"",
                ""Statement"": [
                    {
                        ""Action"": ""sts:AssumeRole"",
                        ""Principal"": {
                            ""Service"": ""lambda.amazonaws.com""
                        },
                        ""Effect"": ""Allow"",
                        ""Sid"": """"
                    }
                ]
            }"
        });

        var logPolicy = new RolePolicy("lambdaLogPolicy", new RolePolicyArgs
        {
            Role = lambdaRole.Id,
            Policy =
                @"{
                ""Version"": ""2012-10-17"",
                ""Statement"": [{
                    ""Effect"": ""Allow"",
                    ""Action"": [
                        ""logs:CreateLogGroup"",
                        ""logs:CreateLogStream"",
                        ""logs:PutLogEvents""
                    ],
                    ""Resource"": ""arn:aws:logs:*:*:*""
                }]
            }"
        });
      
        var eventBridgePolicy = new RolePolicy("eventBridgePolicy", new RolePolicyArgs
        {
            Role = lambdaRole.Id,
            Policy =
                @"{
                ""Version"": ""2012-10-17"",
                ""Statement"": [{
                    ""Effect"": ""Allow"",
                    ""Action"": [
                        ""events:PutEvents""
                    ],
                    ""Resource"": ""arn:aws:events:*:*:*""
                }]
            }"
        });

        return lambdaRole;
    }
    
    public VehicleInfraBuilder CreateFunction()
    {
        var config = new Pulumi.Config();
       
        this.Lambda = new Function("drive-vehicle-notifier", new FunctionArgs
        {
            Runtime = Runtime.Dotnet6,
            Code = new FileArchive("../LambdaEmptyServerless1/src/LambdaEmptyServerless1/bin/Debug/net6.0"),
            Handler = "LambdaEmptyServerless1::LambdaEmptyServerless1.Functions::DriveVehicleReminder",
            Role = CreateLambdaRole().Arn,
            Timeout = 30,
            MemorySize = 512,
            Environment = new FunctionEnvironmentArgs
            {
                Variables =
                {
                    {"EVERYTHING_DB_CONN", config.RequireSecret("EVERYTHING_DB_CONN")}
                }
            },
         
        });

        return this;
    }

    public VehicleInfraBuilder ScheduleFunction()
    {
        var schedule = new Pulumi.Aws.CloudWatch.EventRule("schedule-drive", new EventRuleArgs
        {
            EventBusName = "default",
            ScheduleExpression = "rate(7 days)",
        });

        new Pulumi.Aws.CloudWatch.EventTarget("schedule-drive-target", new EventTargetArgs()
        {
            Arn = Lambda.Arn,
            Rule = schedule.Name,
            EventBusName = "default"
        });

        new Pulumi.Aws.Lambda.Permission("event-bridge-tovehicle", new PermissionArgs
        {
            Action = "lambda:InvokeFunction",
            Principal = "events.amazonaws.com",
            Function = Lambda.Arn,
            SourceArn = schedule.Arn
        });

        return this;
    }

    public VehicleInfraBuilder SubscribeViaEmail(Output<string> emailMeTopicArn)
    {
        var vehicleNeedsDrivenRule = new Pulumi.Aws.CloudWatch.EventRule("vehicle-needs-driven-rule", new EventRuleArgs
        {
            EventBusName = "default",
            EventPattern = JsonConvert.SerializeObject(new
            {
                source = new List<string> {nameof(Functions.DriveVehicleReminder)}
            })
        });

        var idk = new Pulumi.Aws.CloudWatch.EventTarget("vehicle-needs-driven-target", new EventTargetArgs
        {
            Arn = emailMeTopicArn,
            Rule = vehicleNeedsDrivenRule.Name,
            EventBusName = "default"
        });

        return this;
    }

    public VehicleInfraBuilder Build()
    {
        return this;
    }
}