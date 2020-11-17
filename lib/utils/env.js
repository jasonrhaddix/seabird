const envinfo = require('envinfo')

module.exports = {
  getEnvInfo: async prop => { 
    return envinfo.run(
      {
          System: ['OS'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Firefox', 'Safari']
      }, { json: true }
    ).then(env => {
      let obj = JSON.parse(env)
      return obj[prop] || obj
    })
  },
}


let _this = module.exports