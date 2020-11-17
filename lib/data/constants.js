
module.exports = {
    APP_CONFIG_FILE: 'vuetimate.yaml',
    APP_PACKAGE_FILE: 'package.json',
    APP_SERVICES: [
        {
            service: 'vue',
        },
        {
            service: 'vuex',
            template: null,
            path: null,
            pathTerms: [
                'store',
                'state',
                'vuex'
            ]
        },
        {
            service: 'vue-router',
            template: null,
            path: null,
            pathTerms: [
                'router'
            ]
        },
        {
            service: 'sass',
            pathTerms: [
                'css',
                'styles',
                'scss'
            ]
        },
        {
            service: 'less',
            pathTerms: [
                'css',
                'styles',
                'less'
            ]
        },
        {
            service: 'typescript',
            pathTerms: []
        }

        /* {
            service: '',
            dir: null,
            pathTerms: [
                ''
            ]
        } */
    ]
}