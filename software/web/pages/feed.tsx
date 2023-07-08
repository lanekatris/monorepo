import {differenceInSeconds} from "date-fns";
import {InferGetServerSidePropsType} from "next";
import {formatDate} from "@/pages/apps";
const { Client } = require('pg')

interface Event {
    id: number
    name: string
    eventTimestamp: string
    createdTimestamp: string
    data: any
}
interface DbEvent {
    id: number
    name: string
    event_timestamp: Date
    data: any
    version: number
    created_timestamp: Date
}

export async function getServerSideProps(): Promise<{props: {events: Event[]}}> {
    const client = new Client({
        ssl: true
    });
    await client.connect();

    const data = await client.query('SELECT * FROM events ORDER BY id desc');
    const rows = data.rows as DbEvent[];

    // console.log('res', rows)

    await client.end();
    return {
        props: {
events: rows.map(x => ({
    id: x.id,
    name: x.name,
    eventTimestamp: x.event_timestamp.toISOString(),
    createdTimestamp: x.created_timestamp.toISOString(),
    data: x.data
}))
            // jobs: rows.map((x: DbJob) => ({
            //     ...x, started: x.started.toISOString(), finished: x.finished?.toISOString() || null
            // }))
        }
    }
}

export default function FeedPage({events}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    // console.log(events)
    return (
        <div className="md:flex-grow">
            <h2 className="text-2xl font-medium text-gray-900 title-font mb-2 text-center mt-4">Events</h2>

            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                <tr>
                                    <th scope="col" className="px-6 py-4">ID</th>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    {/*<th scope="col" className="px-6 py-4">Finished</th>*/}
                                </tr>
                                </thead>
                                <tbody>
                                {events.map(event => <tr key={event.id} className="border-b dark:border-neutral-500">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{event.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{event.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {formatDate(event.eventTimestamp)}
                                        {/*<br />*/}
                                        {/*{formatDate(job.finished)}*/}
                                        {/*<br/>*/}
                                        {/*{differenceInSeconds(new Date(job.finished!), new Date(job.started))} seconds*/}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {event?.data?.message}
                                    </td>
                                </tr>)}


                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}