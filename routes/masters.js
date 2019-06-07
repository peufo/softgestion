var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var utils = require('../utils')
var formidable = require('formidable') //Upload files
var ncp = require('ncp').ncp	//Copy Recursif
ncp.limit = 3


router
	.post('/', (req, res, next) => {
		
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


var createMaster = (folderName, files, cb) => {
	var test = files[0].name.split('/')
	test.shift()
	fs.mkdir(path.join(paths.master, folderName), err => {
		if (!err) {
			var log = `*${new Date().toLocaleString()}*\t#Création du répertoire`
			fs.writeFile(path.join(paths.master, folderName, 'CHANGELOG.md'), log, err => {
				if (!err) {
					Promise.all(files.map(f => createFilePromise(folderName, f)))
					.then(() => {
						//Création de son répertoire dans le backup
						fs.mkdir(path.join(paths.backup, folderName), err => {
							if (!err) {
								//Création du premier backup
								var source = path.join(paths.master, folderName)
								var cible = path.join(paths.backup, folderName, String(new Date().getTime()))
								ncp(source, cible, err => {
									if (!err) {
										cb(null)
									}else cb(err)
								})
							}else cb(err)
						})
					})
					.catch(cb)
				}else cb(err)
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