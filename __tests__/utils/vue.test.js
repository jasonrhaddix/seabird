const { checkVueCLI, createVueApp } = require('../../lib/utils/vue')

describe('Tests vue utilities', () => {

    it('tests Vue CLI is/is not installed on client machine', async () => {
        let hasVueCLI = await checkVueCLI()
        expect(hasVueCLI).toBeBoolean()
    })
})