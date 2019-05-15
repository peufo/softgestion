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
		//TODO: Créer le fichier d'initialisation CHANGELOG.md
		//TODO: Tester l'éxistance du dossier et traiter le cas (plutot côté client)

		var form = new formidable.IncomingForm()

		form.parse(req, (err, fields) => {
			if (!err) {
				createMaster(fields.folderName, form.openedFiles, err => {
					if (!err) {
						res.json({success: true, message: 'New master created'})
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

var createMaster = (folderName, files, cb) => {
	var test = files[0].name.split('/')
	test.shift()
	console.log(`file: ${test}`)
	fs.mkdir(path.join(paths.master, folderName), err => {
		if (!err) {
			Promise.all(files.map(f => createFilePromise(folderName, f)))
			.then(() => {
				console.log('files copied')
				cb(null)
			})
			.catch(err => {
				console.log('Failed')
				console.log(err)
				cb(err)
			})
		}else cb(err)
	})	
}


var createFilePromise = (folderName, file) => {
	var names = file.name.split('/')
	if (names.length == 2) {
		var name = names[1]
		return new Promise((resolve, reject) => {
			var newPath = path.join(paths.master, folderName, name)
			fs.rename(file.path, newPath, err => {
				if (!err) resolve()
				else reject(err)
			})
		})
	}else{
		//TODO: Faire fonctionner de manière récursive
		return new Promise(resolve => resolve())
	}

}


module.exports = router;