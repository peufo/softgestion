var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var ncp = require('ncp').ncp	//Recursif
ncp.limit = 2

var pullPath = path.join(__dirname, '..', 'pull')
var backupPath = path.join(__dirname, '..', 'backup')

router
	.get('/', (req, res, next) => {
		res.render('index', { title: 'Express' })
	})


module.exports = router