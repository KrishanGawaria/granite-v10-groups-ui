var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models['User']

// DISPLAY USER'S HOME PAGE
router.get('/:id/home', function(req, res){
  // FINDING THE CURRENT USER WITH POPULATED friends -> posts -> author
                                    // acquaintances -> posts -> author
  User.findOne({_id : req.params.id}).populate({path : 'friends', populate : {path : 'posts', model : 'Post', populate : {path : 'author', model : 'User'}}}).populate({path:'acquaintances', populate:{path:'posts', model:'Post', populate:{path:'author', model:'User'}}}).exec()
  .then(function(foundUser){

    var allPosts = []
    // FETCHING FRIEND'S POST
    foundUser.friends.forEach(function(Friend){
      // FINDING TYPE OF CONNECTION BETWEEN CURRENT USER AND HIS FRIEND ACCORDING TO HIS FRIEND
      var typeOfConnection = ''

      Friend.friends.forEach(function(foundfriend){
        if(foundfriend._id.toString() == req.user._id.toString()){
          typeOfConnection='friend'
        }
      })

      if(typeOfConnection == ''){
        typeOfConnection = 'acquaintance'
      }


      Friend.posts.forEach(function(Post){
        // CHECKING THE show_access OF POST. IF  typeOfConnection IS THERE IN show_access ARRAY, SHOW IT TO THE CURRENT USER
        var index = Post.show_access.indexOf(typeOfConnection)
        if(index != -1 ){
          allPosts.push(Post)
        }
      })
    })


    // FETCHING ACQUAINTANCE'S POST
    foundUser.acquaintances.forEach(function(Acquaintance){
      // FINDING TYPE OF CONNECTION BETWEEN CURRENT USER AND HIS FRIEND ACCORDING TO HIS FRIEND
      var typeOfConnection = ''

      Acquaintance.friends.forEach(function(foundfriend){
        if(foundfriend._id.toString() == req.user._id.toString()){
          typeOfConnection='friend'
        }
      })

      if(typeOfConnection == ''){
        typeOfConnection = 'acquaintance'
      }


      Acquaintance.posts.forEach(function(Post){
        // CHECKING THE show_access OF POST. IF  typeOfConnection IS THERE IN show_access ARRAY, SHOW IT TO THE CURRENT USER
        var index = Post.show_access.indexOf(typeOfConnection)
        if(index != -1 ){
          allPosts.push(Post)
        }
      })
    })

    // SORTING THE POSTS OF FRIENDS ACCORDING TO THE "time" IN DESCENDING ORDER
    allPosts.sort(function(a,b){
      var dateA = new Date(a.time)
      var dateB = new Date(b.time)
      return dateB - dateA;
    })

    // console.log(allPosts)
    res.render('user/home', {AllPosts : allPosts})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})




// DISPLAY FRIENDS PAGE
router.get('/:id/friends', function(req, res){

  // FETCH CURRENT USER WITH POPULATED friends ARRAY
  User.findOne({_id : req.user._id}).populate('friends').exec()
  .then(function(foundUser){
    res.render('user/friends', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})


// DISPLAY ACQUAINTANCES PAGE
router.get('/:id/acquaintances', function(req, res){

  // FETCH CURRENT USER WITH POPULATED acquaintances ARRAY
  User.findOne({_id : req.user._id}).populate('acquaintances').exec()
  .then(function(foundUser){
    res.render('user/acquaintances', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})


// DISPLAY FRIEND REQUESTS PAGE
router.get('/:id/friend-requests', function(req, res){

  // FETCH CURRENT USER WITH POPULATED friend_requests ARRAY
  User.findOne({_id : req.user._id}).populate('friend_requests').exec()
  .then(function(foundUser){
    res.render('user/friend_requests', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

// DISPLAY SENT FRIEND REQUESTS PAGE
router.get('/:id/sent-friend-requests', function(req, res){

  // FETCH CURRENT USER WITH POPULATED sent_friend_requests ARRAY
  User.findOne({_id : req.user._id}).populate('sent_friend_requests').exec()
  .then(function(foundUser){
    res.render('user/sent_friend_requests', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
