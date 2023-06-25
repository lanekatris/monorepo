import {RawActivity} from "./rawActivity";
import axios from "axios";

interface GetActivitiesResult {
    aaData: RawActivity[]
}

export async function getActivities(startDate: string, endDate: string, cookies: string[]): Promise<RawActivity[]> {
    const url = `https://my.rhinofit.ca/datatables.php?method=getaccesstrackingobject&al_event=&start=${endDate}&end=${startDate}`
    console.log(`Getting data from url: ${url}`)

    // @ts-ignore
    const {data} = await axios.get<GetActivitiesResult>(url, {
        headers: {
            'Cookie': cookies.join('; ')
        }
    })

    console.log(`Found ${data.aaData.length} activities`)
    return data.aaData
}
