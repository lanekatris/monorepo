import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as path from 'path';
import { gravemind } from '@js/gravemind';

// This is the path to the other project relative to the CWD
const projectRoot = '../poc';

const result = gravemind();
