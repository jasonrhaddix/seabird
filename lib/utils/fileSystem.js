const fs = require('fs')
const findUp = require('find-up');
const walkSync = require('walk-sync');

const { 
    APP_PACKAGE_FILE
} = require('../data/constants')

module.exports = {
    isEmptyDir: dir => {
        return fs.promises.readdir(dir).then(res => {
            return res.length === 0 || 
                   (res.length === 1 && res[0] === '.DS_Store')
        }).catch(err => {
            return err
        })
    },

    getRootPath: async () => {
        let path = await findUp(APP_PACKAGE_FILE)
        if (!path) return false
        return path.split('/').slice(0, -1).join('/') 
    },

    getMatchingPaths: async (key, dir) => {
        return await walkSync(dir, { globs: [`**/${key}/**/`] })
    },

    getPathAsObj: path => {
        let pathArr = path.split('/')
        return {
            path: pathArr.slice(0,-1).join('/'),
            file: pathArr[pathArr.length-1]
        }
    }
}

let _this = module.exports