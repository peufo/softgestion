var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 3
var unified = require('unified')
var markdown = require('remark-parse')
var html = require('remark-html')

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
	.get('/help', (req, res, next) => {
		unified()
			.use(markdown)
			.use(html)
			.process(fs.readFileSync(path.join(__dirname, '..', 'README.md')), (err, file) => {
				if (!err) {
					//Du sale mais ca marche
					file = String(file)
							.replace(/public/g, '')
							.replace(/1. /g, '<br>1. ')
							.replace(/2. /g, '<br>2. ')
							.replace(/3. /g, '<br>3. ')
							.replace(/4. /g, '<br>4. ')
							.replace(/5. /g, '<br>5. ')
							.replace(/6. /g, '<br>6. ')

					var head = `<head><link rel="stylesheet" href="stylesheets/markdown.css"></head>`
					file = `<html>${head}<body>${file}</body></html>`
					res.send(file)
				}else next(err)
			})
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
	.post('/checkpwd', (req, res, next) => {
		var pwd = fs.readFileSync(path.join(__dirname, '..', 'data', 'password'), 'utf-8')
		res.json({success: pwd == req.body.pwd})
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