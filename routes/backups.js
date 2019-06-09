var express = require('express')
var router = express.Router()
var utils = require('../utils')
var fs = require('fs')
var path = require('path')

router
	.get('/', (req, res, next) => {
		fs.readdir(req.paths.backup, (err, folders) => {
			if (!err) {
				var histo = []
				folders.forEach(folder => {
					var files = fs.readdirSync(path.join(req.paths.backup, folder))

					histo.push(...getHistorique(req, folder))
				})
				res.json(histo)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		var histo = getHistorique(req, req.params.folderName)
		res.json(histo)
	})

function getHistorique(req, folder) {
	var versions = fs.readdirSync(path.join(req.paths.backup, folder))
	if (versions) {
		var backups = versions.map(version => {
			var myPath = path.join(req.paths.backup, folder, version)
			var backup = {
				log: utils.getLastLog(myPath),
				time: Number(version),
				path: myPath,
				name: folder
			}
			return backup

		})
	}
	return backups
}

module.exports = router;