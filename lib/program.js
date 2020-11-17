const commander = require('commander')

const actions = require('./actions')
const messages = require('./messages')

const program = new commander.Command()
const programCreate = program.command('create')
const programCreateVuex = programCreate.command('vuex')
const programCreateRouter = programCreate.command('router')



// ********************************
// Base Commands
// ********************************
program
    .version('0.1.0', '-v, --version')
    .description('Version control merge system')


program
    .command('init')
    .alias('i')
    .option('-n, --new <app-name>', 'Skip initialization prompt and create new')
    .option('-t, --template <git-repo> [dir]', 'Skip initialization prompt and create from template')
    .description('Initialize an application from template or new')
    .action(cmd => {
        // options
        let n = cmd.n || cmd.new || null
        let t = cmd.t || cmd.template || null
        let d = (t && cmd.args.length > 0) ? cmd.args[0] : null

        if (n && t) {
            messages.conflictingFlags()
            return
        }

        let data = {
            new: n,
            template: t,
            dir: d
        }
        
        actions.program.init(data)
    })



// ********************************
// Create Commands
// ********************************
programCreate
    .alias('c')


// create vuex 
/* programCreateVuex
    .command('module <module-name>')
    .action(cmd => {
        console.log(cmd)
    }) */


programCreateVuex
    .command('action <action-name>')
    .description('Create a new Vuex action')
    .action(cmd => {
        actions.vuex.createAction(cmd)
    })

// create route
programCreateRouter
    .command('module <module-name> [routes...]')
    .description('Create a new Vue-router module')
    .action((cmd, args) => {
        let data = {
            moduleName: cmd,
            routes: args
        }
        
        actions.vueRouter.createRouteModule(data)
    })

programCreateRouter
    .command('route <route-name>')
    .description('Create a new Vue-router route')
    .action(cmd => {
        actions.vueRouter.createRoute(cmd)
    })



// ********************************
// 
// ********************************
// if (!process.argv.slice(2).length) program.outputHelp()
program.parse(process.argv)