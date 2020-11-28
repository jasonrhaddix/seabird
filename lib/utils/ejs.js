const revervedKeywords = require('../data/reservedWordsList')

module.exports = {
    dataHasReservedKeywords: data => {
        let hasReserved = false
        Object.keys(data).forEach(key => {
            if (revervedKeywords.includes(key)) hasReserved = true
        })

        return hasReserved
    }
}