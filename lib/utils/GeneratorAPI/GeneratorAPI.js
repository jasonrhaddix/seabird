const fs = require('fs')
const ejs = require('ejs')

const { APP_DELIMITER__SPLIT } = require('../../data/constants')
const { REGEX_PATTERN__WHITESPACE } = require('../../data/regexPatterns')
const { match } = require('assert')

// const snippetDir = 'snippets'

class GeneratorAPI {
    constructor () {

    }

    async generate (file, data) {
        let rawFile = await this._convertToString(file)
        let compiledStr = await this._insertData(rawFile, data)

        return compiledStr || null
    }

    async _convertToString (file) {
        const str = await fs.readFileSync(file, 'utf8')
        return str
    }

    async _insertData (rawFile, dataObj) {
        // Copy raw file data to variable
        let fileStr = rawFile
        
        // Loop over data object and inset data into `fileStr`
        for(const obj of dataObj) {    
            if (obj.regex.object && !rawFile.includes(`${obj.regex.object}:`)) {
                console.error(`error: '${obj.regex.object}' is an ES6 shorthand property. If the prop is an imported file, please define it in the config file.`)
                return
            }

            let regexPattern = obj.regex.object ? new RegExp(String.raw`${obj.regex.object}(?![a-zA-Z0-9_]):[\s*].*`, 'gm') : obj.regex.pattern
            console.log(obj)
            let matcher = rawFile.match(regexPattern)
            // Bail is matcher cannot find a pattern match
            if (matcher.length === 0) return
            
            /*
            /* Determine which match to use from matcher.
            /* Example:
            /* Add `import` to the end of imported modules (MATCHER.length-1 || 'last')
            /* Add route module to begining of `new VueRoute({}) object
            */
            // User defined index
            const MATCHER_USER_POS = obj.regex.position
            // Minimum index
            const MATCHER_POS_MIN = 0
            // Maximum index
            const MATCHER_POS_MAX = matcher.length-1
            // Determine which index from user defined (number, string)
            const MATCH_INDEX = this._getMatcherPosition(MATCHER_USER_POS, MATCHER_POS_MIN, MATCHER_POS_MAX)        

            /* 
            /* TODO: is there an easier way to do this.
            /* Determine whitespace
            */
            // Add delimiter to matched patter
            let strWithDelimiter = rawFile.replace(matcher[MATCH_INDEX], `${matcher[MATCH_INDEX]}${APP_DELIMITER__SPLIT}`)
            // Split text at delimiter
            let strSplitFromDelimiter = strWithDelimiter.split(APP_DELIMITER__SPLIT)
            // Use opposing index for determining whitespace
            let idx = MATCH_INDEX === 0 ? 1 : 0
            // Determine number of whitespaces  
            let openBrackets = strSplitFromDelimiter[0].match(/[\{\[]/g) || []
            let closedBrackets = strSplitFromDelimiter[0].match(/[\]\}]/g) || []
            console.log(strSplitFromDelimiter[0], openBrackets, closedBrackets)
            let numOfOpenBrackets = (openBrackets.length - closedBrackets.length)
            // Whitespace string
            let whitespace = this._getWhitespace(numOfOpenBrackets)
            
            // Compile data through template of direct text insertion
            let compiledData = obj.snippet ? await this._compileSnippet(obj.snippet, obj.data) : obj.data + ','
            // Insert compiled data to file string
            fileStr = fileStr.replace(matcher[MATCH_INDEX], `${matcher[MATCH_INDEX]}\r${whitespace}${compiledData}`)
        }

        // Return file string to `generate` method
        return fileStr
    }

    async _compileSnippet (snippet, data) {
        let snippetStr = await ejs.renderFile(`${__dirname}/snippets/${snippet}.ejs`, data)
        return snippetStr
    }

    _getWhitespace (num) {
        let whitespace = ''
        
        for(let i = 0; i < num; ++i) {
            whitespace += '\t'
        }

        return whitespace
    }

    _getMatcherPosition (userPosition, min, max) {
        const POS_DEF = userPosition || 0
        const MIN = min
        const MAX = max

        let position = POS_DEF
        if (typeof POS_DEF === 'string') {
            switch (POS_DEF) {
                case 'first' :
                default :
                    position = MIN
                    break
                case 'last' :
                    position = MAX
                    break
            }
        }

        let parsed = parseInt(position)
        return Math.min(Math.max(parsed, MIN), MAX)
    }    
}

module.exports = GeneratorAPI