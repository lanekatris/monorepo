import yaml from 'js-yaml';
import { getFromMinio } from '../../../feed/get-from-minio';

interface DockerComposeFile {
  services: { [k: string]: { ports?: string[] } };
}

const urls = [
  'https://raw.githubusercontent.com/lanekatris/monorepo/refs/heads/main/infrastructure/homelab/docker-compose.yml',
  'https://raw.githubusercontent.com/lanekatris/monorepo/refs/heads/main/infrastructure/homelab/docker-compose.miniflux.yml',
  'https://raw.githubusercontent.com/lanekatris/monorepo/refs/heads/main/infrastructure/homelab/docker-compose.n8n.yml',
  'https://raw.githubusercontent.com/lanekatris/monorepo/refs/heads/main/infrastructure/homelab/immich/docker-compose.yml',
  'https://raw.githubusercontent.com/lanekatris/monorepo/refs/heads/main/infrastructure/homelab/windmill/docker-compose.yml'
];

export default async function HomelabPage() {
  const files = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      const contents = await response.text();
      const json = (await yaml.load(contents)) as DockerComposeFile;

      return {
        url,
        fileName: url.split('/').slice(-2).join('/'),
        fileContents: json
      };
    })
  );

  const machines = await Promise.all([
    getFromMinio<string>('etl', 'linux_desktop_screenfetch_result.txt', false),
    getFromMinio<string>('scratch', 'server1_screenfetch_result.txt', false)
  ]);

  return (
    <main>
      <h1>My Homelab</h1>
      <p>
        This page sucks in my homelab docker-compose files and creates easy
        links to navigate to them if they expose any ports.
      </p>
      {files.map((file) => (
        <div key={file.url}>
          <a target={'_blank'} href={file.url}>
            <h3>{file.fileName}</h3>
          </a>

          {Object.keys(file.fileContents.services)
            .filter((name) => file.fileContents.services[name].ports)
            .map((name) => (
              <dd key={name}>
                <b>{name}</b>
                <ul>
                  {/*{!file.fileContents.services[name].ports && (*/}
                  {/*  <div className={'bg-attention'}>No Exposed Ports</div>*/}
                  {/*)}*/}
                  {file.fileContents.services[name].ports?.map((port) => (
                    <li
                      key={`${name}-${port}`}
                      style={{ display: 'flex', gap: '.5em' }}
                    >
                      <div className={'bg-accent'}>{port}</div>
                      <b>|</b>
                      <a
                        target={'_blank'}
                        href={`http://server1.local:${port.split(':')[0]}`}
                      >
                        DNS
                      </a>
                      <a
                        target={'_blank'}
                        href={`http://192.168.86.100:${port.split(':')[0]}`}
                      >
                        IP
                      </a>
                      <a
                        target={'_blank'}
                        href={`http://100.99.14.109:${port.split(':')[0]}`}
                      >
                        Tailscale
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            ))}
        </div>
      ))}

      <h1>My Machines</h1>
      <div className={'flash accent'}>
        I have a Temporal schedule that runs <code>screenfetch -N</code> every
        week that writes to Minio and this page requests the files from Minio
        and renders the results here.
      </div>
      <div className="flash accent">
        I didn't go with <code>neofetch</code> because of unicode characters.
      </div>
      {machines.map((serverInfo, i) => (
        <div key={i}>
          <small className={'muted'}>
            Last Updated: {serverInfo.stats.lastModified.toLocaleDateString()}:
          </small>
          <pre>{serverInfo.data}</pre>
        </div>
      ))}
    </main>
  );
}
