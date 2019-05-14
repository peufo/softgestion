var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var formidable = require('formidable')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2

//TODO rendre les chemins parametrables
var masterPath = path.join(__dirname, '..', 'master')
var copyPath = path.join(__dirname, '..', 'copy')

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
				fs.mkdir(path.join(masterPath, folderName), err => {
					if (!err) {
						files.forEach(f => {
							var newPath = path.join(masterPath, f.name)
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
		fs.readdir(masterPath, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		fs.readdir(path.join(masterPath, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/:folderName/copy', (req, res, next) => {

		var source = path.join(masterPath, req.params.folderName)
		var destination = path.join(copyPath, req.params.folderName)
		
		ncp(source, destination, err => {
			if (!err) res.json({success: true})
			else next(err)
		})
	
	})

module.exports = router;