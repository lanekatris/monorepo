const { Client } = require('pg')


export interface AquaHandlerProps {
   
        
            sensors: {
                float: number,
                temperature: number
            },
            device?: {
                client: string,
                uptime: number,
                firmware: string
                hardware: string
            }
        
    
}

// todo: create flyscripts for this
export async function aquaHandler(props: AquaHandlerProps): Promise<{ success: boolean }>{
    console.log('aqua listener!', props)
    const client = new Client({
        ssl:true
    });
    await client.connect();

    const sql = 'insert into metric (value, sensor_type) values ($1::numeric, $2::text)';
    const res = await client.query(sql, [props.sensors.float, 'float'])
    const res2 = await client.query(sql, [props.sensors.temperature, 'temperature'])
    await client.end();
    console.log('res', res.rowCount, res2.rowCount)

    return{success: true}
}