
const fs = require('fs')
const ejs = require('ejs')

const { APP_DELIMITER__SPLIT } = require('../../data/constants')
const { addWhitespace } = require('../string')

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
        let fileStr = rawFile

        for(const obj of dataObj) {          
            const MATCHER = rawFile.match(obj.regex.pattern)
            if (MATCHER.length === 0) return

            const MATCHER_USER_POS = obj.regex.position
            const MATCHER_POS_MIN = 0
            const MATCHER_POS_MAX = MATCHER.length-1
            const MATCH_INDEX = this._getMatcherPosition(MATCHER_USER_POS, MATCHER_POS_MIN, MATCHER_POS_MAX)

            // Determine whitespace
            // TODO: is there an easier way to do this.
            let strWithDelimiter = rawFile .replace(MATCHER[MATCH_INDEX], `${MATCHER[MATCH_INDEX]}${APP_DELIMITER__SPLIT}`)
            let strSplitFromDelimiter = strWithDelimiter.split(APP_DELIMITER__SPLIT)
            let idx = MATCH_INDEX === 0 ? 1 : 0
            let num = strSplitFromDelimiter[idx].match(/(?![\t])(^\s*)/)[0].length-1
            let whitespace = ''.padEnd(num)
            
            let compiledSnippet = obj.snippet ? await this._compile(obj.snippet, obj.data) : obj.data+','
            fileStr = fileStr.replace(MATCHER[MATCH_INDEX], `${MATCHER[MATCH_INDEX]}\n${whitespace}${compiledSnippet}`)
        }

        return fileStr
    }

    async _compile (snippet, data) {
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