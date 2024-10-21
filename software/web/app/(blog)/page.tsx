import Link from 'next/link';
import { HomeLinksV2 } from '../Links';

export default async function Homev2Page() {
  return (
    <main>
      <p>
        Hi! I&apos;m <Link href={'/about'}>Lane Katris</Link>, a senior full
        stack software engineer at{' '}
        <Link href={'https://www.linkedin.com/company/hd-supply'}>
          HD Supply
        </Link>
        .
      </p>
      <p>
        I'm married, have a son, and am a big fan of{' '}
        <Link href={'/discs'}>Disc Golf</Link> and Rock Climbing.
      </p>
      <h2 className={''}>Pages</h2>
      <p>Here are a few links to start with:</p>
      <HomeLinksV2 />
      <h2 className={''}>Projects</h2>
      <p>I have a ton of unfinished projects...</p>
      <ul>
        <li>
          <Link href={'https://climb.rest'}>Climb.rest</Link>
        </li>
        <li>
          <Link href={'/homelab'}>Homelab Setup</Link>
        </li>
      </ul>
    </main>
  );
}
