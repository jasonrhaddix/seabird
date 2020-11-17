const fs = require('fs')
const path = require('path');

const prompts = require('./prompts')
const messages = require('./messages')
const store = require('./utils/dataStore')
const config = require('./utils/config')

const { isEmptyDir } = require('./utils/fileSystem')
const { downloadGitRepo } = require('./utils/git')
const { createVueApp } = require('./utils/vue')
const { getEnvInfo } = require('./utils/env')

const { 
    APP_CONFIG_FILE, 
    APP_PACKAGE_FILE
} = require('./data/constants')

module.exports = {
    program: {
        init: async actionData => {
            let createNew = actionData.new
            let createFromTemplate = actionData.template

            let subDir = actionData.dir || actionData.new
            let targetDir = `${process.cwd()}${subDir ? '/'+subDir+'/' : ''}`

            let packageFile = `${targetDir}/${APP_PACKAGE_FILE}`
            let hasPackageJSON = await fs.existsSync(packageFile)

            let configFile  = `${targetDir}/${APP_CONFIG_FILE}`
            let hasConfig = await fs.existsSync(configFile)

            // console.clear()

            // Creates new app using VUE CLI
            // createNew: <app-name>
            if (createNew) {
                await createVueApp(createNew)
            } 
            
            // Create new app from template
            // createFromTemplate: <repo-url>
            if (createFromTemplate) {
                let prompt
                let emptyDir = await isEmptyDir(targetDir)
                let downloadMessage = messages.downloadRepo()

                if (!emptyDir) prompt = await prompts.utils.overwriteDirectory() 
                if (prompt && prompt.overwrite === 'n') return
                
                await downloadGitRepo(createFromTemplate, targetDir, downloadMessage)
            } 
            
            // Initialized without options
            // Recursively calls `init` with proper values
            if (!createNew && !createFromTemplate){
                if (!hasPackageJSON) {
                    let initType = await prompts.program.initializeApp()
                    let prompt
                    switch (initType.initializeApp) {
                        case 'new' :
                            prompt = await prompts.program.createNewInput()
                            _this.program.init({ new: prompt.appName})
                            return
                        case 'template' :
                            prompt = await prompts.program.createTemplateInput()
                            _this.program.init({ template: prompt.templateURL, dir: prompt.dir })
                            return
                        default :
                            // 
                            return 
                    }
                }
            }
              
            // check for config and package.json again
            packageFile = `${targetDir}/${APP_PACKAGE_FILE}`
            hasPackageJSON = await fs.existsSync(packageFile)

            configFile  = `${targetDir}/${APP_CONFIG_FILE}`
            hasConfig = await fs.existsSync(configFile)

            let envInfo = await getEnvInfo()
            let data = {
                appName: actionData.new || null,
                templateURL: actionData.template || null,
                baseDir: actionData.dir || path.basename(path.resolve(targetDir)),
                workingDir: targetDir,
                env: envInfo,
                hasConfig: hasConfig,
                hasPackageJSON: hasPackageJSON,
            }

            if (hasConfig) {
                console.log('directory already contains a vuetimate.yaml file')
            } else if (!hasPackageJSON) {
                console.log('directiry does not contain a package.json file')
            } else {
                await store.set(data) // store data in process
                config.buildYamlConfig(data) // build yaml config
            }
        }
    },

    vuex: {
        createAction: async actionData => {
            console.log(actionData)
        }
    },

    vueRouter : {
        createRouteModule: async actionData => {
           /*  let routerPath = await getMatchingPaths('router', `${process.cwd()}/src`)
            console.log(routerPath[0]) */

            let data = await config.read('services.vue-router.path')
            console.log(data)
            // has config
            // if route in config exists use
            // else if traverse dir for 'router' folder
            // else abort
            
        },

        createRoute: async actionData => {
            console.log(actionData)
        }
    }
}

let _this = module.exports


// vma create vuex action config/fetch
// vma create vuex action store/modules/ui/filterbar fetch -c