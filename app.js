var createError = require('http-errors')
var express = require('express')
var path = require('path')
var paths = require('./data/paths.json') //Maintenir à jour ? lire à chaque fois ?
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var app = express()
app.listen(process.env.PORT || 3000, () => {
	console.log(`server listen on the port ${process.env.PORT}`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.normalize(paths.master)))
app.use(express.static(path.normalize(paths.copy)))
app.use(express.static(path.normalize(paths.pull)))
app.use(express.static(path.normalize(paths.backup)))


//ROUTAGE
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/masters', require('./routes/masters'))
app.use('/copies', require('./routes/copies'))
app.use('/pulls', require('./routes/pulls'))
//app.use('/backups', require('./routes/backups'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log(err)

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
