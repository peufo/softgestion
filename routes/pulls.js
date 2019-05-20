var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var rimraf = require('rimraf')	//Remove Recursif
var ncp = require('ncp').ncp	//Copy Recursif
ncp.limit = 3

router
	.get('/', (req, res, next) => {

		fs.readdir(paths.pull, (err, pulls) => {

			pulls = pulls.map(pull => {
				logs = fs.readFileSync(path.join(paths.pull, pull, 'CHANGELOG.md'), 'utf-8').split('\n')
				return {
					log: logs[logs.length - 1],
					time: Number(pull.split('_')[1]),
					pull: pull.split('_')[0]
				}
			})

			res.json(pulls)

		})
		
	})
	.post('/accept/:folder', (req, res, next) => {
		var name = req.params.folder.split('_')[0]
		var time = req.params.folder.split('_')[1]
		var source = path.join(paths.master, name)
		var destination = path.join(paths.backup, name, String(new Date().getTime()))
		ncp(source, destination, err => {
			if (!err) {
				var log = `\n\n*${new Date().toLocaleString()}*\n#Remplacé par une nouvelle version`
				fs.appendFile(path.join(destination, 'CHANGELOG.md'), log, err => {
					if (!err) {
						source = path.join(paths.pull, req.params.folder)
						destination = path.join(paths.master, name)
						ncp(source, destination, err => {
							if (!err) {
								res.json({success: true, message: 'Modification accepté'})
							}else next(err)
						})
					}else next(err)
				})
			}else next(err)
		})
	})
	.post('/remove/:folder', (req, res, next) => {
		rimraf(path.join(paths.pull, req.params.folder), err => {
			if (!err) {
				res.json({success: true, message: `Le dossier ${req.params.folder} à été correctement supprimé !`})
			}else next(err)
		})
	})



module.exports = router