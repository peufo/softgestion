var dev = process.env.NODE_ENV == 'development'

module.exports = {
	PORT: dev ? 3001 : 3000
}