const { Client } = require('pg')
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

export async function checkWaterLevel() : Promise<boolean> {
    const client = new Client({
        ssl:true
    });
    await client.connect();

    const sql = `select * from metric where created_timestamp::date = now()::date and sensor_type = 'float' and value = 0 order by id desc limit 1`;
    const {rows} = await client.query(sql)
    await client.end()

    return rows.length > 0;
}

export async function aquaAlerter() : Promise<void>{
    const isWaterLevelLow = await checkWaterLevel();
    if (!isWaterLevelLow) {
        console.log('Water level looks good, not doing anything')
        return
    }

    const client = new SNSClient({})
    const message = `Aquarium needs filled`
    const command = new PublishCommand({
        Message: message,
        Subject: message,
        TopicArn: 'arn:aws:sns:us-east-1:235680268517:NotifyMe'
    })
    const response = await client.send(command);
    console.log('response', response)
}
