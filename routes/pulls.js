var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var paths = require('../data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var rimraf = require('rimraf')	//Remove Recursif
var ncp = require('ncp').ncp	//Copy Recursif
ncp.limit = 2

router
	.get('/', (req, res, next) => {

		fs.readdir(paths.pull, (err, pulls) => {

			pulls = pulls.map(pull => {
				logs = fs.readFileSync(path.join(paths.pull, pull, 'CHANGELOG.md'), 'utf-8').split('\n')
				return {
					log: logs[logs.length - 1],
					time: Number(pull.split('_')[1]),
					pull: pull.split('_')[0]
				}
			})

			res.json(pulls)

		})
		
	})



module.exports = router