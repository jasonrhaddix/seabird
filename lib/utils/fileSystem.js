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

    // Current only accepts an array of keys
    getMatchingPaths: async (dir, keys) => {
        let pathsArr = []

        keys.forEach(async key => {
            let matches = await walkSync(dir, { globs: [`**/${key}/**/`] })
            matches = matches.sort((a,b) => a.length - b.length) || []
            
            pathsArr.push(matches )
        })

        return pathsArr
    },


    getPathAsObj: path => { 
        let pathArr = path.split('/')
        return {
            path: pathArr.slice(0,-1).join('/'),
            file: pathArr[pathArr.length-1]
        }
    },

    createPathString: pathArr => {
        let str = ''
        pathArr.forEach(dir => { if (dir) str += `/${_this.trimPathSlashes(dir)}` })
        return str
    },

    trimPathSlashes: path => path.replace(/^\/|\/+$/g, ''),
    toCamelCase: pathStr => {
        return pathStr.split('/').map(str => {
            let wordArr = str.split(/-|_/g)
            let capital = wordArr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase())
            return capital.join("")
        }).join('/')
    }
}

let _this = module.exports