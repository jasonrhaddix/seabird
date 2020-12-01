const download = require('download-git-repo')

module.exports = {
    downloadGitRepo: async (repoURL, appDir, downloadMessage) => {
        let regexLeadingSlash = /^\//
        // remove is URL has preceeding domain
        if (repoURL.includes('https://github.com/')) repoURL = repoURL.replace('https://github.com/', '')
        // remove is URL has preceeding forward slash (/)
        if (regexLeadingSlash.test(repoURL)) repoURL = repoURL.substring(1)
        
        return new Promise((resolve, reject) => {
            downloadMessage.start()
            download(repoURL, appDir, err => {
                if (err) {
                    downloadMessage.fail('Download failed')
                    reject()
                } else {
                    downloadMessage.succeed('Download success')
                    resolve()
                }
            })
        })       
    }
}

let _this = module.exports