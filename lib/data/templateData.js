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
    }
}