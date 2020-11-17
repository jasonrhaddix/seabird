const child_process = require('child_process')


module.exports = {
    spawn: (command, args, options) => {
        let child
        
        const _promise = new Promise((resolve, reject) => {
            child = child_process.spawn(command, args, options)
    
            let stdout = (child.stdout && child.stdout.readable) ? Buffer.alloc(0) : null,
                stderr = (child.stderr && child.stderr.readable) ? Buffer.alloc(0) : null
             
            if (Buffer.isBuffer(stdout))
                child.stdout.on('data', (data) => stdout = Buffer.concat([ (stdout), data ]))
    
            
            if (Buffer.isBuffer(stderr))
                child.stderr.on('data', (data) => stderr = Buffer.concat([ (stderr), data ]))
                    
            child.on('error', reject)
            child.on('close', exitCode => resolve({ stdout, stderr, exitCode }))
        })
    
        Object.defineProperties((child), {
            then: { value: _promise.then.bind(_promise) },
            catch: { value: _promise.catch.bind(_promise) },
        })
        
        return (child)
    },

    exec: (command, options) => {
        let child
    
        const _promise = new Promise((resolve, reject) => {
            child = child_process.exec(command, options, (err, stdout, stderr) =>
                err ? reject(err) : resolve({ stdout, stderr })
            )
    
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', data => { process.stdout.write(data) })
            
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', data => { process.stderr.write(data) })
            child.stderr.on('error', data => { process.stderr.write(data) })
    
            child.on('close', () => {})
        })
    
        Object.defineProperties((child), {
            then: { value: _promise.then.bind(_promise) },
            catch: { value: _promise.catch.bind(_promise) },
        })
        
        return (child)
    }
}


let _this = module.exports
