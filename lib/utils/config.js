const fs = require('fs')
const yaml = require('js-yaml')
const _get = require('lodash.get')

const messages = require('../messages')
const { getMatchingPaths } = require('./fileSystem')

const { 
    APP_CONFIG_FILE, 
    APP_PACKAGE_FILE,
    APP_SERVICES
} = require('../data/constants')

module.exports = {
    buildYamlConfig: async data => {
        // console.log(data)

        let appData = JSON.parse(process.env.APP_DATA)
        let packageFile = `${data.workingDir}/${APP_PACKAGE_FILE}`

        let packageJSON = await fs.promises.readFile(packageFile, 'binary')
        let packageJSONParsed = JSON.parse(packageJSON)

        let yamlData = {
            appName: packageJSONParsed.name || appData.appName || appData.baseDir || null,
            baseDir: appData.baseDir,
            services: {}
        }

        if (data.templateURL) Object.assign(yamlData, {templateURL: data.templateURL})

        await Promise.all(APP_SERVICES.map(async sDir => {
            let service = sDir.service
            let serviceVersion = packageJSONParsed[service] || 
                                    packageJSONParsed.dependencies[service] ||
                                    packageJSONParsed.devDependencies[service] || 
                                    null
            
            let serviceData = {
                [service]: {
                    version: serviceVersion,
                }
            }
            
            if (sDir.hasOwnProperty('path') && sDir.hasOwnProperty('pathTerms')) {
                await Promise.all(sDir.pathTerms.map(async term => {
                    let routerPath = await getMatchingPaths(term, `${data.workingDir}/src`)
                    if (routerPath[0] && routerPath[0].includes(term)) Object.assign(serviceData[service], { path: routerPath[0] })
                }));
            }
            
            Object.assign(yamlData.services, serviceData)
        }))

        console.log(yamlData)
        await _this.write(yamlData, data.workingDir)
    },

    write: (data, dir) => {
        let workingPath = dir ? `${dir}/` : '',
            yamlPath = `${workingPath}/${APP_CONFIG_FILE}`,
            dataObj = { ...data },
            yamlData
    
        if (fs.existsSync(yamlPath)) {
            yamlData = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'))
            Object.assign(dataObj, yamlData)
        }
    
        fs.writeFile(yamlPath, yaml.safeDump(dataObj), (err) => {
            if (err) {
                console.log(err)
            }
        })
    },

    read: async (data, dir) => {
        let workingPath = dir ? `${dir}/` : '',
            yamlPath = `${workingPath}${APP_CONFIG_FILE}`,
            yamlData

        if (!fs.existsSync(yamlPath)) {
            messages.configDoesNotExist()
            return null
        }

        yamlData = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'))
        return _get(yamlData, data)

    }
}

let _this = module.exports