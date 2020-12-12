module.exports = {
    REGEX_PATTERN__IMPORT: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/gm,
    REGEX_PATTERN__VUE_ROUTER: /(new VueRouter)\((\r\n|\r|\n|\n\s*| *)\{/gm,
    REGEX_PATTERN__WHITESPACE: /(?![\t])(^\s*)/,
    REGEX_PATTERN__PATH: /path(\s*:\s*['|"]?\/?[a-zA-Z]+.*['|"]?)/g
}