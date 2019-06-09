var express = require('express')
var router = express.Router()
var utils = require('../utils')
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?

router
	.get('/', (req, res, next) => {
		fs.readdir(paths.backup, (err, folders) => {
			if (!err) {
				var histo = []
				folders.forEach(folder => {
					var files = fs.readdirSync(path.join(paths.backup, folder))

					histo.push(...getHistorique(folder))
				})
				res.json(histo)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		var histo = getHistorique(req.params.folderName)
		res.json(histo)
	})

function getHistorique(folder) {
	var versions = fs.readdirSync(path.join(paths.backup, folder))
	if (versions) {
		var backups = versions.map(version => {
			var myPath = path.join(paths.backup, folder, version)
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