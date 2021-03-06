module.exports = {
    vue: {
        component: {
            template: `${__dirname}/../templates/Vue/component.ejs`,
            fileType: 'vue',
            data: {
                vuexMap: false,
                lifecycleHooks: false,
                cssLang: 'css',
                scopedStyles: true,
                helpers: true
            }
        },
        view: {
            template: `${__dirname}/../templates/Vue/component.ejs`,
            fileType: 'vue',
            data: {
                vuexMap: false,
                lifecycleHooks: false,
                cssLang: 'css',
                scopedStyles: true,
                helpers: true
            }
        }
    },
    vuex: {
        module: {
            template: `${__dirname}/../templates/Vuex/module.ejs`,
            fileType: 'js',
            data: {}
        },
        action: {
            template: ``,
            data: {}
        }
    },
    vueRouter: {
        module: {
            template: `${__dirname}/../templates/Vue-router/module.ejs`,
            fileType: 'js',
            data: {}
        },
        action: {
            template: ``,
            data: {}
        }
    },
}