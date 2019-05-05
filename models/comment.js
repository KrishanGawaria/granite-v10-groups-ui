var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({

  comment : {
    type : String
  },

  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },

  replies : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Message"
    }
  ],

  private_tag : {
    type : Boolean
  }

})

var Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
