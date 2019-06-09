var fs = require('fs')
var path = require('path')
var createError = require('http-errors')

module.exports = {
	writeLog: (folder, log, cb) => {
		log = `${new Date().toLocaleString()}\t${log}\n`
		fs.appendFile(path.join(folder, 'CHANGELOG.md'), log, cb)
	},

	getLastLog: (folder) => {
		var logs = fs.readFileSync(path.join(folder, 'CHANGELOG.md'), 'utf-8')
		if (logs) {
			logs = logs.split('\n')
			var lastLine = logs[logs.length - 2]
			return `${lastLine.split('\t')[1]}`
		}else return ''
	},

	getLastTime: (folder) => {
		var logs = fs.readFileSync(path.join(folder, 'CHANGELOG.md'), 'utf-8')
		if (logs) {
			logs = logs.split('\n')
			var lastLine = logs[logs.length - 2]
			return new Date(lastLine.split('\t')[0]).getTime()
		}else return ''
	},

	getPaths: (req, res, next) => {
		var paths = fs.readFileSync(path.join(__dirname, 'data', 'paths.json'), 'utf-8')
		paths = JSON.parse(paths)
		var validePaths = paths.master && paths.copy && paths.pull && paths.backup
		if (!validePaths) {
			if (req.originalUrl == '/paths') {
				req.paths = paths
				next()
			}else if (req.originalUrl == '/' || req.originalUrl == '/admin' || req.originalUrl == '/checkpwd') {
				next()
			}else{
				next(Error('Paths is invalid !'))
			}
		}else{
			req.paths = paths
			next()
		}
	}
}