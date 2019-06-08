var fs = require('fs')
var path = require('path')

module.exports = {
	writelog: (folder, log, cb) => {
		log = `\n*${new Date().toLocaleString()}*\t${log}`
		fs.appendFile(path.join(folder, 'CHANGELOG.md'), log, cb)
	},

	getLastLog: (folder) => {
		var logs = fs.readFileSync(path.join(folder, 'CHANGELOG.md'), 'utf-8')
		if (logs) {
			logs = logs.split('\n')
			return `${logs[logs.length - 1].split('\t')[1]}`
		}else return ''
	}
}