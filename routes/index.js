var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 3

router
	.get('/', (req, res, next) => {
		res.send('index')
	})
	.get('/admin', (req, res, next) => {
		res.render('admin')
	})
	.get('/admin/paths', (req, res, next) => {
		res.render('adminPaths')
	})
	.get('/paths', (req, res, next) => {
		res.json(paths)
	})
	.post('/paths', (req, res, next) => {
		fs.writeFile(path.join(__dirname, '..', 'data', 'paths.json'), JSON.stringify(req.body), err => {
			if (!err) {
				paths = req.body
				res.json({success: true, message: 'Paths update', paths: paths})
			}else next(err)
		})
	})


module.exports = router