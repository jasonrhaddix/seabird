const fs = require('fs')
const ejs = require('ejs')

const { APP_DELIMITER__SPLIT } = require('../../data/constants')
const { REGEX_PATTERN__WHITESPACE } = require('../../data/regexPatterns')

const snippetDir = './sniipets/'

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
            const MATCHER = rawFile.match(obj.regex.pattern)
            // Bail is MATCHER cannot find a pattern match
            if (MATCHER.length === 0) return

            /*
            /* Determine which match to use from MATCHER.
            /* Example:
            /* Add `import` to the end of imported modules (MATCHER.length-1 || 'last')
            /* Add route module to begining of `new VueRoute({}) object
            */
            // User defined index
            const MATCHER_USER_POS = obj.regex.position
            // Minimum index
            const MATCHER_POS_MIN = 0
            // Maximum index
            const MATCHER_POS_MAX = MATCHER.length-1
            // Determine which index from user defined (number, string)
            const MATCH_INDEX = this._getMatcherPosition(MATCHER_USER_POS, MATCHER_POS_MIN, MATCHER_POS_MAX)

            /* 
            /* TODO: is there an easier way to do this.
            /* Determine whitespace
            */
            // Add delimiter to matched patter
            let strWithDelimiter = rawFile.replace(MATCHER[MATCH_INDEX], `${MATCHER[MATCH_INDEX]}${APP_DELIMITER__SPLIT}`)
            // Split text at delimiter
            let strSplitFromDelimiter = strWithDelimiter.split(APP_DELIMITER__SPLIT)
            // Use opposing index for determining whitespace
            let idx = MATCH_INDEX === 0 ? 1 : 0
            // Determine number of whitespaces
            let numOfWhitespaces = strSplitFromDelimiter[idx].match(REGEX_PATTERN__WHITESPACE)[0].length-1
            // Whitespace string
            let whitespace = ''.padEnd(numOfWhitespaces)
            
            // Compile data through template of direct text insertion
            let compiledData = obj.snippet ? await this._compileSnippet(obj.snippet, obj.data) : obj.data+','
            // Insert compiled data to file string
            fileStr = fileStr.replace(MATCHER[MATCH_INDEX], `${MATCHER[MATCH_INDEX]}\n${whitespace}${compiledData}`)
        }

        // Return file string to `generate` method
        return fileStr
    }

    async _compileSnippet (snippet, data) {
        let snippetStr = await ejs.renderFile(`${__dirname}/snippets/${snippet}.ejs`, data)
        return snippetStr
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