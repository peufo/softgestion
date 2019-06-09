var fs = require('fs')
var path = require('path')

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
	}
}