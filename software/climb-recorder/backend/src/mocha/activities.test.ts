import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
import { findStagedFiles } from '../findStagedFiles';

describe('greet activity', async () => {
  it('successfully greets the user', async () => {
    const env = new MockActivityEnvironment();
    const name = 'Temporal';
    const result = await env.run(activities.greet, name);
    assert.equal(result, 'Hello, Temporal!');
  });
});

describe('findStagedFiles activity', async () => {
  it('idk', async () => {
    const env = new MockActivityEnvironment();
    await env.run(findStagedFiles);
  });
});
