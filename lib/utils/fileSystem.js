const fs = require('fs')
const walkSync = require('walk-sync');

module.exports = {
    isEmptyDir: dir => {
        return fs.promises.readdir(dir).then(res => {
            return res.length === 0 || 
                   (res.length === 1 && res[0] === '.DS_Store')
        }).catch(err => {
            return err
        })
    },

    getMatchingPaths: async (key, dir) => {
        return await walkSync(dir, { globs: [`**/${key}/**/`] })
    },

    vuexRouter: {
        getPathToRouter: () => {

            return 
        }
    }
}

let _this = module.exports