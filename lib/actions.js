const fs = require('fs')
const fsExtra = require('fs-extra')
const ejs = require('ejs')

const prompts = require('./prompts')
const messages = require('./messages')
const config = require('./utils/config')
const templateData = require('./data/templateData')

const { 
    isEmptyDir,
    getRootPath,
    getPathAsObj,
    getMatchingPaths,
    createDirectories,
    trimPathSlashes
} = require('./utils/fileSystem')

const { downloadGitRepo } = require('./utils/git')
const { createVueApp } = require('./utils/vue')
const { dataHasReservedKeywords } = require('./utils/ejs')

const {
    APP_FILE__PACKAGE,
    APP_PATH__COMPONENTS,
    APP_PATH__ROUTER
} = require('./data/constants')

const {
    REGEX_PATTERN__IMPORT,
    REGEX_PATTERN__VUE_ROUTER
} = require('./data/regexPatterns')

const GeneratorAPI = require('./utils/GeneratorAPI/GeneratorAPI')
const api = new GeneratorAPI()

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
            let packageFile = `${targetDir}/${APP_FILE__PACKAGE}`
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
                let downloadMessage = messages.initRepoDownload()
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
                    // 10.2a) Abort message
                    messages.packageJSONExists()
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
            // 1) Find project root directory
            const ROOT_DIR = await getRootPath()
            // 2) Abort if project root not found
            if (!ROOT_DIR) {
                console.log('Cannot find project root directory')
                return
            }

            // 3) Component folder directory : user defined || default
            let workingDir = await config.read('templates.vue.component.fileDir')|| 
                               await getMatchingPaths(ROOT_DIR, APP_PATH__COMPONENTS, 0)
 
            // 4) If working directory not found, create from default
            if (!workingDir) {
                // 4.1) Cannot find components dir; creating
                messages.cannotFindDirectory('components', true)
                // 4.2) create default directory
                await createDirectories([APP_PATH__COMPONENTS[0]], `${ROOT_DIR}`)
                // 4.3) Recursive call `createComponent`
                _this.vue.createComponent(filePath, options)
                return
            }       

            // 5) Trim slashes from working directory
            workingDir = trimPathSlashes(workingDir)
            // 6) Convert user input path to path object (path, file)
            const inputObj = getPathAsObj(filePath)
            // 7) Final target directory
            const targetFilePath = `${ROOT_DIR}/${workingDir}/${inputObj.path}/`
            // 8) Define target file
            let targetFile = `${inputObj.file}`

            // *************************************
            // Set default template and data
            // *************************************
            // 6) Get default template
            let template = templateData.vue.component.template
            // 7) Get default data
            let data = templateData.vue.component.data
            // 8) Get default file extension type
            let fileType = templateData.vue.component.fileType
        
            // *************************************
            // Determine template and data
            // *************************************
            // 9) Check config for any user defined templates or data
            let hasTemplateData = await config.read('templates')
            // 10) User templates found
            if (hasTemplateData) {
                // 10.1) Get template base directory
                let baseTemplatePath = await config.read('templates.baseDir') || ''

                // 10.2) Get user config for Vue components
                const userConfig = await config.read('templates.vue.component')

                // 10.3) Get ~possible~ path to template
                let userTemplatePath = userConfig.template
                // 10.3) Build ~posssible~ working directory to user defined template
                let workingTemplatePath = `${baseTemplatePath ? baseTemplatePath+'/': ''}${userTemplatePath}`
                // 10.4) Check if template actually exists
                let userTemplateExists = await fs.existsSync(workingTemplatePath)
                
                // 10.5) Get ~possible~ user defined file type extension
                if (userConfig.fileType) fileType = userConfig.fileType
                // 10.6) Get ~possible~ user defined data for component
                let userData = userConfig.data || {}

                // 10.7) If user defined template found, but data does not exist
                if (userTemplateExists && !userData) messages.cannotFindTemplateData()
                // 10.8) If user defined template path but no actual file found
                if (userTemplatePath && !userTemplateExists) messages.cannotFindTemplate()
                // 10.9) Warn if user defined data contains reserved keywords
                if (dataHasReservedKeywords(userData)) messages.reservedKeywords()

                // 10.10) If user defined template AND data is defined ELSE just merge ~possible~ data
                if (userTemplateExists && userData) {
                    template = workingTemplatePath
                    Object.assign(data, userData)
                } else if (userData) {
                    Object.assign(data, userData)
                }
            }
            
            // 11) Removes user options with undefined props
            Object.keys(options).forEach(key => options[key] === undefined ? delete options[key] : {})
            // 12) Overwrites default options with user defined
            Object.assign(data, options)
            
            // *************************************
            // Compile and write template
            // *************************************
            // 13) render file with ejs
            let compiledStr = await ejs.renderFile(template, data)
            // 14)
            let compiledFilePath = `${targetFilePath}${targetFile}.${fileType}`
            // 15) write file and path if path doesn't exist
            fsExtra.outputFileSync(compiledFilePath, compiledStr, err => {
                if (err) messages.errorMsg(err)
            })

            // 16) Confirm file is created
            if (fs.existsSync(compiledFilePath)) 
                messages.vueComponentCreated(`./${workingDir}/${inputObj.path}/${inputObj.file}.${fileType}`)
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
            const ROOT_DIR = await getRootPath()
            // 2) router folder dir (hardcoded for now)
            const workingDir = await getMatchingPaths(ROOT_DIR, APP_PATH__ROUTER, 0, true)

            if (!ROOT_DIR || workingDir.length === 0) {
                messages.cannotFindDirectory('router')
                return
            }
     
            // 3) convert user input path to path object (path, file)
            const inputObj = getPathAsObj(filePath)
            // 4) final target directory
            // const targetFilePath = `${ROOT_DIR}/${workingDir}/modules/${inputObj.path}/`
            const targetFilePath = `${ROOT_DIR}/${workingDir}/${inputObj.path}/`
            let targetFile = `${inputObj.file}`

            // *************************************
            // Set default template and data
            // *************************************
            // 5) Get default template
            let template = templateData.router.module.template
            // 6) Get default data
            let data = templateData.router.module.data
            // 7) Get default file extension type
            let fileType = templateData.router.module.fileType
 
            // *************************************
            // Determine template and data
            // *************************************
            // 7) Check config for any user defined templates
            let hasTemplateData = await config.read('templates')
            // 8) User templates found
            if (hasTemplateData) {
                // 8.1) Get template base directory
                let baseTemplatePath = await config.read('templates.baseDir') || ''

                // 9.2) Get user config for Vue components
                const userConfig = await config.read('templates.router.module')

                // 9.3) Get ~possible~ path to template
                let userTemplatePath = userConfig.template
                // 9.3) Build ~posssible~ working directory to user defined template
                let workingTemplatePath = `${baseTemplatePath ? baseTemplatePath+'/': ''}${userTemplatePath}`
                // 9.4) Check if template actually exists
                let userTemplateExists = await fs.existsSync(workingTemplatePath)

                // 9.5) Get ~possible~ user defined file type extension
                if (userConfig.fileType) fileType = userConfig.fileType
                // 9.6) Get ~possible~ user defined data for component
                let userData = userConfig.data || {}

                // 8.6) If user defined template found, but data does not exist - WARN? THROW?
                if (userTemplateExists && !userData) messages.cannotFindTemplateData()
                // 8.7) If user defined template path but no actual file found - WARN? THROW?
                if (userTemplatePath && !userTemplateExists) messages.cannotFindTemplate()
                // 8.8) Warn if user defined data contains reserved keywords
                if (dataHasReservedKeywords(userData)) messages.reservedKeywords()

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
            let compiledFilePath = `${targetFilePath}${targetFile}.${fileType}`
            fsExtra.outputFileSync(compiledFilePath, compiledStr, err => {
                if (err) messages.errorMsg(err)
            })

            // 14) Confirm file is created
            if (fs.existsSync(compiledFilePath)) 
                messages.routerModuleCreated(`@/${workingDir}/${inputObj.path}/${inputObj.file}.${fileType}`)

            // ********************************************************
            // Use Generator API to insert data into router index.js
            // ********************************************************
            let indexFile = `${workingDir}/index.js`
            let apiData = [
                {
                    regex: {
                        pattern: REGEX_PATTERN__IMPORT,
                        position: 'last'
                    },
                    snippet: 'import',
                    data: {
                        name: inputObj.file,
                        path: `@/router/modules/${inputObj.path}/${inputObj.file}.js`
                    }
                },
                {
                    regex: {
                        pattern: REGEX_PATTERN__VUE_ROUTER
                    },
                    data: inputObj.file
                }
            ]

            let string = await api.generate(indexFile, apiData)
            fs.writeFile(indexFile, string, err => {
                if (err) messages.errorMsg(err)
            })
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
