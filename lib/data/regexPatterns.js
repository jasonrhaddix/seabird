module.exports = {
    REGEX_PATTERN__IMPORT: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/gm,
    REGEX_PATTERN__VUE_ROUTER: /(Router)\((\r\n|\r|\n|\n\s*| *)\{/gm,
    REGEX_PATTERN__VUEX: /(?:Vuex\.Store\((\r\n|\r|\n|\n\s*| *)\{[\S\s]*).*?(?:([\S\s]*\}\)))/gm,
    // REGEX_PATTERN__VUEX_MODULES: /(?:Vuex\.Store\((\r\n|\r|\n|\n\s*| *)\{[\S\s]*)modules(\:(\s){)?([,])?(?=([\S\s]*\}\)))/gm,
    REGEX_PATTERN__VUEX_MODULES: /(?:Vuex\.Store\((\r\n|\r|\n|\n\s*| *)\{[\S\s]*)modules(\:(\s){)?([,])?(?=([\S\s]))/gm,
    REGEX_PATTERN__WHITESPACE: /(?![\t])(^\s*)/g,
    REGEX_PATTERN__PATH: /path(\s*:\s*['|"]?\/?[a-zA-Z]+.*['|"]?)/g
}