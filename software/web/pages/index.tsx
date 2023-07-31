import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
const { Client } = require('pg')

interface Result {
  visited: boolean
  count: string
}

export async function getServerSideProps(): Promise<{props: {dg: number}}> {

  const client = new Client({
    ssl: true
  });
  await client.connect();


  const {rows}: {rows: Result[]} = await client.query(`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023'
           group by visited
  `)

  await client.end();


  const total = rows.reduce((acc, cur) => acc + Number(cur.count), 0);
  const completed = rows.filter(x => x.visited).reduce((acc, cur) => acc + Number(cur.count), 0);
  return {props:{
    dg: completed / total * 100,
    }}
}



export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

      <hr />

      <h3>Top 100 Disc Golf Course Completion: <mark>{props.dg}%</mark></h3>
    </main>
  )
}
