import * as aws from '@pulumi/aws';

export function createRole(): aws.iam.Role {
  const role = new aws.iam.Role('gym-syncer-role', {
    assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
`,
  });

  // Enable logs to be created by the cloud function
  const policy = new aws.iam.Policy('gym-syncer-policy', {
    description: ' a test policy',
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
        },
      ],
    }),
  });

  new aws.iam.RolePolicyAttachment('gym-syncer-attachment', {
    role: role.name,
    policyArn: policy.arn,
  });

  return role;
}
