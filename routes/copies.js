var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')//Recursif
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2

//TODO rendre les chemins parametrables
var copyPath = path.join(__dirname, '..', 'copy')

router
	.get('/', (req, res, next) => {
		fs.readdir(copyPath, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		fs.readdir(path.join(copyPath, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/:folderName/remove', (req, res, next) => {
		rimraf(path.join(copyPath, req.params.folderName), err => {
			if (!err) {
				res.json({success: true, message: `Copy ${req.params.folderName} deleted`})
			}else next(err)
		})
	})
	.post('/:folderName/pull', (req, res, next) => {
		var source = path.join(masterPath, req.params.folderName)
		var destination = path.join(copyPath, req.params.folderName)
		/*
		ncp(source, destination, err => {
			if (!err) res.json({success: true})
			else next(err)
		})
	*/
	})

module.exports = router