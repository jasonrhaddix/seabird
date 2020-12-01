const revervedKeywords = require('../data/reservedWordsList')

module.exports = {
    dataHasReservedKeywords: dataObj => {
        let hasReserved = false
        Object.keys(dataObj).forEach(key => {
            if (revervedKeywords.includes(key)) hasReserved = true
        })

        return hasReserved
    }
}