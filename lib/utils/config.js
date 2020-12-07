const fs = require('fs')
const fsExtra = require('fs-extra')
const ejs = require('ejs')
const _get = require('lodash.get')

const templateData = require('../data/templateData')
const messages = require('../messages')

const { getRootPath } = require('./fileSystem')

const { 
    APP_FILE__PACKAGE,
    APP_FILE__CONFIG
} = require('../data/constants')

module.exports = {
    generateConfig: async targetDir => {
        const ROOT_DIR = await getRootPath()
        let generateConfigMessage = messages.generatingConfig()
        generateConfigMessage.start()
        
        let dir = targetDir || ROOT_DIR
        let configDir = `${dir}/${APP_FILE__CONFIG}`
        
        if (!dir) {
            generateConfigMessage.fail('Cannot create config')
            messages.seabirdUsesFile(APP_FILE__PACKAGE, 'root/')
            return false
        }

        let data = {
            vueComponentFileType: templateData.vue.component.fileType,
            vueComponentData: templateData.vue.component.data,

            vuexModuleFileType: templateData.vuex.module.fileType,
            vuexModuleData: templateData.vuex.module.data,
            vuexActionData: templateData.vuex.action.data,
            
            routerModuleFileType: templateData.router.module.fileType,
            routerModuleData: templateData.router.module.data,
            routerActionData: templateData.router.action.data,
        }

        let templateStr = await ejs.renderFile(`${__dirname}/..//templates/config.ejs`, data, {})
        fsExtra.outputFileSync(configDir, templateStr, err => {
            if (err) {
                messages.errorMsg(err)
                return
            }  
        })

        let configExists = await fs.existsSync(configDir)
        if (configExists) generateConfigMessage.succeed('Config file generated') 
    },

    read: async data => {
        const ROOT_DIR = await getRootPath()
        if (!ROOT_DIR) return false

        let configPath = `${ROOT_DIR}/${APP_FILE__CONFIG}`
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