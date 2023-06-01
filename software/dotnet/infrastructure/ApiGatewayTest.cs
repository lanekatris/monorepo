using Pulumi;
using Pulumi.Aws.ApiGateway;
using Pulumi.Aws.ApiGateway.Inputs;
using Pulumi.Aws.ApiGatewayV2;
using Pulumi.Aws.Iam;
using Pulumi.Aws.Lambda;
using Pulumi.Aws.Lambda.Inputs;
using Integration = Pulumi.Aws.ApiGatewayV2.Integration;
using IntegrationArgs = Pulumi.Aws.ApiGatewayV2.IntegrationArgs;

namespace infrastructure;

public class GraphqlApi
{
    public GraphqlApi()
    {
        var lambdaRole = new Role("api-gateway-lambda-role", new RoleArgs
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
}",
        });

        var lambdaPolicyAttachment = new PolicyAttachment("api-gateway-policy-attchment", new PolicyAttachmentArgs()
        {
            Roles = {lambdaRole.Name},
            PolicyArn = ManagedPolicy.AWSLambdaBasicExecutionRole.ToString()
        });

        var config = new Pulumi.Config();

        var lambda = new Function("graphql", new FunctionArgs
        {
            Runtime = Runtime.Dotnet6,
            Code = new FileArchive("../Web/bin/Debug/net6.0"),
            Handler = "bootstrap",
            Timeout = 30,
            Role = lambdaRole.Arn,
            MemorySize = 512,
            Environment = new FunctionEnvironmentArgs()
            {
                Variables = new InputMap<string>()
                {
                    {"EVERYTHING_DB_CONN", config.RequireSecret("EVERYTHING_DB_CONN")},
                    {"LKAT_DB", config.RequireSecret("LKAT_DB")}
                }
            }
        });

        // var idk = new Pulumi.Aws.ApiGateway.RestApi("graphql-api-gateway");
        var httpApiGateway = new Pulumi.Aws.ApiGatewayV2.Api("graphql-api-gateway", new ApiArgs()
        {
            ProtocolType = "HTTP",
            RouteSelectionExpression = "${request.method} ${request.path}",
            
        });

        var gatewayLambdaIntegration = new Integration("graphql-integration", new IntegrationArgs()
        {
            ApiId = httpApiGateway.Id,
            IntegrationType = "AWS_PROXY",
            IntegrationMethod = "POST",
            IntegrationUri = lambda.Arn,
            PayloadFormatVersion = "2.0",
            TimeoutMilliseconds = 1000 * 30
        });

        var apiGatewayRoute = new Route("graphqlroute", new RouteArgs()
        {
            ApiId = httpApiGateway.Id,
            RouteKey = "$default",
            Target = gatewayLambdaIntegration.Id.Apply(x => $"integrations/{x}"),
            
        });

        var stage = new Pulumi.Aws.ApiGatewayV2.Stage("graphql-stage", new Pulumi.Aws.ApiGatewayV2.StageArgs
        {
            ApiId = httpApiGateway.Id,
            AutoDeploy = true,
            Name = "$default",
            
        });
        var lambdaPermissionsForApiGateway = new Permission("graphql-permissionsgateway", new PermissionArgs()
        {
            Action = "lambda:InvokeFunction",
            Function = lambda.Name,
            Principal = "apigateway.amazonaws.com",
            SourceArn = Output.Format($"{httpApiGateway.ExecutionArn}/*")
        });

        //error creating API Gateway Usage Plan: BadRequestException: Usage plans are not allowed for HTTP Apis
        var apiKey = new Pulumi.Aws.ApiGateway.ApiKey("graphql-api-key");
        var usagePlan = new UsagePlan("graphql-api-key", new UsagePlanArgs()
        {
            ApiStages = new []
            {
                new UsagePlanApiStageArgs
                {
                    ApiId = httpApiGateway.Id,
                    Stage = "idk"
                }
            }
        });
        var usagePlanKey = new UsagePlanKey("graphql-usageplan", new()
        {
            KeyId = apiKey.Id,
            KeyType = "API_KEY",
            UsagePlanId = usagePlan.Id
        });

    }
}