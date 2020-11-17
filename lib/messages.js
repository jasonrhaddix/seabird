const chalk = require('chalk')
const emoji = require('node-emoji')
const ora = require('ora')
const figlet = require('figlet')


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
    configExists: () => console.log(`${emojis.error}  Cannot initialize app -- 'vuetimate.yaml' already exists`),
    configDoesNotExist: () => console.log(`${emojis.error}  Cannot find 'vuetimate.yaml' file`),
    dirNotEmpty: () => console.log(`${emojis.error}  Not an empty directory`),

    // processes
    downloadRepo: () => {
        const spinner = ora('downloading from repo...')
        return spinner
    }
}