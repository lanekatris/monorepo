import Link from 'next/link';

export default function Navigation() {
  return (
    <>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/location-history">Location History</Link>
        </li>
        <li>
          <Link href="/discs">Discs</Link>
        </li>
      </ul>

      <hr />
    </>
  );
}
