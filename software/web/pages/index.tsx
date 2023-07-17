import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/apps">Apps</Link>
        </li>
        <li>
          <Link href="/computer">Computer</Link>
        </li>
        <li>
          <Link href="/feed">Feed</Link>
        </li>
        <li>
          <Link href="/udisc-scorecard-upload">
Udisc Scorecard Upload
          </Link>
        </li>
      </ul>
    </main>
  )
}
