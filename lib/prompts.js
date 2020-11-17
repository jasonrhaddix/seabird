const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = {
    program: {
        initializeApp: () => {
            const questions = [
                {
                    name: 'initializeApp',
                    type: 'list',
                    message: 'Initialize from template or new?',
                    choices: [
                        {
                            name: 'From Template',
                            value: 'template'
                        },
                        {
                            name: `Create New ${chalk.grey('(uses VueCLI)')}`,
                            value: 'new',
                        }
                    ]
                }
            ]
            
            return inquirer.prompt(questions)
        },

        createNewInput: () => {
            const questions = [
                {
                    name: 'appName',
                    type: 'input',
                    message: 'App name:',
                    validate: value => {
                        return value.length
                            ? true : "Please enter your app's name."
                    }
                }
            ]

            return inquirer.prompt(questions)
        },

        createTemplateInput: () => {
            const questions = [
                {
                    name: 'templateURL',
                    type: 'input',
                    message: 'Template URL:',
                    validate: value => {
                        return value.length
                            ? true : "Please enter your GitHub repo URL."
                    }
                },
                {
                    name: 'dir',
                    type: 'input',
                    suffix: '(optional)',
                    message: 'directory:'
                }
            ]

            return inquirer.prompt(questions)
        }
    },

    git: {
        installVueCLI: () => {
            const questions = [
                {
                    name: 'installVueCLI',
                    type: 'input',
                    message: 'Synapsis requires Vue CLI to be installed. Do you want to install it now? (Y/N)',
                    validate: value => {
                        return value.length
                            ? true : "Y or N"
                    }
                }
            ]
        
            return inquirer.prompt(questions)
        },
    },
    
    utils: {
        overwriteDirectory: () => {
            const questions = [
                {
                    name: 'overwrite',
                    type: 'input',
                    message: 'The target directory is not empty. Do you want to proceed anyway?',
                    validate: value => {
                        return value.length
                            ? true : "Y or N"
                    }
                }
            ]
        
            return inquirer.prompt(questions)
        }
    }
}