import Link from 'next/link';
import { getRecentTemporalWorkflows } from '../../lib/getRecentTemporalWorkflows';
import { GiAquarium } from 'react-icons/gi';
import { getAquariumTemp } from '../../lib/getAquariumTemp';

export default async function Homev2Page() {
  const workflows = await getRecentTemporalWorkflows();
  const { temperatureF, lastUpdated } = await getAquariumTemp();

  return (
    <main>
      <p>
        Hi! I&apos;m <Link href={'/about'}>Lane Katris</Link>. This is my
        dynamic NextJS site.
        <br />
        <br />
        It doesn&apos;t have a whole lot publicly. You may want to head over to
        my blog which will have more public content:{' '}
        <Link href={'https://lanekatris.com'}>lanekatris.com</Link>.
      </p>
      <h2>Stats</h2>
      <p className={'flash default'}>
        <GiAquarium size={'2em'} style={{ verticalAlign: 'bottom' }} /> Aquarium
        Temperature:{'  '}
        <var>{Math.round(temperatureF)}°F</var> <br />
        <small className={'smaller'}>
          Updated: {lastUpdated.toLocaleDateString()}{' '}
          {lastUpdated.toLocaleTimeString()}
        </small>
      </p>
      <h2>
        Temporal History{' - '}
        <a href="http://server1.local:8055/namespaces/default/workflows">UI</a>
      </h2>
      <table>
        <thead>
          <tr>
            <td>Status</td>
            <td>Workflow ID</td>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.runId}>
              <td>
                <var>{workflow.status.name}</var>
              </td>
              <td>{workflow.workflowId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
