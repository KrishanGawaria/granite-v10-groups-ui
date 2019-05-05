var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({

  post : {
    type : String
  },

  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },

  comments : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Comment"
    }
  ],

  time : {
    type : Date,
    default : Date.now
  },

  quantity : {
    type : Number
  },

  show_access : [], // ['friend', 'acquaintance', 'unconnected']

  performa : {
    type : mongoose.Schema.ObjectId,
    ref : "Performa"
  },

  buying_from : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },

  price : {
    type : Number
  },

  children_posts : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Post"
    }
  ],

  parent_post : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post"
  },

  images : [
    // {
    //   data : Buffer,
    //   contentType : String,
    //   base64 : String
    // }
  ],

  type_of_post : {
    type : String   //  inventory / casual
  }

})

var Post = mongoose.model("Post", postSchema)

module.exports = Post
