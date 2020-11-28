#!/usr/bin/env node
const figlet = require('figlet')
const chalk = require('chalk')


const run = async () => {
    console.clear()

    figlet.text('     Seabird', {color: 'green'}, (err, data) => {
        console.log(chalk.gray('================================================='))
        console.log(chalk.green(data))
        console.log(chalk.yellowBright('    https://github.com/jasonrhaddix/seabird'))
        console.log(chalk.gray('================================================='))
        console.log('')
        
        require('./lib/program')
    })
}

run()