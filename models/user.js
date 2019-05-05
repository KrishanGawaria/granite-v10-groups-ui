var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({

  name : {
    type : String
  },

  posts : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  friends : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],

  friend_requests : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],

  sent_friend_requests : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],

  groups : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Group'
    }
  ],

  inventories : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Post'
    }
  ],

  shared_inventories : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Post'
    }
  ],

  acquaintances : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],

  blocked_by_me : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  blocked_by_others : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  my_interests : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  others_interests : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  shared_inventories_by_me : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ]

})

userSchema.plugin(passportLocalMongoose)
var User = mongoose.model("User", userSchema)

module.exports = User
