const commander = require('commander')
const chalk = require('chalk')

const actions = require('./actions')
const messages = require('./messages')


const { 
    APP_CONFIG_FILE
} = require('./data/constants')


const program = new commander.Command()

const programCreate = program.command('create')
const programCreateVuex = programCreate.command('vuex')
const programCreateRouter = programCreate.command('router')

const programConfig = program.command('config')



// ********************************
// Base Commands
// ********************************
program
    .version('0.1.0', '-v, --version')
    .description(`Synpasis is a development tool for the Vue ecosystem.
Easily create new routes, store modules and components`)


program
    .command('init')
    .alias('i')
    .option('-n, --new <app-name>', 'Skip initialization prompt and create new')
    .option('-t, --template <git-repo> [dir]', 'Skip initialization prompt and create from template')
    // .option('-g, --init-git', 'Initialize a git repo')
    .description('Initialize an application from template or new')
    .action(data => {
        // options
        let n = data.n || data.new || null
        let t = data.t || data.template || null
        let d = (t && cmd.args.length > 0) ? cmd.args[0] : null

        if (n && t) {
            messages.conflictingFlags()
            return
        }

        actions.program.init({
            new: n,
            template: t,
            dir: d
        })
    })



// ********************************
// Create Commands
// ********************************
programCreate
    .alias('c')
    .description('Create Vue, Vue-router, Vuex objects')


// Vue
programCreate
    .command('component <file-name>')
    .alias('view')
    .option('--vuex-map', 'Adds Vuex mapState, mapGetters, mapActions, mapMutations')
    .option('--hooks', 'Added Vue lifecycle hooks')
    .option('--css <css-lang>', `Sets lang value in style tag [css ${chalk.grey('(default)')}, scss, less]`)
    .option('--scoped-styles', 'Remove `scoped` attribute from style tag')
    .option('--basic', 'Create a basic component')
    .action((data, cmd) => {
        actions.vue.createComponent({
            file: data,
            options: {
                vuexMap: cmd.vuexMap,
                hooks: cmd.hooks,
                css: cmd.css,
                scopedStyles: cmd.scopedStyles,
                basic: cmd.basic
            }
        })
    })
    

// Vuex
programCreateVuex
    .command('module <module-name>')
    .action(data => {
        console.log(data)
    })

programCreateVuex
    .command('action <action-name>')
    .description('Create a new Vuex action')
    .action(data => {
        actions.vuex.createAction(data)
    })


// Vue-Router
programCreateRouter
    .command('module <module-name> [routes...]')
    .description('Create a new Vue-router module')
    .action((data, cmd) => {
        actions.vueRouter.createRouteModule({
            moduleName: data,
            routes: cmd
        })
    })

programCreateRouter
    .command('route <route-name>')
    .description('Create a new Vue-router route')
    .action(data => {
        actions.vueRouter.createRoute(data)
    })


// ********************************
// Create Commands
// ********************************
programConfig
    .description('Config Options')

programConfig
    .command('rebuild')
    .description(`Rebuilds the ${APP_CONFIG_FILE} file`)
    .action(() => {
        actions.config.rebuild()
    })


// ********************************
// 
// ********************************
// if (!process.argv.slice(2).length) program.outputHelp()
program.parse(process.argv)