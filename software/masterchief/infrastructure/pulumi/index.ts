import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import { createRole } from './role';

const image = awsx.ecr.buildAndPushImage('gym-syncer', {
  context: '../..',
  dockerfile: '../../Dockerfile.gym-syncer',
});

const role = createRole();

const gymSyncer = new aws.lambda.Function('gym-syncer', {
  packageType: 'Image',
  imageUri: image.imageValue,
  role: role.arn,
  timeout: 30,
});

aws.cloudwatch.onSchedule('run-gym-syncer', 'rate(15 minutes)', gymSyncer);
