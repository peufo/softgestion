var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2

//TODO rendre les chemins parametrables
var masterPath = path.join(__dirname, '..', 'master')
var copyPath = path.join(__dirname, '..', 'copy')

router
	.post('/', (req, res, next) => {
		//TODO: creation nouveau fichier
		var folderName = req.body.folderName.replace(/[^a-zA-Z0-9]/g, '')
		var files = req.body.files.map(f => f.split('/').slice(1).join('/'))
		console.log(folderName)
		console.log(files)
		console.log(req.body.files)
		
		fs.mkdir(path.join(masterPath, folderName), err => {
			if (!err) {
				res.json({success: false})
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