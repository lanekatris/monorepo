// const csv=require('csvtojson')
import csv from 'csvtojson'
// const groupBy = require('lodash.groupby')
import groupBy from 'lodash.groupby'
import {markdownTable} from 'markdown-table'


export interface RawUdiscScorecardEntry {
    PlayerName: string;
    CourseName: string;
    LayoutName: string;
    Date: string;
    Total: string;
    '+/-': string;
    Hole1: string;
    Hole2: string;
    Hole3: string;
    Hole4: string;
    Hole5: string;
    Hole6: string;
    Hole7: string;
    Hole8: string;
    Hole9: string;
    Hole10: string;
    Hole11: string;
    Hole12: string;
    Hole13: string;
    Hole14: string;
    Hole15: string;
    Hole16: string;
    Hole17: string;
    Hole18: string;
    Hole19: string;
    Hole20: string;
    Hole21: string;
    Hole22: string;
    Hole23: string;
    Hole24: string;
    Hole25: string;
    Hole26: string;
    Hole27: string;
    Hole28: string;
}

// course name, date, who i played with, how i scored

interface Scorecard {
    courseName: string;
    date: string;
    players: string[];
    myScore: string;
}

const excludes = ['2022-10-15 14:50']

export async function parseScorecard(csvData: string): Promise<Scorecard[]> {
    const parsed: RawUdiscScorecardEntry[] = await csv().fromString(csvData)
    const grouped: {string: RawUdiscScorecardEntry[]} = groupBy(parsed, 'Date')
    // console.log(grouped)
    // return grouped
    // return parsed;

    return Object.keys(grouped).filter(x => !excludes.includes(x)).map(date => {
        // @ts-ignore
        const from: RawUdiscScorecardEntry[] = grouped[date]
        const me = from.find(x => x.PlayerName.includes('Lane'))
        if (!me) throw new Error(`Lane player not found: ${date}` )

        return {
            courseName: from[0].CourseName,
            date: from[0].Date,
            players: from.filter(x => x.PlayerName !== 'Par').map(f => f.PlayerName),
            myScore: me['+/-']!
        }

    })
}

export function generateScorecardMarkdown(scorecards: Scorecard[]): string {
    return markdownTable([
        ['Date', 'Course', 'Score', 'Players'],
        ...scorecards.map(({courseName, date, myScore, players}) => [date,courseName,myScore,players.join(', ')])
    ])
    // return scorecards.map(x => `* ${x.courseName} (${x.date}) - ${x.players.join(', ')} - ${x.myScore}`).join('\n')
}