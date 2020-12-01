const fs = require('fs')
const fsExtra = require('fs-extra')
const ejs = require('ejs')

const prompts = require('./prompts')
const messages = require('./messages')
const config = require('./utils/config')
const templateData = require('./data/templateData')

const { isEmptyDir, getRootPath, getPathAsObj } = require('./utils/fileSystem')
const { downloadGitRepo } = require('./utils/git')
const { createVueApp } = require('./utils/vue')
const { dataHasReservedKeywords } = require('./utils/ejs')

const {
    APP_PACKAGE_FILE,
    APP_PATH_COMPONENTS,
    APP_PATH_ROUTER
} = require('./data/constants')

const {
    REGEX_PATTERN_IMPORT
} = require('./data/regexPatterns')

module.exports = {
    program: {
        init: async actionData => {
            // *************************************
            // Define option variables
            // *************************************
            // 1) Store 'new' option in variable (holds app-name)
            let createNew = actionData.new
            // 2) Store 'template' option in variable (holds git-repo)
            let createFromTemplate = actionData.template
            // 3) Get sub-directory as specified dir or app name

            // *************************************
            // Build target file path
            // *************************************
            let subDir = actionData.dir || actionData.new
            // 4) Compile target directory
            let targetDir = `${process.cwd()}${subDir ? '/'+subDir+'/' : ''}`
            // 5) Get package.json file
            let packageFile = `${targetDir}/${APP_PACKAGE_FILE}`
            // 6) Check if package.json 
            let hasPackageJSON = await fs.existsSync(packageFile)

            // *************************************
            // Check how new app is being initiazed
            // *************************************
            // 9) Check how a new app is initialize
            if (createNew) {
                // 9.1a) Create new app using Vue CLI 
                await createVueApp(createNew)
            } else if (createFromTemplate) {
                // 9.1b) Initialize prompt
                let prompt = null
                // 9.2b) Checks if target directory is empty
                let isTargetDirEmpty = await isEmptyDir(targetDir)
                // 9.3b) Initialize download message (and spinner)
                let downloadMessage = messages.downloadRepo()
                // 9.4b) Prompt to overwrite if targert directory is Not empty <-------------------------- TODO: Needs testing 
                if (!isTargetDirEmpty) prompt = await prompts.utils.overwriteDirectory() 
                // 9.5b) Bail if target directory is not empty and user rejects overwrite
                if (!isTargetDirEmpty && prompt.overwrite === 'n') return
                // 9.6b) Initiate download Git repo
                await downloadGitRepo(createFromTemplate, targetDir, downloadMessage)
            }
            
            // *************************************
            // If app initialized without options
            // *************************************
            // 10) Check if command options are null
            if (!createNew && !createFromTemplate){
                // 10.1) Check if there is no package.json in the target directory
                if (!hasPackageJSON) {
                    // 10.1a) Prompt use to initialize a new application
                    let initType = await prompts.program.initializeApp()
                    // 10.1b) Declare prompt variable
                    let prompt
                    // 10.1c) From prompt, determine which selection was made by user
                    switch (initType.initializeApp) {
                        case 'new' :
                            // 10.1c.i) Prompt user with new app message
                            prompt = await prompts.program.createNewInput()
                            // 10.1c.ii) Recursively call `init` method but pass in new app name
                            _this.program.init({ new: prompt.appName})
                            return
                        case 'template' :
                            // 10.1c.i) Prompt user with app from template message
                            prompt = await prompts.program.createTemplateInput()
                            // 10.1c.ii) Recursively call `init` method but pass in new app name
                            _this.program.init({ template: prompt.templateURL, dir: prompt.dir })
                            return
                    }
                // 10.2) If package.json file exists
                } else {
                    // 10.2a) Throw abort message
                    throw('Directory already contains a package.json file. Aborted.')
                }
            }

            // 11) Generate config file if `-c | --config` flag is passed  
            if (actionData.config) config.generateConfig(targetDir)
        }
    },

    vue: {
        createComponent: async (filePath, options) => {
            // *************************************
            // Build target file path
            // *************************************
            // 1) find project root directory
            const rootDir = await getRootPath()
            if (!rootDir) {
                console.log('Cannot find components directory')
                return
            }
            // 2) component folder dir (hardcoded for now)
            const workingDir = APP_PATH_COMPONENTS
            // 3) convert user input path to path object (path, file)
            const inputObj =  getPathAsObj(filePath)
            // 4) final target directory
            const targetFilePath = `${rootDir}/${workingDir}/${inputObj.path}/${inputObj.file}.vue`

            // *************************************
            // Set default template and data
            // *************************************
            // 5) Get default template
            let template = templateData.vue.component.template
            // 6) Get default data
            let data = templateData.vue.component.data
        
            // *************************************
            // Determine template and data
            // *************************************
            // 7) Check config for any user defined templates
            let hasTemplateData = await config.read('templates')
            // 8) User templates found
            if (hasTemplateData) {
                // 8.1) Get template base directory
                let baseTemplatePath = await config.read('templates.baseDir') || ''
                // 8.2) Get ~possible~ path to template
                let userTemplatePath = await config.read('templates.vue.component.template')
                // 8.3) Build ~posssible~ working directory to user defined template
                let workingTemplatePath = `${baseTemplatePath ? baseTemplatePath+'/': ''}${userTemplatePath}`
                // 8.4) Check if template actually exists
                let userTemplateExists = await fs.existsSync(workingTemplatePath)
                // 8.5) Get ~possible~ user defined data for component
                let userData = await config.read('templates.vue.component.data')

                // 8.6) If user defined template found, but data does not exist - WARN? THROW?
                if (userTemplateExists && !userData) console.log('cannot find template data')
                // 8.7) If user defined template path but no actual file found - WARN? THROW?
                if (userTemplatePath && !userTemplateExists) console.log('Cannot find user defined template')
                // 8.8) Warn if user defined data contains reserved keywords
                if (dataHasReservedKeywords(userData)) console.log('Warning: data has reserved keywords. Your template may fail to compile!')

                // 8.9) If user defined template AND data is defined ELSE just merge ~possible~ data
                if (userTemplateExists && userData) {
                    template = workingTemplatePath
                    Object.assign(data, userData)
                } else if (userData) {
                    Object.assign(data, userData)
                }
            }
            
            // 9) Removes user options with undefined props
            Object.keys(options).forEach(key => options[key] === undefined ? delete options[key] : {})
            // 10) Overwrites default options with user defined
            Object.assign(data, options)
            
            // *************************************
            // Compile and write template
            // *************************************
            // 11) render file with ejs
            let compiledStr = await ejs.renderFile(template, data)
            // 12) write file and path if path doesn't exist
            fsExtra.outputFileSync(targetFilePath, compiledStr, err => {
                if (err) console.log(err)
            })

            // 13) Confirm file is created
            if (fs.existsSync(targetFilePath)) console.log(`Component created - ${inputObj.file}.vue`)
        }
    },

    vuex: {
        createAction: async actionData => {
            console.log(actionData)
        }
    },

    vueRouter : {
        createRouteModule: async (filePath, options) => {
            // *************************************
            // Build target file path
            // *************************************
            // 1) find project root directory
            const rootDir = await getRootPath()
            if (!rootDir) {
                console.log('Cannot find router directory')
                return
            }
            // 2) router folder dir (hardcoded for now)
            const workingDir = APP_PATH_ROUTER
            // 3) convert user input path to path object (path, file)
            const inputObj =  getPathAsObj(filePath)
            // 4) final target directory
            const targetFilePath = `${rootDir}/${workingDir}/${inputObj.path}/${inputObj.file}.js`

            // *************************************
            // Set default template and data
            // *************************************
            // 5) Get default template
            let template = templateData.router.module.template
            // 6) Get default data
            let data = templateData.router.module.data

            console.log(template, data)

            // *************************************
            // Determine template and data
            // *************************************
            // 7) Check config for any user defined templates
            let hasTemplateData = await config.read('templates')
            // 8) User templates found
            if (hasTemplateData) {
                // 8.1) Get template base directory
                let baseTemplatePath = await config.read('templates.baseDir') || ''
                // 8.2) Get ~possible~ path to template
                let userTemplatePath = await config.read('templates.router.module.template')
                // 8.3) Build ~posssible~ working directory to user defined template
                let workingTemplatePath = `${baseTemplatePath ? baseTemplatePath+'/': ''}${userTemplatePath}`
                // 8.4) Check if template actually exists
                let userTemplateExists = await fs.existsSync(workingTemplatePath)
                // 8.5) Get ~possible~ user defined data for router
                let userData = await config.read('templates.router.module.data')

                // 8.6) If user defined template found, but data does not exist - WARN? THROW?
                if (userTemplateExists && !userData) console.log('cannot find template data')
                // 8.7) If user defined template path but no actual file found - WARN? THROW?
                if (userTemplatePath && !userTemplateExists) console.log('Cannot find user defined template')
                // 8.8) Warn if user defined data contains reserved keywords
                if (dataHasReservedKeywords(userData)) console.log('Warning: data has reserved keywords. Your template may fail to compile!')

                // 8.9) If user defined template AND data is defined ELSE just merge ~possible~ data
                if (userTemplateExists && userData) {
                    template = workingTemplatePath
                    Object.assign(data, userData)
                } else if (userData) {
                    Object.assign(data, userData)
                }
            }

            // 9) Removes user options with undefined props
            Object.keys(options).forEach(key => options[key] === undefined ? delete options[key] : {})
            // 10) Overwrites default options with user defined
            Object.assign(data, options)
            
            // *************************************
            // Compile and write template
            // *************************************
            // 11) render file with ejs
            let compiledStr = await ejs.renderFile(template, data)
            // 12) write file and path if path doesn't exist
            fsExtra.outputFileSync(targetFilePath, compiledStr, err => {
                if (err) console.log(err)
            })

            // 13) Confirm file is created
            if (fs.existsSync(targetFilePath)) console.log(`Router module created - ${inputObj.file}.js`)

            // *************************************
            // Import module into router index <-------------------------------------------------------------------- IN PROGRESS
            // *************************************
            let hasRouterIndex = await fs.existsSync(`${workingDir}/index.js`)
            const indexFile = await fs.readFileSync(`${workingDir}/index.js`, 'utf8')
            const importMatch = await indexFile.match(REGEX_PATTERN_IMPORT)

            let lastMatch = importMatch[importMatch.length-1]
            let strAddedSplitIdent = indexFile.replace(lastMatch, `${lastMatch}// <---seabird--split`)
            
            let splitString = strAddedSplitIdent.split(`// <---seabird--split`)
            console.log(splitString[0])

        },

        createRoute: async actionData => {
            console.log(actionData)
        }
    },

    config: {
        generate: () => {
            config.generateConfig()
        }
    }, 

    eject: {
        templates: () => {
            
        },

        data: () => {

        }
    }
}

let _this = module.exports
