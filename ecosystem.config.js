var dev = process.env.NODE_ENV == 'development'
var pkg = require('./package.json')

module.exports = {
  apps : [{
    name   : !dev ? pkg.name : `${pkg.name}-dev`,
    script : "./app.js",
    max_restarts: 5,
    watch: !dev ? false : ['app.js', 'config.js', 'utils.js', 'routes', 'models']
  }]
}
