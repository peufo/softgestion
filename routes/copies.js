var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var rimraf = require('rimraf')//Recursif

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

module.exports = router