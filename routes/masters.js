var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var utils = require('../utils')
var formidable = require('formidable') //Upload files
var ncp = require('ncp').ncp	//Copy Recursif
ncp.limit = 3


router
	.post('/', (req, res, next) => {
		
		var form = new formidable.IncomingForm()

		form.parse(req, (err, fields) => {
			if (!err) {

				createMaster(fields.folderName, form.openedFiles, (err, backup) => {
					if (!err) {
						res.json({success: true, message: 'New master created', backup})
					}else next(err)
				})
				
			}else next(err)
		})
	})
	.get('/', (req, res, next) => {
		fs.readdir(req.paths.master, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		fs.readdir(path.join(req.paths.master, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})


var createMaster = (folderName, files, cb) => {
	var test = files[0].name.split('/')
	test.shift()
	fs.mkdir(path.join(req.paths.master, folderName), err => {
		if (!err) {
			utils.writeLog(path.join(req.paths.master, folderName), `Création du répertoire`, err => {
				if (!err) {
					Promise.all(files.map(f => createFilePromise(req, folderName, f)))
					.then(() => {
						//Création de son répertoire dans le backup
						fs.mkdir(path.join(req.paths.backup, folderName), err => {
							if (!err) {
								//Création du premier backup
								var source = path.join(req.paths.master, folderName)
								var cible = path.join(req.paths.backup, folderName, String(new Date().getTime()))
								ncp(source, cible, err => {
									if (!err) {
										cb(null, {
											log: `Création du répertoire`,
											time: new Date().getTime(),
											path: cible,
											name: folderName
										})
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


var createFilePromise = (req, folderName, file) => {
	var names = file.name.split('/')
	if (names.length == 2) {
		var name = names[1]
		return new Promise((resolve, reject) => {
			var newPath = path.join(req.paths.master, folderName, name)
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