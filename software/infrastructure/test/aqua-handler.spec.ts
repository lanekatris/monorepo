import { aquaHandler } from "../aqua-handler"

describe('Aqua', () => {
    describe('happy path', () => {
        it('should do something', async () => {
            // assert.equal([1, 2, 3].indexOf(4), -1);
            await aquaHandler({state:{reported:{sensors:{float: 1, temperature: 55.66}}}})
        })
    })
})