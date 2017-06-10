'use strict'

//Modules
const express    = require('express'),
	  app	     = express(),
	  passport   = require('passport'),
	  bodyparser = require('body-parser'),
	  mongoose   = require('mongoose'),
	  flash		 = require('connect-flash'),
	  server     = require('http').Server(app),
	  session    = require('express-session'),
	  cookieParser = require('cookie-parser'),
	  port       = process.env.PORT || 3000;

// Archivos exportados
var User = require('./models/models')
var validationUser = require('./app/session').user
var socket = require('./app/socketServer.js')(server)

//Conection to database
mongoose.connect('mongodb://localhost/users_islove');

//archivos estaticos de la pagina (HTML,CSS,JS,FONTS)
app.use('/files',express.static('files'))

//session de express
app.use(session({
	secret: 'habivhuelaldklaksdjfsssskljlkdjkyonosoymainyasio',
	resave: false,
	saveUninitialized: false
}))

//midleware de bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

//Passport
app.use(passport.initialize());
app.use(passport.session())

//Archivo exportado de passport
require('./app/passport')(passport,User)


//flash
app.use(cookieParser());

app.use(flash())

//compila html a ejs
//para poder enviar datos de una manera mas sencilla
app.engine('html',require('ejs').renderFile)

app.use('/app/',validationUser)

//rutas
require('./app/routes')(app,passport,User)

//Puerto de escucha
server.listen(port)
console.log('Server running at 3000')