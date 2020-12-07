const fs = require('fs')
// const fsExtra = require('fs-extra')
const findUp = require('find-up')
const walkSync = require('walk-sync')

const { 
    APP_FILE__PACKAGE
} = require('../data/constants');
const { dir } = require('console');

module.exports = {
    isEmptyDir: dir => {
        let targetDir = dir || __dirname
        return fs.promises.readdir(targetDir).then(res => {
            return res.length === 0 || 
                   (res.length === 1 && res[0] === '.DS_Store')
        }).catch(err => {
            return err
        })
    },

    createDirectories: (dirArr, rootDir) => {
        return new Promise((resolve, reject) => {
            dirArr.forEach(dir => {
                console.log(`${rootDir}/${dir}/`)
                
                fs.mkdirSync(`${rootDir}/${dir}/`, err => {
                    if (err) reject()
                })
            })

            resolve()
        })
    },

    getRootPath: async () => {
        let path = await findUp(APP_FILE__PACKAGE)
        if (!path) return false
        return path.split('/').slice(0, -1).join('/') 
    },

    // Current only accepts an array of key
    getMatchingPaths: async (dir, keys, index=null) => {
        let matchingPaths = keys.map(async key => {
            let matches = await walkSync(dir, { globs: [`**/${key}/**/`] })
            
            if (matches.length === 0) return null
            // if (trimSlashes) matches = matches.map(match => match.replace(/^\/|\/$/g, ''))

            // return index !== null ? matches[index] || matches[0] : matches
            return matches[0]
        })

        // return first match - for now
        return index !== null ? matchingPaths[index] || matchingPaths[0] : matchingPaths
    },

    getPathAsObj: path => { 
        let pathArr = path.split('/')
        return {
            path: pathArr.slice(0,-1).join('/'),
            file: pathArr[pathArr.length-1]
        }
    },

    trimPathSlashes: path => path.replace(/^\/|\/+$/g, '')
}

let _this = module.exports