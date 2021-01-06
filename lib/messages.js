const chalk = require('chalk')
const emoji = require('node-emoji')
const ora = require('ora')

const { 
    APP_FILE__PACKAGE,
    APP_FILE__CONFIG
} = require('./data/constants')


const emojis = {
    success: emoji.get('white_check_mark'),
	warning: emoji.get('warning'),
	error: emoji.get('x'),
    exclamation: emoji.get('exclamation'),
    
    arrowUp: emoji.get('arrow_up'),
	arrowDown: emoji.get('arrow_down'),
    
    rainbow: emoji.get('rainbow'),
	satellite: emoji.get('satellite'),
	wrench: emoji.get('wrench')
}

module.exports = {
    // Program
    conflictingFlags: () => console.log(`${emojis.error}  You cannot pass conflicting flags`),
    packageJSONExists: () => console.log(`${emojis.error}  Directory already contains a package.json file`),
    
    // Vue
    installComplete: () => console.log(`${emojis.rainbow}  ${chalk.cyan('Vue CLI installation complete!')}`),
    vueComponentCreated: path => console.log(`${emojis.rainbow}  Vue component created at ${chalk.cyan(path)}`),

    // Vuex
    storeModuleCreated: path => console.log(`${emojis.rainbow}  Store module created at ${chalk.cyan(path)}`),
    storeModuleCreated: path => console.log(`${emojis.rainbow}  Store module created at ${chalk.cyan(path)}`),
    cannotFindNewStore: file => console.log(`${emojis.error}  Cannot update ${file}. File not found`),
    
    // Vue-router
    routerModuleCreated: path => console.log(`${emojis.rainbow}  Router module created at ${chalk.cyan(path)}`),
    cannotFindNewRouter: file => console.log(`${emojis.error}  Cannot update ${file}. File not found`),

    // Git
    initRepoDownload: () => ora(`${emojis.satellite}  downloading from repo...`),

    // Ejs
    reservedKeywords: () => console.log(`${emojis.warning}  Warning: data has reserved keywords. Your template may fail to compile!`),

    // Config
    generatingConfig: () => ora(`${emojis.wrench}  Generating config...`),
    configExists: () => console.log(`${emojis.error}  Cannot initialize app -- ${APP_FILE__CONFIG} already exists`),
    configDoesNotExist: () => console.log(`${emojis.error}  Cannot find ${APP_FILE__CONFIG} file`),

    // FileSystem
    dirNotEmpty: () => console.log(`${emojis.error}  Not an empty directory`),
    cannotFindDirectory: (dir, create=false) => {
        console.log(`${emojis.error}  Cannot find ${dir} directory`)
        if (create) console.log(`${emojis.wrench}  Creating ${dir} directory`)
    },
    cannotFindTemplate: () => console.log(`${emojis.warning}  Cannot find user defined template`),
    cannotFindTemplateData: () => console.log(`${emojis.warning}  Cannot find user defined template data`),

    // General
    successMsg: msg => console.log(`${emojis.success}${msg}`),
    errorMsg: msg => console.log(`${emojis.error}${msg}`),
    featureInDevelopment: () => console.log(`${emojis.warning}  This feature is currently in development`),
    featurePending: () => console.log(`${emojis.error}  This feature is currently pending`),
    seabirdUsesFile: (file, dir) => {
        switch (file) {
            case APP_FILE__PACKAGE :
                console.log(`${emojis.error}  Cannot find ${dir} directory`)
                console.log(`Seabird uses ${APP_FILE__PACKAGE} file to find the ${dir} directory. Please confirm you have the file exists in the root directory and try again.`)
                break
        }
    },
    successList: items => {
        if (Object.keys(items).length > 0) {
            Object.keys(items).forEach(key => {
                let k = key.split(/(?=[A-Z])/).join(' ').toLowerCase()
                console.log(`${emojis.success} ${chalk.cyanBright(k+':')} ${items[key]}`)
            })
        } else {
            items.forEach(item => console.log(`${emojis.success} ${item}`))
        }
    }
}