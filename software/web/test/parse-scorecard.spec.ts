import {parseScorecard} from "@/lib/parse-scorecard";

describe('dg', () => {
    describe('scorecard', () => {
        it('should return a scorecard', () => {
            expect(parseScorecard()).toBe(1)
        })
    })
})