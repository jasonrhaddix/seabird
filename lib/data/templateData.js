module.exports = {
    vue: {
        component: {
            template: `${__dirname}/../templates/Vue/component.ejs`,
            data: {
                vuexMap: false,
                lifecycleHooks: false,
                cssLang: 'css',
                scopedStyles: true
            }
        }
    },
    vuex: {
        module: {
            template: `${__dirname}/../templates/Vuex/module.ejs`,
            data: {}
        },
        action: {
            template: ``,
            data: {}
        }
    },
    router: {
        module: {
            template: `${__dirname}/../templates/Vue-router/module.ejs`,
            data: {
                moduleName: '123123'
            }
        },
        action: {
            template: ``,
            data: {}
        }
    },
}