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
		fs.readdir(paths.copy, (err, sections) => {
			if (!err) {
				var copies = []
				sections.forEach(section => {
					copies = [...copies, ...fs.readdirSync(path.join(paths.copy, section)).map(copy => path.join(section, copy))]
				})
				res.json({copies: copies, sections: sections})
			}else next(err)
		})
	})
	.post('/section', (req, res, next) => {
		fs.mkdir(path.join(paths.copy, req.body.section), err => {
			if (!err) {
				res.json({success: true, message: 'Section crée avec succèes !'})
			}else next(err)
		})
	})
	.get('/:section/:folderName', (req, res, next) => {
		fs.readdir(path.join(paths.copy, req.params.section, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/:section/:folderName/remove', (req, res, next) => {
		rimraf(path.join(paths.copy, req.params.section, req.params.folderName), err => {
			if (!err) {
				res.json({success: true, message: `Copy ${req.params.folderName} deleted`})
			}else next(err)
		})
	})
	.post('/:section/:folderName/pull', (req, res, next) => {
		var source = path.join(paths.copy, req.params.section, req.params.folderName)
		var destination = path.join(paths.pull, `${req.params.folderName}_${new Date().getTime()}`)
		var log = `\n\n*${new Date().toLocaleString()}*\n#Modification proposé par {nom de l'utilisateur}\n->${req.body.comment}`
		fs.appendFile(path.join(source, 'CHANGELOG.md'), log, err => {
			if (!err) {
				ncp(source, destination, err => {
					if (!err) res.json({success: true})
					else next(err)
				})
			}else next(err)
		})
	})

module.exports = router