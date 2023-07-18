import {generateScorecardMarkdown, parseScorecard} from "@/lib/parse-scorecard";
import fs from 'fs'
import {join} from "path";

describe('dg', () => {
    describe('scorecard', () => {
        it('parse successfully', async () => {
            const body = fs.readFileSync(join(__dirname, 'scorecards.csv')).toString();
            // console.log(body)
            // add csv file
            const result = await parseScorecard(body)
            const md = generateScorecardMarkdown(result)
            console.log(md)
            expect(result).toBeNull()
        })
    })
})