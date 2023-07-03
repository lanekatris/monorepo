import {addDays, format} from 'date-fns'
import 'dotenv/config'
import {login} from "./login";
import {getNameFromActivity} from "./getNameFromActivity";
import {namesToMarkdown} from "./namesToMarkdown";
import {getActivities} from "./getActivities";
import fs from 'fs'
import {finishJob, startJob} from "./jobs";

(async () => {

    const job = await startJob();

    const cookies = await login()

    const startDate = format(new Date(), 'yyyy-MM-dd')
    const weekAgo = addDays(new Date(), -7)
    const endDate = format(weekAgo, 'yyyy-MM-dd')
    const activities = await getActivities(startDate, endDate, cookies)

    const names = Array.from(new Set(activities.map(getNameFromActivity)))
    names.sort();
    console.log(`Unique users: ${names.length}`)

    const filePath = '/home/lane/Documents/lkat-vault/Recent Gym Users.md'
    const markdown = namesToMarkdown(names)
    fs.writeFileSync(filePath, markdown)
    console.log('Wrote file', filePath)
    await finishJob(job.id)
})()
