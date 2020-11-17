
module.exports = {
    set: async data => {
        let state = await _this._parseData(process.env.APP_DATA)
        Object.assign(state, data)
        
        process.env.APP_DATA = _this._stringifyData(state)
    },

    get: prop => {
        let obj = _this._parseData(process.env.APP_DATA)
        return obj[prop] || obj
    },

    _parseData: string => {
        return string ? JSON.parse(string) : {}
    },

    _stringifyData: obj => {
        return JSON.stringify(obj)
    }
}

let _this = module.exports