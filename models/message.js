var mongoose = require('mongoose')

var messageSchema = new mongoose.Schema({

  message : {
    type : String
  },

  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }

})

var Message = mongoose.model("Message", messageSchema)

module.exports = Message
