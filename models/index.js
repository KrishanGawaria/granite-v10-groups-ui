var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/v7', { useNewUrlParser: true })

mongoose.Promise = Promise

var User = require("./user")
var Post = require("./post")
var Comment = require("./comment")
var Group = require("./group")
var Message = require("./message")

var models = {
  User : User,
  Post : Post,
  Comment : Comment,
  Group : Group,
  Message : Message
}

module.exports = models
