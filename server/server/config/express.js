const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const fileUpload = require('express-fileupload')
const cors = require('cors')

module.exports = (app, config) => {

  // enable view engine - handlebars
  app.set('view engine', 'hbs')
  app.set('views', config.rootDir + '/server/views')
  
  // enable static files
  app.use(express.static(config.rootDir + '/public'))

  //enable body-parser
  //app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  //enable cookie-parser
  app.use(cookieParser())

  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: true,
    saveUninitialized: true
  }))

  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })

  app.use(fileUpload())

  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
  })

  //Allowed cors
  app.use(cors())
}