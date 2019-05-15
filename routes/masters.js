var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var formidable = require('formidable') //Upload files
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2


router
	.post('/', (req, res, next) => {
		//TODO: fare un promesse (fonction recursive ? )
		//TODO: Créer le fichier d'initialisation CHANGELOG.md
		//TODO: Tester l'éxistance du dossier et traiter le cas (plutot côté client)

		var form = new formidable.IncomingForm()
		form.parse(req, err => {
			if (!err) {
				var files = form.openedFiles
				var folderName = files[0].name.split('/')[0]
				fs.mkdir(path.join(paths.master, folderName), err => {
					if (!err) {
						files.forEach(f => {
							var newPath = path.join(paths.master, f.name)
							fs.rename(f.path, newPath, err => {
								if (!err) {
									console.log(`Loaded ${f.name}`)						
								}else next(err)
							})
						})
						res.json({success: true, message: 'Faire une promesse'})
					}else next(err)
				})
			}else next(err)
		})
	})
	.get('/', (req, res, next) => {
		fs.readdir(paths.master, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		fs.readdir(path.join(paths.master, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/:folderName/copy', (req, res, next) => {

		var source = path.join(paths.master, req.params.folderName)
		var destination = path.join(paths.copy, req.params.folderName)
		
		ncp(source, destination, err => {
			if (!err) res.json({success: true})
			else next(err)
		})
	
	})

module.exports = router;