var express = require('express')
var app = express()

// passport packages
var passport = require('passport')
var localStrategy = require('passport-local')
var passportLocalMongoose = require('passport-local-mongoose')
var expressSession = require('express-session')

// body-parser
var bodyParser = require('body-parser')

//models
var models = require('./models')
var User = models["User"]
var Post = models["Post"]
var Comment = models["Comment"]

// routes
var indexRouter = require('./routes')
var userRouter = require('./routes/user')
var postRouter = require('./routes/post')
var exploreRouter = require('./routes/explore')
var groupRouter = require('./routes/group')
var messageRouter = require('./routes/message')
var commentRouter = require('./routes/comment')
var inventoryRouter = require('./routes/inventory')
var replyRouter = require('./routes/reply')
var blockRouter = require('./routes/block')
var interestRouter = require('./routes/interest')

// Settion View Engine
app.set("view engine", "ejs")

// Setting body-parser
app.use(bodyParser.urlencoded({extended:true}))

// PUBLIC DIRECTORY
app.use(express.static(__dirname + '/public'))


// Settion passport authentication
app.use(expressSession({
  secret : 'This is good',
  resave : false,
  saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Setting locals : This section has to be after setting passport authentication.
app.use(function(req, res, next){
  res.locals.currentUser = req.user,
  next()
})

app.use("/", indexRouter)
app.use("/", userRouter)
app.use("/", postRouter)
app.use("/", exploreRouter)
app.use("/", groupRouter)
app.use('/', messageRouter)
app.use('/', commentRouter)
app.use('/', inventoryRouter)
app.use('/', replyRouter)
app.use('/', blockRouter)
app.use('/', interestRouter)

app.get('/', function(req, res){
  res.render('main_route')
})

app.listen(5000, function(){
  console.log('Server Started ...')
})
