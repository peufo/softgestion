var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 3

router
	.get('/', (req, res, next) => {
		if (!req.paths) {
			res.redirect('/admin')
		}else{
			res.sendFile(path.join(__dirname, '..', 'public', 'views', 'index.html'))
		}
	})
	.get('/admin', (req, res, next) => {
		res.sendFile(path.join(__dirname, '..', 'public', 'views', 'admin.html'))
	})
	.get('/paths', (req, res, next) => {
		res.json(req.paths)
	})
	.post('/paths', (req, res, next) => {
		if (req.body.master && req.body.copy && req.body.pull && req.body.backup) {
			fs.writeFile(path.join(__dirname, '..', 'data', 'paths.json'), JSON.stringify(req.body), err => {
				if (!err) {
					paths = req.body
					res.json({success: true, message: 'Paths update', paths: paths})
				}else next(err)
			})			
		}else next(Error('Donnée absente !'))
	})
	.get('/checkpwd/', (req, res, next) => {
		var pwd = fs.readFileSync(path.join(__dirname, '..', 'data', 'password'), 'utf-8')
		res.json({success: pwd == ''})
	})
	.get('/checkpwd/:pwd', (req, res, next) => {
		var pwd = fs.readFileSync(path.join(__dirname, '..', 'data', 'password'), 'utf-8')
		res.json({success: pwd == req.params.pwd})
	})
	.post('/pwd', (req, res, next) => {
		var pwd = fs.readFileSync(path.join(__dirname, '..', 'data', 'password'), 'utf-8')
		if (pwd == req.body.oldpwd) {
			fs.writeFile(path.join(__dirname, '..', 'data', 'password'), req.body.newpwd, err => {
				if (!err) {
					res.json({success: true})
				}else next(err)
			})
		}else res.json({success: false})
	})


module.exports = router