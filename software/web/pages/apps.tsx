import {InferGetServerSidePropsType} from "next";
import {differenceInSeconds} from 'date-fns'

const { Client } = require('pg')

interface DbJob {
    id: number
    name: string
    started: Date
    finished: Date
}

interface Job {
    id: number
    name: string
    started: string
    finished: string | null
}

export async function getServerSideProps(): Promise<{props: {jobs: Job[]}}> {
    const client = new Client({
        ssl: true
    });
    await client.connect();

    const data = await client.query('SELECT * FROM job ORDER BY id desc');
    const rows = data.rows as DbJob[];

    console.log('res', rows)

    await client.end();
    return {
        props: {

            jobs: rows.map((x: DbJob) => ({
                ...x, started: x.started.toISOString(), finished: x.finished?.toISOString() || null
            }))
        }
    }
}

export function formatDate(date: string | null) {
    if (!date) return 'n/a'
    const d = new Date(date)
    return d.toLocaleDateString('en-us') + ' ' + d.toLocaleTimeString('en-us')
}

export default function AppsPage({jobs}:InferGetServerSidePropsType<typeof getServerSideProps>){
    console.log('client jobs', jobs)
    return <div className="md:flex-grow">
        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2 text-center mt-4">Job History</h2>

        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500">
                            <tr>
                                <th scope="col" className="px-6 py-4">ID</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Started</th>
                                {/*<th scope="col" className="px-6 py-4">Finished</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {jobs.map(job => <tr key={job.id} className="border-b dark:border-neutral-500">
                                <td className="whitespace-nowrap px-6 py-4 font-medium">{job.id}</td>
                                <td className="whitespace-nowrap px-6 py-4">{job.name}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {formatDate(job.started)}
                                    <br />
                                    {formatDate(job.finished)}
                                    <br/>
                                    {differenceInSeconds(new Date(job.finished!), new Date(job.started))} seconds
                                </td>
                            </tr>)}


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </div>

}