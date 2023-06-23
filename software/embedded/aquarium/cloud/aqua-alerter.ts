const { Client } = require('pg')

// How do I use .env?
export async function aquaAlerter(){
    const client = new Client({
        ssl:true
    });
    await client.connect();
    
    const sql = `select * from metric where created_timestamp::date = now()::date and sensor_type = 'float' and value = 0 order by id desc limit 1`;
    const {rows} = await client.query(sql)
    await client.end()
    console.log('res', rows)
    
    if (rows.length > 0) {
        // alert somebody
    }
    
    return true;
}