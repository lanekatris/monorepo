import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {aquaHandler} from './aqua-handler'
import {aquaAlerter} from './aqua-alerter'

const config = new pulumi.Config();

const policy = new aws.iot.Policy("aqua-policy", {
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: ["iot:*"],
                Effect: "Allow",
                Resource: "*",
            },
        ],
    }),
});

const thing = new aws.iot.Thing("aqua-thing");
export const thingName = thing.name

const cert = new aws.iot.Certificate("aqua-cert", {active: true});

const thingAttachment = new aws.iot.ThingPrincipalAttachment("aqua-principal", {
    principal: cert.arn,
    thing: thing.name,
});

const certAttachment = new aws.iot.PolicyAttachment("aqua-cert-principal", {
    policy: policy.name,
    target: cert.arn,
});

export const privateKey = cert.privateKey;
export const publicKey = cert.publicKey;
export const endpoint = aws.iot.getEndpointOutput();
export const certificatePem = cert.certificatePem;

const postgresVariables = {
    PGUSER: config.requireSecret('pgUser'),
    PGHOST: config.requireSecret('pgHost'),
    PGPASSWORD: config.requireSecret('pgPassword'),
    PGDATABASE: config.requireSecret('pgDatabase'),
    PGPORT: config.requireSecret('pgPort')
}

const aquaLambda = new aws.lambda.CallbackFunction('aqua-listener', {
    policies: [
        aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
        aws.iam.ManagedPolicies.AWSIoTFullAccess
    ],
    callback: aquaHandler,
    environment: {
        variables: postgresVariables

    }
})

const rule = new aws.iot.TopicRule('aquarule', {
    description: 'Listen for sensor data and persist',
    enabled: true,
    sql: thing.name.apply(name => `SELECT * FROM '$aws/things/${name}/testies'`),
    sqlVersion: '2016-03-23',
    lambda: {
        functionArn: aquaLambda.arn
    }
})

const lambdaPermission = new aws.lambda.Permission('aqua-iot-permission', {
    action: 'lambda:InvokeFunction',
    'function': aquaLambda.arn,
    principal: 'iot.amazonaws.com',
    sourceArn: rule.arn
})

const aquaAlerterLambda = new aws.lambda.CallbackFunction('aqua-water-level-alerter', {
    policies: [
        aws.iam.ManagedPolicies.AmazonSNSFullAccess
    ],
    callback: aquaAlerter,
    environment: {
        variables: postgresVariables
    }
})

aws.cloudwatch.onSchedule('aquaWaterLevelLowAlerter', "cron(0 5 * * ? *)", aquaAlerterLambda)
