var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp
ncp.limit = 2

//TODO: remplacer par une addresse parametrable
var masterPath = path.join(__dirname, '..', 'master')	
var copyPath = path.join(__dirname, '..', 'copy')


/* GET home page. */
router
	.get('/', (req, res, next) => {
		res.render('index', { title: 'Express' })
	})
	.get('/masters', (req, res, next) => {
		fs.readdir(masterPath, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/masters/:folderName', (req, res, next) => {
		fs.readdir(path.join(masterPath, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/copies', (req, res, next) => {
		console.log(copyPath)
		fs.readdir(copyPath, (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.get('/copies/:folderName', (req, res, next) => {
		fs.readdir(path.join(copyPath, req.params.folderName), (err, files) => {
			if (!err) {
				res.json(files)
			}else next(err)
		})
	})
	.post('/masters/:folderName/copy', (req, res, next) => {

		var source = path.join(masterPath, req.params.folderName)
		var destination = path.join(copyPath, req.params.folderName)

		console.log(source)
		console.log(destination)
		
		ncp(source, destination, err => {
			if (!err) res.json({success: true})
			else next(err)
		})
	
	})

module.exports = router