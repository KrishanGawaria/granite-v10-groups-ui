var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models['User']
var Post = models['Post']
var Comment = models['Comment']

// LOGIC TO DISPLAY COMMENTS OF A POST
router.get('/:id/post/:post_id/comment', function(req, res){

  Post.findOne({_id : req.params.post_id}).populate('author').populate({path : 'comments', populate : {path : 'author', model : 'User'}}).exec()
  .then(function(foundPost){
    res.render('comment/comments', {foundPost : foundPost})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

// LOGIC TO CREATE A NEW COMMENT
router.post('/:id/post/:post_id/comment', function(req, res){
  // CREATING A COMMENT
  // ASSIGN PRIVATE_TAG TO IT
  // ASSIGNING author TO IT
  // PUSHING THAT COMMENT TO THE POST'S comments
  var newComment = {
    comment : req.body['comment'],
    author : req.user,
    private_tag : req.body['private_tag']=="true" ? true : false
  }

  Comment.create(newComment)
  .then(function(createdComment){
    // ASSIGNING author TO THIS COMMENT
    createdComment.author = req.user
    createdComment.save()

    // PUSHING THIS COMMENT TO THE POST'S comments
    Post.findOne({_id : req.params.post_id})
    .then(function(foundPost){
      foundPost.comments.push(createdComment)
      foundPost.save()

      res.send('Comment Posted Successfully')
    })
    .catch(function(error){
      console.log(error)
      res.send(error)
    })
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
