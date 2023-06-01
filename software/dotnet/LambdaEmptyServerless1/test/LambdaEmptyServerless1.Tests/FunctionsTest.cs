using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.CloudWatchEvents;


namespace LambdaEmptyServerless1.Tests;

public class FunctionTest
{
    public FunctionTest()
    {
    }

    // [Fact]
    // public void TestGetMethod()
    // {
    //     TestLambdaContext context;
    //     APIGatewayProxyRequest request;
    //     string response;
    //
    //     Functions functions = new Functions();
    //
    //
    //     request = new APIGatewayProxyRequest();
    //     context = new TestLambdaContext();
    //     response = functions.Get("hi", context);
    //     // Assert.Equal(200, response.StatusCode);
    //     // Assert.Equal("Hello AWS Serverless", response.Body);
    //     Assert.Equal("HI", response);
    // }

    [Fact]
    public async Task DriveVehicleReminderTest()
    {
        var f = new Functions();
        // var k = 
        var result = await f.DriveVehicleReminder(new CloudWatchEvent<Empty>(), new TestLambdaContext());
        
    }
}