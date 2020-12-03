module.exports = {
    numberOfSpaces: (str) => {
        if (!str) return null
        
        let input = str
        input = input.replace(/^(\s+).*$/, "$1")

        return input.length - input.replace(/[ ]/g, "").length
    }
}

let _this = module.exports