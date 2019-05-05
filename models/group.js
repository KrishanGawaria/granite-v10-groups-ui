var mongoose = require('mongoose')

var groupSchema = new mongoose.Schema({

  name : {
    type : String
  },

  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },

  members : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  ],

  messages : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Message"
    }
  ],

  posts : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ]

})

var Group = mongoose.model("Group", groupSchema)

module.exports = Group
