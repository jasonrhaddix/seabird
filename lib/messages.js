const chalk = require('chalk')
const emoji = require('node-emoji')
const ora = require('ora')
const figlet = require('figlet')

const { 
    APP_FILE__CONFIG
} = require('./data/constants')


const emojis = {
    success: emoji.get('white_check_mark'),
	warning: emoji.get('warning'),
	error: emoji.get('x'),
	rainbow: emoji.get('rainbow'),
	arrowUp: emoji.get('arrow_up'),
	arrowDown: emoji.get('arrow_down'),
	arrowLeftRight: emoji.get('left_right_arrow'),
	satellite: emoji.get('satellite'),
    key: emoji.get('key'),
    exclamation: emoji.get('exclamation')
}

module.exports = {
    conflictingFlags: () => console.log(`${emojis.error}  You cannot pass conflicting flags`),
    installComplete: () => console.log(`${emojis.rainbow} ${chalk.cyan('Installation Complete')}`),
    configExists: () => console.log(`${emojis.error}  Cannot initialize app -- ${APP_FILE__CONFIG} already exists`),
    configDoesNotExist: () => console.log(`${emojis.error}  Cannot find ${APP_FILE__CONFIG} file`),
    dirNotEmpty: () => console.log(`${emojis.error}  Not an empty directory`),

    downloadRepo: () => {
        return ora('downloading from repo...')
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