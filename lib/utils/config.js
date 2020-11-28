const fs = require('fs')
const fsExtra = require('fs-extra')
const ejs = require('ejs')
const _get = require('lodash.get')

const { getRootPath } = require('./fileSystem')

const { 
    APP_CONFIG_FILE
} = require('../data/constants')

module.exports = {
    generateConfig: async (targetDir) => {
        const rootDir = await getRootPath()
        
        let dir = targetDir || rootDir
        let configDir = `${dir}/${APP_CONFIG_FILE}`
        if (!dir) return false

        let data = { rootDir: dir }
        let templateStr = await ejs.renderFile(`${__dirname}/..//templates/config.ejs`, data, {})

        fsExtra.outputFileSync(configDir, templateStr, err => {
            if (err) {
                console.log(err)
                return
            }  
        })

        let configExists = await fs.existsSync(configDir)
        if (configExists) console.log('Config file generated')
    },

    read: async data => {
        const rootDir = await getRootPath()
        if (!rootDir) return false

        let configPath = `${rootDir}/${APP_CONFIG_FILE}`
        let configExists = await fs.existsSync(configPath)

        if (!configExists) return false

        let configFile = require(configPath)
        return _get(configFile, data) || null
    },

    write: async data => {
        /* Write to config */
    }
}

let _this = module.exports