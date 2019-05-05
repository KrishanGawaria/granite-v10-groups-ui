var express = require('express')
var router = express.Router()

var models = require('../models')
var Post = models['Post']
var User = models['User']

// LOGIC TO BLOCK AN ITEM (POST/INVENTORY)
router.post('/:id/post/:post_id/block', function(req, res){

  // CREATE A NEW INVENTORY WITH MENTIONED QUANTITY FOR CURRENT USER
  // ASSIGNING THE VALUE OF buying_from AS SOURCE POST'S AUTHOR
  // PUSHING createdInventory INTO CURRENT USER'S my_interests ARRAY
  // PUSHING SAME createdPost IN foundPost'S author'S others_interests

  var quantity = req.body['quantity']


  Post.findOne({_id : req.params.post_id}).populate('author').exec()
  .then(function(foundPost){

    // CREATE A NEW INVENTORY WITH MENTIONED QUANTITY FOR CURRENT USER
    // ASSIGNING THE VALUE OF buying_from AS SOURCE POST'S AUTHOR
    var newPost = {
      post : foundPost.post,
      quantity : Number(quantity),
      author : req.user,
      parent_post : foundPost.parent_post,
      buying_from : foundPost.author
    }

    Post.create(newPost)
    .then(function(createdPost){
        // PUSHING createdInventory INTO CURRENT USER'S my_interests ARRAY
        req.user.my_interests.push(createdPost)
        req.user.save()

        // PUSHING SAME createdPost IN foundPost'S author'S others_interests
        foundPost.author.others_interests.push(createdPost)
        foundPost.author.save()


        res.send("Added into My Interests.... Wait for Approval")

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




// LOGIC TO APPROVE THE BLOCK REQUEST
router.get('/:id/post/:post_id/approve', function(req, res){
  // FIND parent_post FROM FOUND POST, AND MODIFY QUANTITY FROM IT AND FROM ALL OF IT'S children_posts
  // DELETE THE POST FROM CURRENT USER'S others_interests AND PUT IT INTO his blocked_by_others
  // DELETE THE POST FROM POST'S AUTHOR'S my_interests AND PUT IT INTO his blocked_by_me
  // CREATE A NEW POST SAME AS foundPost AND ADD IT INTO foundPost's author's inventories



  // FIND parent_post FROM FOUND POST, AND MODIFY QUANTITY OF IT AND FROM ALL OF IT'S children_posts

  Post.findOne({_id : req.params.post_id}).populate('author').populate({path:'parent_post', populate:{path:'children_posts', model:'Post'}}).exec()
  .then(function(foundPost){

    // MODIFY PARENT POST
    foundPost.parent_post.quantity = foundPost.parent_post.quantity - foundPost.quantity
    foundPost.parent_post.save()

    // MODIFY ALL CHILDREN OF PARENT POST
    foundPost.parent_post.children_posts.forEach(function(ChildrenPost){
      ChildrenPost.quantity = ChildrenPost.quantity - foundPost.quantity
      ChildrenPost.save()
    })



    // DELETE THE POST FROM CURRENT USER'S others_interests AND PUT IT INTO his blocked_by_others
    req.user.blocked_by_others.push(foundPost)

    var index = -1
    req.user.others_interests.forEach(function(Post, i){
      if(Post._id.toString() == req.params.post_id){
        index = i
      }
    })

    req.user.others_interests.splice(index, 1)
    req.user.save()

    // DELETE THE POST FROM POST'S AUTHOR'S my_interests AND PUT IT INTO his blocked_by_me
    foundPost.author.blocked_by_me.push(foundPost)

    var index = -1
    foundPost.author.my_interests.forEach(function(Post, i){
      if(Post._id.toString() == req.params.post_id){
        index = i
      }
    })

    foundPost.author.my_interests.splice(index, 1)

    // CREATE A NEW POST SAME AS foundPost AND ADD IT INTO foundPost's author's inventories
    var newPost = {
      post : foundPost.post,
      quantity : foundPost.quantity,
      author : foundPost.author
    }

    Post.create(newPost)
    .then(function(createdPost){
      foundPost.author.inventories.push(createdPost)
      foundPost.author.save()

      res.send("Approved")
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



// DISPLAY blocked_by_me PAGE
router.get('/:id/blocked-by-me', function(req, res){

  User.findOne({_id : req.user._id}).populate({path:'blocked_by_me',populate:{path:'buying_from'}}).exec()
  .then(function(foundUser){
    res.render('block/blocked_by_me', {foundUser:foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})



// DISPLAY blocked_by_others PAGE
router.get('/:id/blocked-by-others', function(req, res){

  User.findOne({_id : req.user._id}).populate({path:'blocked_by_others',populate:{path:'author'}}).exec()
  .then(function(foundUser){
    res.render('block/blocked_by_others', {foundUser:foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
