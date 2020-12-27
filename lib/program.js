const commander = require('commander')
const chalk = require('chalk')

const actions = require('./actions')
const messages = require('./messages')


const { 
    APP_FILE__CONFIG
} = require('./data/constants')


const program = new commander.Command()

const programCreate = program.command('create')
const programCreateVue = programCreate.command('vue')
const programCreateVuex = programCreate.command('vuex')
const programCreateRouter = programCreate.command('router')

const programConfig = program.command('config')



// ********************************
// Base Commands
// ********************************
program
    .version('0.1.0', '-v, --version')
    .description(`Seabird is a development tool for the Vue ecosystem.
Easily create new routes, store modules and components`)


program
    .command('init')
    .alias('i')
    
    .option('-t, --template <git-repo> [dir]', 'Skip initialization prompt and create from template')
    .option('-n, --new <app-name>', 'Skip initialization prompt and create new')
    .option('-c, --config', 'Generate config file')
    // .option('-g, --init-git', 'Initialize a git repo')
    
    .description('Initialize an application from template or new')
    .action(data => {
        // from new
        let n = data.n || data.new || null
        // from template
        let t = data.t || data.template || null
        // template dir
        let d = (t && data.args.length > 0) ? data.args[0] : null
        
        // generate config
        let c = data.c || data.config || null

        if (n && t) {
            messages.conflictingFlags()
            return
        }

        actions.program.init({
            new: n,
            template: t,
            dir: d,
            config: c
        })
    })



// ********************************
// Create Commands
// ********************************
programCreate
    .alias('c')
    .description('Create Vue, Vue-router, Vuex objects')


// Vue
programCreateVue
    .command('component <file-name>')
    .alias('view')
    
    .option('--vuex-map', 'Adds Vuex mapState, mapGetters, mapActions, mapMutations')
    .option('--no-vuex-map', 'Sets `vuex-map` flag to false')
    
    .option('--hooks', 'Added Vue lifecycle hooks')
    .option('--no-hooks', 'Sets `hooks` flag to false')
    
    .option('--scoped-styles', 'Remove `scoped` attribute from style tag')
    .option('--no-scoped-styles', 'Sets `scoped-styles` flag to false')
    
    .option('--helpers', 'Add comments to component|view')
    .option('--no-helpers', 'Sets `helpers` flag to false')

    .option('--css-lang <css-lang>', `Sets lang value in style tag [css ${chalk.grey('(default)')}, scss, sass, less, stylus]`)
    
    .action((data, cmd) => {
        let options = {
            vuexMap: cmd.vuexMap,
            lifecycleHooks: cmd.hooks,
            cssLang: cmd.cssLang,
            scopedStyles: cmd.scopedStyles,
            helpers: cmd.helpers
        }

        let type = cmd.parent.args.includes('view') ? 'view' : 'component'
        actions.vue.createComponent(data, options, type)
    })
    

// Vuex
programCreateVuex
    .command('module <module-name>')
    .action(data => {
        messages.featurePending()
        // actions.vuex.createModule(data)
    })

programCreateVuex
    .command('action <action-name>')
    .description('Create a new Vuex action')
    .action(data => {
        messages.featurePending()
        // actions.vuex.createAction(data)
    })


// Vue-Router
programCreateRouter
    .command('module <module-name> [routes...]')
    .description('Create a new Vue-router module')
    .action((data, cmd) => {
        let options = {}
        let childRoutes = cmd
        actions.vueRouter.createRouteModule(data, childRoutes, options)
    })

programCreateRouter
    .command('route <route-name>')
    .description('Create a new Vue-router route')
    .action(data => {
        // messages.featurePending()
        actions.vueRouter.createRoute(data)
    })


// ********************************
// Config Commands
// ********************************
programConfig
    .description('Config Options')

programConfig
    .command('generate')
    .description(`Rebuilds the ${APP_FILE__CONFIG} file`)
    .action(() => {
        actions.config.generate()
    })


// ********************************
// 
// ********************************
// if (!process.argv.slice(2).length) program.outputHelp()
program.parse(process.argv)