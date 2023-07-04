const { Client } = require('pg')

interface DbJob {
    id: number
    name: string
    started: Date
    finished: Date
}

export async function startJob(appName: string = 'Rhinofit Recent Users'): Promise<DbJob> {
    console.log('Starting job...')
    const client = new Client({
        ssl: true
    });
    await client.connect();
    const result = await client.query('INSERT INTO job (name) VALUES ($1) RETURNING *', [appName]);
    await client.end();
    console.log(`Job ${result.rows[0].id} started.`)
    return result.rows[0];
}

export async function finishJob(id: number): Promise<void> {
    console.log('Finishing job...')
    const client = new Client({
        ssl: true
    });
    await client.connect();
    await client.query('update job set finished = now() where id = $1', [id])
    await client.end();
    console.log(`Job ${id} finished.`)
}
