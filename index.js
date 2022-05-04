const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const axios = require('axios');
// const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')


// set the view engine to ejs
app.set('view engine', 'ejs')
// set root folder for views
app.set('views', path.join(__dirname, 'views'))

// Statics
app.use(express.static(path.join(__dirname, 'static')))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Encode body
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret: 'secret',
  cookie: {maxAge: 24 * 60 * 60 * 1000},
  resave: false,
  saveUninitialized: true
}))

app.use(flash())

// app.use(cookieSession({
//   name: 'session',
//   keys: ['name', 'value'],
//   maxAge: 24 * 60 * 60 * 1000
// }))

app.use(cookieParser())

// routers
const indexRouter = require('./routes/index')

app.use(indexRouter.router)

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})

