var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var rimraf = require('rimraf')//Recursif
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2

router
	.get('/', (req, res, next) => {
		fs.readdir(paths.copy, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/:folderName', (req, res, next) => {
		fs.readdir(path.join(paths.copy, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/:folderName/remove', (req, res, next) => {
		rimraf(path.join(paths.copy, req.params.folderName), err => {
			if (!err) {
				res.json({success: true, message: `Copy ${req.params.folderName} deleted`})
			}else next(err)
		})
	})
	.post('/:folderName/pull', (req, res, next) => {
		var source = path.join(masterPath, req.params.folderName)
		var destination = path.join(paths.copy, req.params.folderName)
		/*
		ncp(source, destination, err => {
			if (!err) res.json({success: true})
			else next(err)
		})
	*/
	})

module.exports = router