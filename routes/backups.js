var express = require('express')
var router = express.Router()
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
	var files = fs.readdirSync(path.join(paths.backup, folder))
	if (files) {
		var backups = files.map(file => {
			var logs = fs.readFileSync(path.join(paths.backup, folder, file, 'CHANGELOG.md'), 'utf-8')
			if (logs) {
				logs = logs.split('\n')
				var backup = {
					log: `${logs[logs.length - 1].split('\t')[1]}`,
					time: Number(file),
					path: path.join(paths.backup, folder, file)
				}
				return backup
			}
		})
	}
	return backups
}

module.exports = router;