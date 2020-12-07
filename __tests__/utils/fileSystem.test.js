const { isEmptyDir, getRootPath, getMatchingPaths, getPathAsObj } = require('../../lib/utils/fileSystem')

describe('Tests filesystem utilities', () => {

    it('tests that the directory is empty', async () => {
        let emptyDir = await isEmptyDir('__mocks__/directories/emptyDir')
        expect(emptyDir).toBeTruthy()
    })

    it('tests that the directory is NOT empty', async () => {
        let nonEmptyDir = await isEmptyDir('__mocks__/directories/nonEmptyDir')
        expect(nonEmptyDir).toBeFalsy()
    })

    it('tests that the root path of package is `seabird`', async () => {
        let rootPath = await getRootPath(__dirname)
        let dir = rootPath.split('/')
        expect(dir[dir.length-1]).toMatch('seabird')
    })

    it('tests matching paths are returned as array', async () => {
        let matchingPaths = await getMatchingPaths('__mocks__/directories', 'nonEmptyDir')
        expect(matchingPaths).toBeArray()
    })

    it('tests that path is converted into path/file object', () => {
        let pathObj = getPathAsObj('test/subdir/fileName')
        expect(pathObj).toMatchObject({path: expect.any(String), file: expect.any(String)})
    })
    
})