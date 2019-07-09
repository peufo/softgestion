var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var utils = require('../utils')
var formidable = require('formidable') //Upload files
var ncp = require('ncp').ncp	//Copy Recursif
ncp.limit = 10
var mkdirp = require('mkdirp')


router
	.post('/', (req, res, next) => {
		
		var form = new formidable.IncomingForm()

		form.parse(req, (err, fields) => {
			if (!err) {

				createMaster(req, fields.folderName, form.openedFiles, (err, backup) => {
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


var createMaster = (req, folderName, files, cb) => {

	var folders = [path.join(req.paths.master, folderName)]

	files.forEach(f => {
		var name = f.name.split('/')
		name[0] = folderName
		f.name = path.join(req.paths.master, name.join('/'))
		if (name.length > 2) {
			name.pop()
			folders.push(path.join(req.paths.master, name.join('/')))
		}
	})

	Promise.all(folders.map(createFolderPromise))
	.then(() => {
		utils.writeLog(path.join(req.paths.master, folderName), `Création du répertoire`, err => {
			if (err) return cb(err)
			Promise.all(files.map(createFilePromise))
			.then(() => {
				//Création de son répertoire dans le backup
				fs.mkdir(path.join(req.paths.backup, folderName), err => {
					if (err) return cb(err)
					//Création du premier backup
					var source = path.join(req.paths.master, folderName)
					var cible = path.join(req.paths.backup, folderName, String(new Date().getTime()))
					ncp(source, cible, err => {
						if (err) return cb(err)
						cb(null, {
							log: `Création du répertoire`,
							time: new Date().getTime(),
							path: cible,
							name: folderName
						})
					})
				})
			})
			.catch(cb)
		})
	})
	.catch(cb)
}

function createFolderPromise(folder) {
	return new Promise((resolve, reject) => {
		mkdirp(folder, err => {
			if (!err) resolve()
			else reject(err)
		})
	})
}

function createFilePromise(file) {
	return new Promise((resolve, reject) => {
		fs.rename(file.path, file.name, err => {
			if (!err) resolve()
			else reject(err)
		})
	})

}


module.exports = router;