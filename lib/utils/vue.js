const cmdExists = require('command-exists')

const process = require('./childProcess')
const prompts = require('../prompts')
const messages = require('../messages')

module.exports = {
    createVueApp: async appName => {
        let hasVueCLI = await _this.checkVueCLI()
        if (!hasVueCLI) return

        return process.spawn('vue', ['create', `${appName}`], {stdio: 'inherit'}).then(() => {
            return true
        }).catch(() => {
            // fail message
            return false
        })
    },

    checkVueCLI: () => {
        return cmdExists('vue').then(() => {
            return true
        }).catch( async () => {
            const prompt = await prompts.git.installVueCLI()
            if (prompt.installVueCLI === 'y') {
                return await _this.installVueCLI()
            } else {
                // abort message
                return false
            }
        })
    },

    installVueCLI: () => {
        return process.spawn('npm', ['i', '-g', '@vue/cli'], {stdio: 'inherit'}).then(() => {
            messages.installComplete()
            return true
        }).catch(() => {
            // fail message
            return false
        })
    }
}


let _this = module.exports