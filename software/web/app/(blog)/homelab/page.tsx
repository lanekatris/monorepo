import yaml from 'js-yaml';

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

  return (
    <main>
      <h1>My Homelab</h1>
      {files.map((file) => (
        <div key={file.url}>
          <a target={'_blank'} href={file.url}>
            <h3>{file.fileName}</h3>
          </a>

          {Object.keys(file.fileContents.services).map((name) => (
            <dd key={name}>
              <b>{name}</b>
              <ul>
                {!file.fileContents.services[name].ports && (
                  <div className={'bg-attention'}>No Exposed Ports</div>
                )}
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
    </main>
  );
}
