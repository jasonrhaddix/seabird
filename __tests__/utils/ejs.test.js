const { dataHasReservedKeywords } = require('../../lib/utils/ejs')

describe('Tests ejs utilities', () => {

    it('tests EJS data object has reserved keywords', async () => {
        let hasReservedKeywords = await dataHasReservedKeywords({ import: false })
        expect(hasReservedKeywords).toBeTruthy()
    })

    it('tests EJS data object does not have reserved keywords', async () => {
        let hasReservedKeywords = await dataHasReservedKeywords({ test: false })
        expect(hasReservedKeywords).toBeFalsy()
    })
})