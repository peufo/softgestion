var fs = require('fs')
var path = require('path')

module.exports = {
	writelog: (folder, log, cb) => {
		log = `\n*${new Date().toLocaleString()}*\t${log}`
		fs.appendFile(path.join(folder, 'CHANGELOG.md'), log, cb)
	}
}